// src/types/funcion.ts
import type { Pelicula } from './pelicula';
import type { Sala } from './sala';
import type { Ticket } from './ticket';

export interface Funcion {
  id: number;
  pelicula_id: number;
  sala_id: number;
  fecha_hora_inicio: string;
  fecha_hora_fin: string;
  precio: number;
  created_at?: string;
  updated_at?: string;

  pelicula?: Pelicula;
  sala?: Sala;
  tickets?: Ticket[];
}