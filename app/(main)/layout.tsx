'use client';

import React from 'react';
import { Inter } from 'next/font/google';
import '../globals.css';
const inter = Inter({ subsets: ['latin'] });
// COMPONENTS
import Loader from '@/app/components/Loader';
import Head from "next/head";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Head>
        <link rel='shortcut icon' href='/favicon.ico' />
        <link
          rel='icon'
          type='image/png'
          sizes='16x16'
          href='/favicon-16x16.png'
        />
        <link
          rel='icon'
          type='image/png'
          sizes='32x32'
          href='/favicon-32x32.png'
        />
        <link rel='apple-touch-icon' href='/apple-touch-icon.png' />
        <title>Fewsats</title>
      </Head>
      <div className={`${inter.className}`}>
        <Loader />

        <div className='flex min-h-screen w-full'>
          <div className={'w-full flex-1'}>{children}</div>
        </div>
      </div>
    </>
  );
}
