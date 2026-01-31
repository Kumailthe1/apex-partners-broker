import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from './providers';
import { ReduxProvider } from '@/components/ReduxProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'STARTRADER - Accurate Forex & Crypto Trading',
  description:
    'STARTRADER - Accurate Forex & Crypto signals with smart risk management. Consistent growth, not promises. Trade London & New York sessions with clarity & discipline.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body className={inter.className}>
        <ReduxProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}