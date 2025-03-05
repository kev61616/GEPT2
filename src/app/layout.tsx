import './globals.css';
import type { Metadata } from 'next';
import { LayoutProvider } from '@/contexts/LayoutContext';

export const metadata: Metadata = {
  title: 'GEPT - Responsive Testing Screen',
  description: 'A responsive testing screen for GEPT',
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
