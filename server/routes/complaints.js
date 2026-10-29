import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, authorizeRoles, recordAuditLog } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/complaints - Filtered & Paginated List
router.get('/', authenticateToken, async (req, res) => {
  try {
    const {
      search,
      department,
      status,
      category,
      priority,
      institutionId,
      onlyOverdue,
      onlyOverlaps,
      page = 1,
      limit = 12
    } = req.query;

    const where = {};

    // RBAC: If officer with restricted region, filter by institution region
    if (req.user.role === 'OFFICER' && req.user.region !== 'All') {
      where.institution = { region: req.user.region };
    }

    if (department && department !== 'All') {
      where.department = department;
    }

    if (status && status !== 'All') {
      where.status = status;
    }

    if (category && category !== 'All') {
      where.category = category;
    }

    if (priority && priority !== 'All') {
      where.priority = priority;
    }

    if (institutionId) {
      where.institutionId = institutionId;
    }

    if (onlyOverdue === 'true' || onlyOverdue === true) {
      where.isOverdue = true;
    }

    if (search) {
      const q = search.trim();
      where.OR = [
        { complaintNumber: { contains: q } },
        { description: { contains: q } },
        { category: { contains: q } },
        { institution: { name: { contains: q } } },
        { institution: { aicteId: { contains: q } } }
      ];
    }

    // Overlap filtering
    if (onlyOverlaps === 'true' || onlyOverlaps === true) {
      where.OR = [
        { overlapsAsA: { some: {} } },
        { overlapsAsB: { some: {} } }
      ];
    }

    const pageNum = parseInt(page, 10) || 1;
    const pageSize = parseInt(limit, 10) || 12;
    const skip = (pageNum - 1) * pageSize;

    const [total, complaints, activeOverlaps] = await Promise.all([
      prisma.complaint.count({ where }),
      prisma.complaint.findMany({
        where,
        include: {
          institution: {
            select: { id: true, name: true, aicteId: true, city: true, state: true, region: true }
          },
          assignedOfficer: {
            select: { id: true, name: true, email: true, department: true }
          },
          overlapsAsA: { select: { id: true, status: true, similarityScore: true } },
          overlapsAsB: { select: { id: true, status: true, similarityScore: true } }
        },
        orderBy: { filedDate: 'desc' },
        skip,
        take: pageSize
      }),
      prisma.overlap.findMany({
        where: { status: { in: ['FLAGGED', 'UNDER_REVIEW', 'CONFIRMED'] } },
        select: { complaintAId: true, complaintBId: true, id: true }
      })
    ]);

    // Attach active overlap marker
    const overlapIdMap = new Map();
    activeOverlaps.forEach(o => {
      overlapIdMap.set(o.complaintAId, o.id);
      overlapIdMap.set(o.complaintBId, o.id);
    });

    const enrichedComplaints = complaints.map(c => ({
      ...c,
      hasOverlap: overlapIdMap.has(c.id),
      overlapId: overlapIdMap.get(c.id) || null
    }));

    res.json({
      complaints: enrichedComplaints,
      pagination: {
        total,
        page: pageNum,
        pageSize,
        totalPages: Math.ceil(total / pageSize) || 1
      }
    });
  } catch (err) {
    console.error('Complaints fetch error:', err);
    res.status(500).json({ error: 'Failed to retrieve complaint records.' });
  }
});

// GET /api/complaints/export/csv - Stream Filtered CSV directly from DB
router.get('/export/csv', authenticateToken, async (req, res) => {
  try {
    const { department, status, category, priority, institutionId, onlyOverdue } = req.query;
    const where = {};

    if (department && department !== 'All') where.department = department;
    if (status && status !== 'All') where.status = status;
    if (category && category !== 'All') where.category = category;
    if (priority && priority !== 'All') where.priority = priority;
    if (institutionId) where.institutionId = institutionId;
    if (onlyOverdue === 'true') where.isOverdue = true;

    const complaints = await prisma.complaint.findMany({
      where,
      include: {
        institution: { select: { name: true, aicteId: true, city: true, state: true } },
        assignedOfficer: { select: { name: true } }
      },
      orderBy: { filedDate: 'desc' }
    });

    const headers = [
      'Complaint ID',
      'Complaint Number',
      'Permanent AICTE ID',
      'Institution Name',
      'Location',
      'Bureau / Cell',
      'Grievance Category',
      'Priority',
      'Status',
      'Complainant Type',
      'Source Channel',
      'Date Lodged',
      'SLA Deadline',
      'Overdue Status',
      'Assigned Officer'
    ];

    const escapeCSV = (val) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = complaints.map(c => [
      escapeCSV(c.id),
      escapeCSV(c.complaintNumber),
      escapeCSV(c.institution?.aicteId),
      escapeCSV(c.institution?.name),
      escapeCSV(`${c.institution?.city}, ${c.institution?.state}`),
      escapeCSV(c.department),
      escapeCSV(c.category),
      escapeCSV(c.priority),
      escapeCSV(c.status),
      escapeCSV(c.complainantType),
      escapeCSV(c.source),
      escapeCSV(c.filedDate.toISOString().split('T')[0]),
      escapeCSV(c.deadline.toISOString().split('T')[0]),
      escapeCSV(c.isOverdue ? 'OVERDUE' : 'ON_TRACK'),
      escapeCSV(c.assignedOfficer?.name || 'Unassigned')
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="AICTE_Grievance_Report_${new Date().toISOString().slice(0, 10)}.csv"`);
    res.send(csvContent);

    // Audit log
    await recordAuditLog({
      userId: req.user.id,
      userName: req.user.name,
      action: 'EXPORT_REPORT',
      entityType: 'COMPLAINT',
      details: { recordCount: complaints.length }
    });
  } catch (err) {
    console.error('CSV Export Error:', err);
    res.status(500).json({ error: 'Failed to generate CSV export.' });
  }
});

// GET /api/complaints/:id - Single Case Details with Full Audit Timeline
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const complaint = await prisma.complaint.findFirst({
      where: {
        OR: [{ id }, { complaintNumber: id }]
      },
      include: {
        institution: true,
        assignedOfficer: {
          select: { id: true, name: true, email: true, department: true, role: true }
        },
        actions: {
          orderBy: { createdAt: 'desc' }
        },
        overlapsAsA: {
          include: {
            complaintB: {
              include: { institution: true, assignedOfficer: true }
            },
            coordinationRecord: true
          }
        },
        overlapsAsB: {
          include: {
            complaintA: {
              include: { institution: true, assignedOfficer: true }
            },
            coordinationRecord: true
          }
        }
      }
    });

    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found.' });
    }

    // Consolidate associated overlap if exists
    const relatedOverlap =
      complaint.overlapsAsA.find(o => o.status !== 'DISMISSED') ||
      complaint.overlapsAsB.find(o => o.status !== 'DISMISSED') ||
      complaint.overlapsAsA[0] ||
      complaint.overlapsAsB[0] ||
      null;

    res.json({
      complaint,
      relatedOverlap
    });
  } catch (err) {
    console.error('Complaint detail error:', err);
    res.status(500).json({ error: 'Failed to fetch complaint details.' });
  }
});

// POST /api/complaints - Register New Complaint
router.post('/', authenticateToken, authorizeRoles('ADMIN', 'BUREAU_HEAD', 'OFFICER'), async (req, res) => {
  try {
    const {
      institutionId,
      category,
      description,
      source = 'Online Portal',
      complainantType = 'Student',
      department = 'PGRC',
      priority = 'MEDIUM',
      deadlineDays = 30
    } = req.body;

    if (!institutionId || !category || !description) {
      return res.status(400).json({ error: 'Institution ID, category, and description are required.' });
    }

    const institution = await prisma.institution.findUnique({
      where: { id: institutionId }
    });

    if (!institution) {
      return res.status(404).json({ error: 'Specified institution does not exist in AICTE database.' });
    }

    const year = new Date().getFullYear();
    const count = await prisma.complaint.count();
    const complaintNumber = `${department}-${year}-${String(count + 1).padStart(5, '0')}`;
    const deadline = new Date(Date.now() + (parseInt(deadlineDays, 10) || 30) * 86400000);

    const complaint = await prisma.complaint.create({
      data: {
        complaintNumber,
        institutionId,
        category,
        description,
        source,
        complainantType,
        department,
        assignedOfficerId: req.user.id,
        status: 'NEW',
        priority,
        deadline,
        filedDate: new Date(),
        isOverdue: false
      }
    });

    // Record registration action
    await prisma.action.create({
      data: {
        complaintId: complaint.id,
        actionType: 'STATUS_CHANGE',
        actionBy: req.user.id,
        actionByName: req.user.name,
        fromDepartment: null,
        toDepartment: department,
        remarks: `Complaint registered in central registry by ${req.user.name} (${req.user.role}). Initial status set to NEW.`
      }
    });

    // Audit log
    await recordAuditLog({
      userId: req.user.id,
      userName: req.user.name,
      action: 'CREATE_COMPLAINT',
      entityType: 'COMPLAINT',
      entityId: complaint.id,
      details: { complaintNumber, institution: institution.name }
    });

    res.status(201).json(complaint);
  } catch (err) {
    console.error('Complaint creation error:', err);
    res.status(500).json({ error: 'Failed to lodge complaint.' });
  }
});

// PATCH /api/complaints/:id/status - Status Transition State Machine
router.patch('/:id/status', authenticateToken, authorizeRoles('ADMIN', 'BUREAU_HEAD', 'OFFICER'), async (req, res) => {
  try {
    const { id } = req.params;
    const { status, remarks } = req.body;

    const validStatuses = ['NEW', 'UNDER_REVIEW', 'UNDER_PROCESS', 'TRANSFERRED', 'ESCALATED', 'DISPOSED', 'CLOSED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    const complaint = await prisma.complaint.findUnique({ where: { id } });
    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found.' });
    }

    const updated = await prisma.$transaction(async (tx) => {
      const c = await tx.complaint.update({
        where: { id },
        data: {
          status,
          resolvedDate: (status === 'DISPOSED' || status === 'CLOSED') ? new Date() : null,
          isOverdue: (status === 'DISPOSED' || status === 'CLOSED') ? false : complaint.isOverdue
        }
      });

      await tx.action.create({
        data: {
          complaintId: id,
          actionType: 'STATUS_CHANGE',
          actionBy: req.user.id,
          actionByName: req.user.name,
          remarks: remarks || `Status officially transitioned from ${complaint.status} to ${status} by ${req.user.name}.`
        }
      });

      return c;
    });

    await recordAuditLog({
      userId: req.user.id,
      userName: req.user.name,
      action: 'STATUS_UPDATE',
      entityType: 'COMPLAINT',
      entityId: id,
      details: { fromStatus: complaint.status, toStatus: status, remarks }
    });

    res.json(updated);
  } catch (err) {
    console.error('Status transition error:', err);
    res.status(500).json({ error: 'Failed to update complaint status.' });
  }
});

// POST /api/complaints/:id/transfer - Inter-Bureau Transfer Workflow
router.post('/:id/transfer', authenticateToken, authorizeRoles('ADMIN', 'BUREAU_HEAD'), async (req, res) => {
  try {
    const { id } = req.params;
    const { toDepartment, remarks } = req.body;

    if (!toDepartment) {
      return res.status(400).json({ error: 'Target bureau (toDepartment) is required.' });
    }

    const complaint = await prisma.complaint.findUnique({ where: { id } });
    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found.' });
    }

    const fromDept = complaint.department;

    const updated = await prisma.$transaction(async (tx) => {
      const c = await tx.complaint.update({
        where: { id },
        data: {
          department: toDepartment,
          status: 'TRANSFERRED'
        }
      });

      await tx.action.create({
        data: {
          complaintId: id,
          actionType: 'TRANSFER',
          actionBy: req.user.id,
          actionByName: req.user.name,
          fromDepartment: fromDept,
          toDepartment,
          remarks: remarks || `Inter-bureau transfer authorized from ${fromDept} to ${toDepartment}. Reason: Jurisdictional competence.`
        }
      });

      return c;
    });

    await recordAuditLog({
      userId: req.user.id,
      userName: req.user.name,
      action: 'TRANSFER',
      entityType: 'COMPLAINT',
      entityId: id,
      details: { fromDepartment: fromDept, toDepartment, remarks }
    });

    res.json(updated);
  } catch (err) {
    console.error('Transfer error:', err);
    res.status(500).json({ error: 'Failed to transfer complaint.' });
  }
});

// POST /api/complaints/:id/actions - Add Action Entry to Timeline
router.post('/:id/actions', authenticateToken, authorizeRoles('ADMIN', 'BUREAU_HEAD', 'OFFICER'), async (req, res) => {
  try {
    const { id } = req.params;
    const { actionType = 'REMARK', remarks, toDepartment, statusUpdate } = req.body;

    if (!remarks || !remarks.trim()) {
      return res.status(400).json({ error: 'Official remarks are required.' });
    }

    const complaint = await prisma.complaint.findUnique({ where: { id } });
    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found.' });
    }

    const result = await prisma.$transaction(async (tx) => {
      if (statusUpdate && statusUpdate !== complaint.status) {
        await tx.complaint.update({
          where: { id },
          data: {
            status: statusUpdate,
            resolvedDate: (statusUpdate === 'DISPOSED' || statusUpdate === 'CLOSED') ? new Date() : null
          }
        });
      }

      const action = await tx.action.create({
        data: {
          complaintId: id,
          actionType,
          actionBy: req.user.id,
          actionByName: req.user.name,
          fromDepartment: complaint.department,
          toDepartment: toDepartment || null,
          remarks
        }
      });

      return action;
    });

    await recordAuditLog({
      userId: req.user.id,
      userName: req.user.name,
      action: 'ADD_ACTION',
      entityType: 'COMPLAINT',
      entityId: id,
      details: { actionType, remarks, statusUpdate }
    });

    res.status(201).json(result);
  } catch (err) {
    console.error('Action creation error:', err);
    res.status(500).json({ error: 'Failed to log official action.' });
  }
});

export default router;
