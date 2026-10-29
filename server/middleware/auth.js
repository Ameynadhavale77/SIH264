import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'aicte_sih2026_super_secure_jwt_token_key_7777777';

// Authenticate JWT token
export async function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required. Please sign in.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        department: true,
        region: true,
        avatar: true
      }
    });

    if (!user) {
      return res.status(401).json({ error: 'User session invalid or expired.' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired token.' });
  }
}

// Authorize roles (RBAC)
export function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required.' });
    }

    if (req.user.role === 'ADMIN') {
      return next(); // Admin has universal access
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: `Access denied. Role '${req.user.role}' lacks permission for this action.`
      });
    }

    next();
  };
}

// Audit logger helper
export async function recordAuditLog({ userId, userName, action, entityType, entityId, ipAddress = '127.0.0.1', details }) {
  try {
    await prisma.auditLog.create({
      data: {
        userId: userId || null,
        userName: userName || 'System',
        action,
        entityType,
        entityId: entityId ? String(entityId) : null,
        ipAddress,
        details: typeof details === 'object' ? JSON.stringify(details) : details
      }
    });
  } catch (err) {
    console.error('Failed to write audit log:', err);
  }
}
