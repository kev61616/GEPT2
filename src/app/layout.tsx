import './globals.css';
import type { Metadata } from 'next';
import { LayoutProvider } from '@/contexts/LayoutContext';

export const metadata: Metadata = {
  title: 'Testing Interface Hub',
  description: 'A hub for different testing interfaces including GEPT and SAT',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <LayoutProvider>
          {children}
        </LayoutProvider>
      </body>
    </html>
  );
}
