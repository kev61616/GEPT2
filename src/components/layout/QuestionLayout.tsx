'use client';

import { ReactNode, useEffect } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { EnhancedBreadcrumb } from '@/components/features/Breadcrumb';
import { QuestionProvider } from '@/contexts/QuestionContext';
import { useLayout } from '@/contexts/LayoutContext';

interface QuestionLayoutProps {
  children: ReactNode;
}

export function QuestionLayout({ children }: QuestionLayoutProps) {
  const { setIsSATLayout } = useLayout();

  // Set the isSATLayout flag to true when the component mounts
  useEffect(() => {
    setIsSATLayout(true);
    return () => {
      setIsSATLayout(false);
    };
  }, [setIsSATLayout]);

  return (
    <QuestionProvider>
      <div className="flex min-h-screen bg-white">
        <Sidebar />
        <div className="flex-1 flex flex-col ml-14">
          <EnhancedBreadcrumb />
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </div>
    </QuestionProvider>
  );
}
