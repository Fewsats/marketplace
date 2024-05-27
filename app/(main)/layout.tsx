'use client';

import React from 'react';
import { Inter } from 'next/font/google';
import '../globals.css';
const inter = Inter({ subsets: ['latin'] });
// COMPONENTS
import Loader from '@/app/components/Loader';

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`${inter.className}`}>
      <Loader />

      <div className='flex min-h-screen w-full'>
        <div className={'w-full flex-1'}>{children}</div>
      </div>
    </div>
  );
}
