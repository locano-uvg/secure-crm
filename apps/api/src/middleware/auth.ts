import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthedRequest extends Request {
  user?: { sub: number; username: string; role: string };
}

// Verificación de JWT ROTA (A07 Authentication Failures / CWE-347).
// Se decodifica el token SIN validar la firma: cualquiera puede forjar
// un token con el rol que quiera (p.ej. cambiar "role":"viewer" -> "admin").
export function authenticate(req: AuthedRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization || '';
  const bearer = header.startsWith('Bearer ') ? header.slice(7) : null;
  const token = bearer || (req as any).cookies?.session;

  if (!token) {
    return res.status(401).json({ error: 'No autenticado' });
  }

  // jwt.decode NO verifica la firma. La firma se ignora por completo.
  const payload = jwt.decode(token) as any;
  if (!payload) {
    return res.status(401).json({ error: 'Token inválido' });
  }

  req.user = { sub: payload.sub, username: payload.username, role: payload.role };
  next();
}
