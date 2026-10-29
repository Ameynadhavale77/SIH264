import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, authorizeRoles, recordAuditLog } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/coordination - List all cross-bureau coordination records
router.get('/', authenticateToken, async (req, res) => {
  try {
    const records = await prisma.coordinationRecord.findMany({
      include: {
        overlap: {
          include: {
            institution: { select: { id: true, name: true, aicteId: true, city: true, state: true } },
            complaintA: { select: { id: true, complaintNumber: true, category: true, department: true } },
            complaintB: { select: { id: true, complaintNumber: true, category: true, department: true } }
          }
        },
        actions: {
          orderBy: { createdAt: 'desc' }
        }
      },
      orderBy: { updatedAt: 'desc' }
    });

    const parsed = records.map(r => ({
      ...r,
      participatingBureaus: typeof r.participatingBureaus === 'string' ? JSON.parse(r.participatingBureaus) : r.participatingBureaus,
      assignedOfficers: typeof r.assignedOfficers === 'string' ? JSON.parse(r.assignedOfficers) : r.assignedOfficers,
      nextActions: r.nextActions ? (typeof r.nextActions === 'string' ? JSON.parse(r.nextActions) : r.nextActions) : []
    }));

    res.json(parsed);
  } catch (err) {
    console.error('Coordination fetch error:', err);
    res.status(500).json({ error: 'Failed to retrieve coordination records.' });
  }
});

// GET /api/coordination/:id - Single coordination record with full inter-bureau timeline
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const record = await prisma.coordinationRecord.findUnique({
      where: { id },
      include: {
        overlap: {
          include: {
            institution: true,
            complaintA: { include: { assignedOfficer: true } },
            complaintB: { include: { assignedOfficer: true } }
          }
        },
        actions: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!record) {
      return res.status(404).json({ error: 'Coordination record not found.' });
    }

    const parsed = {
      ...record,
      participatingBureaus: typeof record.participatingBureaus === 'string' ? JSON.parse(record.participatingBureaus) : record.participatingBureaus,
      assignedOfficers: typeof record.assignedOfficers === 'string' ? JSON.parse(record.assignedOfficers) : record.assignedOfficers,
      nextActions: record.nextActions ? (typeof record.nextActions === 'string' ? JSON.parse(record.nextActions) : record.nextActions) : []
    };

    res.json(parsed);
  } catch (err) {
    console.error('Coordination detail error:', err);
    res.status(500).json({ error: 'Failed to fetch coordination details.' });
  }
});

// POST /api/coordination - Create or Initialize Coordination Record for an Overlap
router.post('/', authenticateToken, authorizeRoles('ADMIN', 'BUREAU_HEAD'), async (req, res) => {
  try {
    const {
      overlapId,
      leadBureau,
      participatingBureaus,
      assignedOfficers,
      jointDirective,
      nextActions,
      deadlineDays = 14
    } = req.body;

    if (!overlapId || !leadBureau || !jointDirective) {
      return res.status(400).json({ error: 'Overlap ID, lead bureau, and joint directive memo are required.' });
    }

    const overlap = await prisma.overlap.findUnique({ where: { id: overlapId } });
    if (!overlap) {
      return res.status(404).json({ error: 'Referenced overlap not found.' });
    }

    const deadline = new Date(Date.now() + (parseInt(deadlineDays, 10) || 14) * 86400000);

    const record = await prisma.$transaction(async (tx) => {
      // Create or update coordination record
      const coord = await tx.coordinationRecord.upsert({
        where: { overlapId },
        update: {
          leadBureau,
          participatingBureaus: JSON.stringify(participatingBureaus || [overlap.departmentA, overlap.departmentB]),
          assignedOfficers: JSON.stringify(assignedOfficers || [`${req.user.name} (${leadBureau})`]),
          jointDirective,
          nextActions: nextActions ? JSON.stringify(nextActions) : null,
          deadline,
          status: 'JOINT_INQUIRY'
        },
        create: {
          overlapId,
          leadBureau,
          participatingBureaus: JSON.stringify(participatingBureaus || [overlap.departmentA, overlap.departmentB]),
          assignedOfficers: JSON.stringify(assignedOfficers || [`${req.user.name} (${leadBureau})`]),
          jointDirective,
          nextActions: nextActions ? JSON.stringify(nextActions) : null,
          deadline,
          status: 'JOINT_INQUIRY'
        }
      });

      // Update overlap status to CONFIRMED
      await tx.overlap.update({
        where: { id: overlapId },
        data: { status: 'CONFIRMED', reviewedBy: req.user.id, reviewedAt: new Date() }
      });

      // Add initial coordination action event
      await tx.coordinationAction.create({
        data: {
          coordinationRecordId: coord.id,
          actionType: 'DIRECTIVE_ISSUED',
          officerId: req.user.id,
          officerName: req.user.name,
          bureau: req.user.department,
          notes: jointDirective
        }
      });

      return coord;
    });

    await recordAuditLog({
      userId: req.user.id,
      userName: req.user.name,
      action: 'JOINT_DIRECTIVE',
      entityType: 'COORDINATION',
      entityId: record.id,
      details: { leadBureau, overlapId, jointDirective }
    });

    res.status(201).json(record);
  } catch (err) {
    console.error('Coordination creation error:', err);
    res.status(500).json({ error: 'Failed to create coordination record.' });
  }
});

// POST /api/coordination/:id/actions - Add Inter-Bureau Action Event
router.post('/:id/actions', authenticateToken, authorizeRoles('ADMIN', 'BUREAU_HEAD', 'OFFICER'), async (req, res) => {
  try {
    const { id } = req.params;
    const { actionType = 'DIRECTIVE_ISSUED', notes, nextStatusUpdate } = req.body;

    if (!notes || !notes.trim()) {
      return res.status(400).json({ error: 'Action notes/memo are required.' });
    }

    const record = await prisma.coordinationRecord.findUnique({ where: { id } });
    if (!record) {
      return res.status(404).json({ error: 'Coordination record not found.' });
    }

    const action = await prisma.$transaction(async (tx) => {
      if (nextStatusUpdate && nextStatusUpdate !== record.status) {
        await tx.coordinationRecord.update({
          where: { id },
          data: { status: nextStatusUpdate }
        });
      }

      const act = await tx.coordinationAction.create({
        data: {
          coordinationRecordId: id,
          actionType,
          officerId: req.user.id,
          officerName: req.user.name,
          bureau: req.user.department,
          notes
        }
      });

      return act;
    });

    await recordAuditLog({
      userId: req.user.id,
      userName: req.user.name,
      action: 'ADD_COORDINATION_ACTION',
      entityType: 'COORDINATION',
      entityId: id,
      details: { actionType, notes, nextStatusUpdate }
    });

    res.status(201).json(action);
  } catch (err) {
    console.error('Coordination action error:', err);
    res.status(500).json({ error: 'Failed to append coordination action.' });
  }
});

export default router;
