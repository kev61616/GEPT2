import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import '@/styles/globals.css';

import { QuestionProvider } from '@/contexts/QuestionContext';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Math Learning Platform',
  description: 'Interactive mathematics learning platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <TooltipProvider delayDuration={0}>
            <QuestionProvider>
              {children}
            </QuestionProvider>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}