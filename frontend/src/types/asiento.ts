// src/types/asiento.ts
import type { Sala } from './sala';
import type { Ticket } from './ticket';

export type EstadoAsiento = 'disponible' | 'ocupado' | 'reservado' | 'inhabilitado';
export type TipoAsiento = 'estandar' | 'vip' | 'discapacitado';

export interface Asiento {
  id: number;
  sala_id: number;
  fila: string;
  numero: number;
  estado: EstadoAsiento;
  tipo: TipoAsiento;
  created_at?: string;
  updated_at?: string;

  sala?: Sala;
  tickets?: Ticket[];
}