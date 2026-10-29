import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/network/graph - Interactive Cross-Bureau Relationship Graph Data
router.get('/graph', authenticateToken, async (req, res) => {
  try {
    const { institutionId } = req.query;

    const [institutions, complaints, overlaps, coordinations] = await Promise.all([
      prisma.institution.findMany({
        where: institutionId ? { id: institutionId } : { complaints: { some: {} } },
        take: 15
      }),
      prisma.complaint.findMany({
        where: institutionId ? { institutionId } : {},
        take: 40,
        include: { institution: true }
      }),
      prisma.overlap.findMany({
        where: institutionId ? { institutionId } : {},
        include: { coordinationRecord: true }
      }),
      prisma.coordinationRecord.findMany({
        include: { overlap: true }
      })
    ]);

    const nodes = [];
    const links = [];
    const addedNodeIds = new Set();

    // 1. Institution Hub Nodes
    institutions.forEach(inst => {
      const id = `inst_${inst.id}`;
      if (!addedNodeIds.has(id)) {
        addedNodeIds.add(id);
        nodes.push({
          id,
          name: inst.name,
          label: inst.name,
          aicteId: inst.aicteId,
          type: 'INSTITUTION',
          region: inst.region,
          status: inst.status,
          size: 28,
          color: '#1B365D'
        });
      }
    });

    // 2. Department Bureau Nodes
    const bureaus = ['RB', 'PGRC', 'Legal', 'Approval', 'Regional Office'];
    bureaus.forEach(b => {
      const id = `dept_${b}`;
      if (!addedNodeIds.has(id)) {
        addedNodeIds.add(id);
        nodes.push({
          id,
          name: `${b} Bureau`,
          label: `${b} Bureau`,
          type: 'BUREAU',
          size: 24,
          color: b === 'RB' ? '#0B2545' : (b === 'PGRC' ? '#D9531E' : '#2A7221')
        });
      }
    });

    // 3. Complaint Nodes
    complaints.forEach(c => {
      const id = `comp_${c.id}`;
      if (!addedNodeIds.has(id)) {
        addedNodeIds.add(id);
        nodes.push({
          id,
          name: c.complaintNumber,
          label: c.complaintNumber,
          category: c.category,
          status: c.status,
          priority: c.priority,
          department: c.department,
          isOverdue: c.isOverdue,
          type: 'COMPLAINT',
          size: 16,
          color: c.isOverdue ? '#D9381E' : '#4A90E2'
        });

        // Link Complaint -> Institution
        links.push({
          source: id,
          target: `inst_${c.institutionId}`,
          relationship: 'FILED_AGAINST',
          color: '#9E9E9E'
        });

        // Link Complaint -> Bureau
        links.push({
          source: id,
          target: `dept_${c.department}`,
          relationship: 'HANDLED_BY',
          color: '#B0BEC5'
        });
      }
    });

    // 4. Overlap & Coordination Bridges
    overlaps.forEach(ov => {
      const idA = `comp_${ov.complaintAId}`;
      const idB = `comp_${ov.complaintBId}`;

      if (addedNodeIds.has(idA) && addedNodeIds.has(idB)) {
        links.push({
          source: idA,
          target: idB,
          relationship: 'CROSS_BUREAU_OVERLAP',
          similarity: Math.round(ov.similarityScore * 100),
          status: ov.status,
          color: '#E06D10',
          strokeWidth: 3,
          dashed: true
        });
      }
    });

    res.json({ nodes, links });
  } catch (err) {
    console.error('Network graph error:', err);
    res.status(500).json({ error: 'Failed to build case relationship network.' });
  }
});

export default router;
