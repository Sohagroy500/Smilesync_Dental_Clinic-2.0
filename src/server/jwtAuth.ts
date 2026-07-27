import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'smilesync_admin_jwt_secret_key_production_2026';
const JWT_EXPIRES_IN = '24h';

export interface AdminJwtPayload {
  id: number;
  full_name: string;
  email: string;
  role: string;
}

export interface AuthenticatedRequest extends Request {
  user?: AdminJwtPayload;
}

export function generateJwtToken(payload: AdminJwtPayload): string {
  return jwt.sign(
    {
      id: payload.id,
      full_name: payload.full_name,
      email: payload.email,
      role: payload.role,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

export function verifyJwtToken(token: string): AdminJwtPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AdminJwtPayload;
    return decoded;
  } catch (err) {
    return null;
  }
}

export function requireJwtAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ 
      error: 'Unauthorized', 
      message: 'Access denied. Missing Authorization header.' 
    });
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ 
      error: 'Unauthorized', 
      message: 'Invalid Authorization format. Expected Bearer token.' 
    });
  }

  const token = parts[1];
  const decoded = verifyJwtToken(token);

  if (!decoded) {
    return res.status(401).json({ 
      error: 'Unauthorized', 
      message: 'Invalid or expired access token. Please log in again.' 
    });
  }

  req.user = decoded;
  next();
}
