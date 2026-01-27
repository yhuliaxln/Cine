// src/types/sala.ts
import type { Asiento } from './asiento';
import type { Funcion } from './funcion';

export interface Sala {
  id: number;
  nombre: string;
  capacidad: number;
  tipo: string;
  created_at?: string;
  updated_at?: string;

  asientos?: Asiento[];
  funciones?: Funcion[];
}