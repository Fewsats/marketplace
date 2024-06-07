'use client';

import { Inter } from 'next/font/google';
import { Provider } from 'react-redux';
import './globals.css';
import store from '@/app/store/store';
import { GoogleAnalytics } from '@next/third-parties/google';
const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const GAID = process.env.NEXT_PUBLIC_GA || '';
  return (
    <html lang='en'>
      <body className={inter.className}>
        <Provider store={store}>{children}</Provider>
      </body>
      <GoogleAnalytics gaId={GAID} />
    </html>
  );
}
