declare module 'next/server' {
  import { ReactNode } from 'react';

  interface ImageResponseOptions {
    width: number;
    height: number;
  }

  export class ImageResponse {
    constructor(element: ReactNode, options: ImageResponseOptions);
  }
}
