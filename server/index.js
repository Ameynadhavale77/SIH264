import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

import authRoutes from './routes/auth.js';
import complaintRoutes from './routes/complaints.js';
import institutionRoutes from './routes/institutions.js';
import overlapRoutes from './routes/overlaps.js';
import coordinationRoutes from './routes/coordination.js';
import reportRoutes from './routes/reports.js';
import notificationRoutes from './routes/notifications.js';
import networkRoutes from './routes/network.js';
import auditLogRoutes from './routes/auditLogs.js';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5001;

// Middlewares — allow configured frontend URL + localhost for dev
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:4173',
  'http://127.0.0.1:5173',
].filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    // allow non-browser clients (curl, Postman) and whitelisted origins
    if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
      return cb(null, true);
    }
    cb(new Error(`CORS: Origin ${origin} not allowed`));
  },
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/institutions', institutionRoutes);
app.use('/api/overlaps', overlapRoutes);
app.use('/api/coordination', coordinationRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/network', networkRoutes);
app.use('/api/audit-logs', auditLogRoutes);

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const userCount = await prisma.user.count();
    const complaintCount = await prisma.complaint.count();
    res.json({
      status: 'HEALTHY',
      service: 'AICTE SIH 2026 PS 264 Integrated Complaint & Overlap Detection API',
      timestamp: new Date().toISOString(),
      database: 'CONNECTED',
      stats: { users: userCount, complaints: complaintCount }
    });
  } catch (err) {
    res.status(503).json({ status: 'DEGRADED', error: err.message });
  }
});

// Periodic Scheduled Task: Deadline & SLA Overdue Monitor (runs every 60 seconds)
async function checkDeadlinesAndEscalate() {
  try {
    const now = new Date();
    const overdueComplaints = await prisma.complaint.findMany({
      where: {
        deadline: { lt: now },
        status: { notIn: ['DISPOSED', 'CLOSED'] },
        isOverdue: false
      },
      include: { assignedOfficer: true }
    });

    for (const c of overdueComplaints) {
      await prisma.complaint.update({
        where: { id: c.id },
        data: { isOverdue: true, priority: 'HIGH' }
      });

      if (c.assignedOfficerId) {
        await prisma.notification.create({
          data: {
            userId: c.assignedOfficerId,
            type: 'DEADLINE_WARNING',
            title: `SLA Overdue: Case #${c.complaintNumber}`,
            message: `Grievance SLA deadline expired on ${c.deadline.toISOString().split('T')[0]}. Auto-escalation triggered.`,
            relatedComplaintId: c.id,
            deliveryStatus: 'DELIVERED'
          }
        });
      }
    }
  } catch (err) {
    console.error('SLA Escalation Worker Error:', err);
  }
}

// Start periodic SLA check worker
setInterval(checkDeadlinesAndEscalate, 60000);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`🏛️ AICTE Backend Server listening on port ${PORT}`);
  console.log(`📡 API Health Check: http://localhost:${PORT}/api/health`);
});
