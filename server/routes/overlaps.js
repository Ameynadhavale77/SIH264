import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, authorizeRoles, recordAuditLog } from '../middleware/auth.js';
import {
  analyzeComplaintPair,
  scanDatabaseForOverlaps,
  evaluateBenchmark
} from '../services/overlapEngine.js';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/overlaps - Overlaps List with Explainable Signals
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { status, matchType, minScore = 0, search } = req.query;

    const where = {};
    if (status && status !== 'All') where.status = status;
    if (matchType && matchType !== 'All') where.matchType = matchType;
    if (parseFloat(minScore) > 0) where.similarityScore = { gte: parseFloat(minScore) };

    if (search) {
      const q = search.trim();
      where.OR = [
        { institution: { name: { contains: q } } },
        { institution: { aicteId: { contains: q } } },
        { id: { contains: q } },
        { complaintAId: { contains: q } },
        { complaintBId: { contains: q } }
      ];
    }

    const overlaps = await prisma.overlap.findMany({
      where,
      include: {
        institution: { select: { id: true, name: true, aicteId: true, city: true, state: true } },
        complaintA: {
          select: {
            id: true,
            complaintNumber: true,
            department: true,
            category: true,
            description: true,
            status: true,
            priority: true,
            filedDate: true,
            assignedOfficer: { select: { name: true } }
          }
        },
        complaintB: {
          select: {
            id: true,
            complaintNumber: true,
            department: true,
            category: true,
            description: true,
            status: true,
            priority: true,
            filedDate: true,
            assignedOfficer: { select: { name: true } }
          }
        },
        coordinationRecord: true
      },
      orderBy: { similarityScore: 'desc' }
    });

    const parsed = overlaps.map(o => ({
      ...o,
      matchedSignals: typeof o.matchedSignals === 'string' ? JSON.parse(o.matchedSignals) : o.matchedSignals,
      differences: typeof o.differences === 'string' ? JSON.parse(o.differences) : o.differences
    }));

    res.json(parsed);
  } catch (err) {
    console.error('Overlaps fetch error:', err);
    res.status(500).json({ error: 'Failed to retrieve overlap records.' });
  }
});

// GET /api/overlaps/:id - Deep Side-by-Side Comparison
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const overlap = await prisma.overlap.findUnique({
      where: { id },
      include: {
        institution: true,
        complaintA: {
          include: {
            assignedOfficer: true,
            actions: { orderBy: { createdAt: 'desc' }, take: 4 }
          }
        },
        complaintB: {
          include: {
            assignedOfficer: true,
            actions: { orderBy: { createdAt: 'desc' }, take: 4 }
          }
        },
        coordinationRecord: {
          include: {
            actions: { orderBy: { createdAt: 'desc' } }
          }
        }
      }
    });

    if (!overlap) {
      return res.status(404).json({ error: 'Overlap record not found.' });
    }

    const parsed = {
      ...overlap,
      matchedSignals: typeof overlap.matchedSignals === 'string' ? JSON.parse(overlap.matchedSignals) : overlap.matchedSignals,
      differences: typeof overlap.differences === 'string' ? JSON.parse(overlap.differences) : overlap.differences
    };

    res.json(parsed);
  } catch (err) {
    console.error('Overlap detail error:', err);
    res.status(500).json({ error: 'Failed to fetch overlap comparison details.' });
  }
});

// POST /api/overlaps/scan - Trigger Genuine Overlap Detection Across Active Complaints
router.post('/scan', authenticateToken, authorizeRoles('ADMIN', 'BUREAU_HEAD'), async (req, res) => {
  try {
    const { threshold = 0.55 } = req.body;
    const discovered = await scanDatabaseForOverlaps(prisma, threshold);

    let createdCount = 0;
    for (const item of discovered) {
      // Check if pair already recorded in either direction
      const existing = await prisma.overlap.findFirst({
        where: {
          OR: [
            { complaintAId: item.complaintAId, complaintBId: item.complaintBId },
            { complaintAId: item.complaintBId, complaintBId: item.complaintAId }
          ]
        }
      });

      if (!existing) {
        const id = `OV_AUTO_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
        await prisma.overlap.create({
          data: {
            id,
            ...item
          }
        });
        createdCount++;
      }
    }

    await recordAuditLog({
      userId: req.user.id,
      userName: req.user.name,
      action: 'OVERLAP_SCAN',
      entityType: 'OVERLAP',
      details: { discovered: discovered.length, newlyCreated: createdCount, threshold }
    });

    res.json({
      message: `Overlap detection scan complete. Processed active complaint pool with threshold ${threshold}.`,
      totalDiscovered: discovered.length,
      newlyCreated: createdCount
    });
  } catch (err) {
    console.error('Scan error:', err);
    res.status(500).json({ error: 'Failed to execute overlap scan.' });
  }
});

// POST /api/overlaps/:id/review - Human Review (Confirm / Dismiss / Re-evaluate)
router.post('/:id/review', authenticateToken, authorizeRoles('ADMIN', 'BUREAU_HEAD', 'OFFICER'), async (req, res) => {
  try {
    const { id } = req.params;
    const { decision, remarks } = req.body; // CONFIRMED, DISMISSED, UNDER_REVIEW

    const validDecisions = ['CONFIRMED', 'DISMISSED', 'UNDER_REVIEW'];
    if (!validDecisions.includes(decision)) {
      return res.status(400).json({ error: `Invalid review decision. Must be one of: ${validDecisions.join(', ')}` });
    }

    const overlap = await prisma.overlap.findUnique({ where: { id } });
    if (!overlap) {
      return res.status(404).json({ error: 'Overlap record not found.' });
    }

    const updated = await prisma.overlap.update({
      where: { id },
      data: {
        status: decision,
        reviewedBy: req.user.id,
        reviewedAt: new Date()
      }
    });

    // Record audit feedback
    await recordAuditLog({
      userId: req.user.id,
      userName: req.user.name,
      action: decision === 'CONFIRMED' ? 'OVERLAP_CONFIRM' : 'OVERLAP_DISMISS',
      entityType: 'OVERLAP',
      entityId: id,
      details: { decision, remarks, similarityScore: overlap.similarityScore }
    });

    res.json(updated);
  } catch (err) {
    console.error('Review error:', err);
    res.status(500).json({ error: 'Failed to record overlap review.' });
  }
});

// GET /api/overlaps/benchmark/evaluate - Run Engine Benchmark Evaluation
router.get('/benchmark/evaluate', authenticateToken, async (req, res) => {
  try {
    const { threshold = 0.65 } = req.query;
    const benchmarkCases = await prisma.benchmarkCase.findMany();

    const result = evaluateBenchmark(benchmarkCases, parseFloat(threshold));
    res.json(result);
  } catch (err) {
    console.error('Benchmark error:', err);
    res.status(500).json({ error: 'Failed to evaluate benchmark cases.' });
  }
});

export default router;
