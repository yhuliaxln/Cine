// src/types/user.ts
import type { Ticket } from './ticket';

export type UserRole = 'admin' | 'empleado' | 'cliente';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  email_verified_at?: string | null;
  created_at?: string;
  updated_at?: string;

  tickets?: Ticket[];
}

export interface AuthResponse {
  token: string;
  user: User;
}