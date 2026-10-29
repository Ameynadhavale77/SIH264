import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/institutions - Directory List with Aggregated Incident Metrics
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { search, region, type, status, filterOverlapOnly, page = 1, limit = 12 } = req.query;

    const where = {};

    if (region && region !== 'All') {
      where.region = region;
    }

    if (type && type !== 'All') {
      where.type = type;
    }

    if (status && status !== 'All') {
      where.status = status;
    }

    if (search) {
      const q = search.trim();
      where.OR = [
        { name: { contains: q } },
        { aicteId: { contains: q } },
        { city: { contains: q } },
        { state: { contains: q } }
      ];
    }

    const institutions = await prisma.institution.findMany({
      where,
      include: {
        complaints: {
          select: { id: true, status: true, priority: true }
        },
        overlaps: {
          select: { id: true, status: true }
        }
      },
      orderBy: { name: 'asc' }
    });

    // Compute aggregated metrics per institution
    let enriched = institutions.map(inst => {
      const totalComplaints = inst.complaints.length;
      const activeComplaints = inst.complaints.filter(c => c.status !== 'DISPOSED' && c.status !== 'CLOSED').length;
      const criticalComplaints = inst.complaints.filter(c => c.priority === 'CRITICAL').length;
      const activeOverlaps = inst.overlaps.filter(o => o.status !== 'DISMISSED').length;

      return {
        id: inst.id,
        aicteId: inst.aicteId,
        name: inst.name,
        city: inst.city,
        state: inst.state,
        region: inst.region,
        type: inst.type,
        status: inst.status,
        approvalYear: inst.approvalYear,
        totalComplaints,
        activeComplaints,
        criticalComplaints,
        activeOverlaps
      };
    });

    if (filterOverlapOnly === 'true' || filterOverlapOnly === true) {
      enriched = enriched.filter(i => i.activeOverlaps > 0);
    }

    const total = enriched.length;
    const pageNum = parseInt(page, 10) || 1;
    const pageSize = parseInt(limit, 10) || 12;
    const paginated = enriched.slice((pageNum - 1) * pageSize, pageNum * pageSize);

    res.json({
      institutions: paginated,
      pagination: {
        total,
        page: pageNum,
        pageSize,
        totalPages: Math.ceil(total / pageSize) || 1
      }
    });
  } catch (err) {
    console.error('Institutions fetch error:', err);
    res.status(500).json({ error: 'Failed to retrieve institution directory.' });
  }
});

// GET /api/institutions/:id - 360-Degree Institutional Profile
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const institution = await prisma.institution.findFirst({
      where: {
        OR: [{ id }, { aicteId: id }]
      },
      include: {
        complaints: {
          include: {
            assignedOfficer: { select: { name: true, department: true } }
          },
          orderBy: { filedDate: 'desc' }
        },
        overlaps: {
          include: {
            complaintA: { select: { id: true, complaintNumber: true, department: true, category: true, description: true } },
            complaintB: { select: { id: true, complaintNumber: true, department: true, category: true, description: true } },
            coordinationRecord: true
          },
          orderBy: { similarityScore: 'desc' }
        }
      }
    });

    if (!institution) {
      return res.status(404).json({ error: 'Institution not found.' });
    }

    // Breakdown computations
    const deptWorkload = {};
    const categoryBreakdown = {};
    let activeCases = 0;
    let overdueCases = 0;
    let disposedCases = 0;

    institution.complaints.forEach(c => {
      deptWorkload[c.department] = (deptWorkload[c.department] || 0) + 1;
      categoryBreakdown[c.category] = (categoryBreakdown[c.category] || 0) + 1;
      if (c.status === 'DISPOSED' || c.status === 'CLOSED') disposedCases++;
      else activeCases++;
      if (c.isOverdue) overdueCases++;
    });

    res.json({
      institution,
      metrics: {
        totalComplaints: institution.complaints.length,
        activeCases,
        overdueCases,
        disposedCases,
        overlapCount: institution.overlaps.length,
        deptWorkload,
        categoryBreakdown
      }
    });
  } catch (err) {
    console.error('Institution profile error:', err);
    res.status(500).json({ error: 'Failed to fetch institution profile.' });
  }
});

export default router;
