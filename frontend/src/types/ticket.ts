// src/types/ticket.ts
import type { Funcion } from './funcion';
import type { Asiento } from './asiento';
import type { User } from './user';

export interface Ticket {
  id: number;
  funcion_id: number;
  asiento_id: number;
  user_id: number;
  precio: number;
  estado: string;
  metodo_pago?: string;
  created_at?: string;
  updated_at?: string;

  funcion?: Funcion;
  asiento?: Asiento;
  usuario?: User;
}