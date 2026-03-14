// ── Enums ──────────────────────────────────────────────

export enum UserRole {
  CUSTOMER = "CUSTOMER",
  ADMIN = "ADMIN",
}

export enum TicketStatus {
  OPEN = "OPEN",
  RESERVED = "RESERVED",
  SOLD = "SOLD",
}

export enum EventType {
  CONCERT = "CONCERT",
  FESTIVAL = "FESTIVAL",
  CONFERENCE = "CONFERENCE",
  OTHER = "OTHER",
}

export enum TransactionStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
}

// ── Models ─────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface Event {
  id: string;
  name: string;
  description: string;
  capacity: number;
  amount: number;
  type: EventType;
  eventDate: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Ticket {
  id: string;
  ticketCode: string;
  seatNumber: number;
  status: TicketStatus;
  eventId: string;
  userId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  amount: number;
  eventId: string;
  ticketId: string;
  userId: string;
  status: TransactionStatus;
  createdAt: string;
  updatedAt: string;
}

export interface EventMonitor {
  id: string;
  name: string;
  type: EventType;
  capacity: number;
  amount: number;
  isActive: boolean;
  openTickets: number;
  reservedTickets: number;
  soldTickets: number;
  totalRevenue: number;
  occupancyRate: number;
  createdAt: string;
}

export interface TicketWithEvent extends Ticket {
  event: { name: string };
  transaction: { id: string; status: string } | null;
}

export interface ApiMessageResponse {
  message: string;
}

export interface ApiErrorResponse {
  message: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
