// src/types/pelicula.ts
import type { Funcion } from './funcion';  // ← importamos Funcion

export interface Pelicula {
  id: number;
  titulo: string;
  descripcion?: string | null;
  duracion: number;
  genero?: string | null;
  fecha_estreno?: string | null;
  url_poster?: string | null;
  clasificacion?: string | null;
  en_cartelera: boolean;
  created_at?: string;
  updated_at?: string;

  funciones?: Funcion[];  // ← ahora sí reconoce Funcion
}