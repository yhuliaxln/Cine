import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

// src/types/index.ts

export * from './pelicula';
export * from './funcion';
export * from './sala';
export * from './asiento';
export * from './ticket';
export * from './user';