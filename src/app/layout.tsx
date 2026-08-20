import type { Metadata } from 'next';
import { Fraunces, Inter } from 'next/font/google';
import './globals.css';
import { MSWProvider } from '@/components/MSWProvider';
import { QueryProvider } from '@/components/QueryProvider';
import { AppShell } from '@/components/layout/AppShell';

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['500', '600', '700'],
  style: ['normal', 'italic'],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
});

export const metadata: Metadata = {
  title: 'Schoolhouse — Student Management',
  description: 'Frontend Developer Assessment',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body>
        <QueryProvider>
          <MSWProvider>
            <AppShell>{children}</AppShell>
          </MSWProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
