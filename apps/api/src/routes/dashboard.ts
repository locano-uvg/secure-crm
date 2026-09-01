import { Router } from 'express';
import { db } from '../db';
import { authenticate } from '../middleware/auth';

export const dashboardRouter = Router();
dashboardRouter.use(authenticate);

// GET /api/dashboard  -> métricas para los gráficos del panel.
dashboardRouter.get('/', (_req, res) => {
  const total = (db.prepare('SELECT COUNT(*) AS c FROM tickets').get() as any).c;

  const statusRows = db.prepare('SELECT status, COUNT(*) AS c FROM tickets GROUP BY status').all() as any[];
  const byStatus: Record<string, number> = { open: 0, in_progress: 0, closed: 0 };
  statusRows.forEach((r) => (byStatus[r.status] = r.c));

  const prioRows = db.prepare('SELECT priority, COUNT(*) AS c FROM tickets GROUP BY priority').all() as any[];
  const byPriority: Record<string, number> = { low: 0, medium: 0, high: 0, urgent: 0 };
  prioRows.forEach((r) => (byPriority[r.priority] = r.c));

  const byAgent = db
    .prepare(
      `SELECT COALESCE(u.full_name, 'Sin asignar') AS assigneeName, COUNT(*) AS count
       FROM tickets t LEFT JOIN users u ON u.id = t.assignee_id
       GROUP BY t.assignee_id ORDER BY count DESC`
    )
    .all();

  const recent = db
    .prepare(
      `SELECT t.*, a.full_name AS assignee_name FROM tickets t
       LEFT JOIN users a ON a.id = t.assignee_id
       ORDER BY t.created_at DESC LIMIT 5`
    )
    .all() as any[];

  res.json({
    totalTickets: total,
    byStatus,
    byPriority,
    byAgent,
    recent: recent.map((r) => ({
      id: r.id, title: r.title, status: r.status, priority: r.priority,
      customerName: r.customer_name, assigneeName: r.assignee_name,
      createdAt: r.created_at,
    })),
  });
});
