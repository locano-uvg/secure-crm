// Tipos compartidos entre la API (Express) y la Web (Next.js).

export type Role = 'admin' | 'agent' | 'viewer';

export type TicketStatus = 'open' | 'in_progress' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  role: Role;
  // Nota: en un sistema real NUNCA se expondría el hash de la contraseña.
  // Aquí se filtra a propósito (vulnerabilidad A04 / CWE-256).
  passwordHash?: string;
  createdAt: string;
}

export interface Ticket {
  id: number;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  customerName: string;
  customerEmail: string;
  assigneeId: number | null;
  assigneeName?: string | null;
  createdById: number;
  createdByName?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface DashboardStats {
  totalTickets: number;
  byStatus: Record<TicketStatus, number>;
  byPriority: Record<TicketPriority, number>;
  byAgent: { assigneeName: string; count: number }[];
  recent: Ticket[];
}
