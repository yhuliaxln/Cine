// src/types/react.d.ts (o src/vite-env.d.ts)
/// <reference types="vite/client" />

declare module '*.jsx' {
  import React from 'react';
  const Component: React.FC<any>;
  export default Component;
}

declare module '*.tsx' {
  import React from 'react';
  const Component: React.FC<any>;
  export default Component;
}