import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/audit-logs - Official Consequential Action Log Trail
router.get('/', authenticateToken, authorizeRoles('ADMIN', 'BUREAU_HEAD'), async (req, res) => {
  try {
    const { action, entityType, limit = 50 } = req.query;
    const where = {};

    if (action && action !== 'All') where.action = action;
    if (entityType && entityType !== 'All') where.entityType = entityType;

    const logs = await prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit, 10) || 50
    });

    const parsed = logs.map(l => ({
      ...l,
      details: l.details ? (typeof l.details === 'string' && (l.details.startsWith('{') || l.details.startsWith('[')) ? JSON.parse(l.details) : l.details) : null
    }));

    res.json(parsed);
  } catch (err) {
    console.error('Audit logs fetch error:', err);
    res.status(500).json({ error: 'Failed to retrieve compliance audit logs.' });
  }
});

export default router;
