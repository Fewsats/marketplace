'use client';

import { useEffect } from 'react';
import { Inter } from 'next/font/google';
import { Provider } from 'react-redux';
import './globals.css';
import store from '@/app/store/store';
import { GoogleAnalytics } from '@next/third-parties/google';
const inter = Inter({ subsets: ['latin'] });
import { init } from '@getalby/bitcoin-connect-react';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    init({ appName: 'Fewsats' });
  }, []);

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
