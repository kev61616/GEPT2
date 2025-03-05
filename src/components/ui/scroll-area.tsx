'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'vertical' | 'horizontal';
}

const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(
  ({ className, orientation = 'vertical', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'relative overflow-hidden',
          orientation === 'vertical' ? 'h-full' : 'w-full',
          className
        )}
        {...props}
      >
        <div
          className={cn(
            'h-full w-full overflow-auto',
            orientation === 'vertical' ? 'overflow-x-hidden' : 'overflow-y-hidden'
          )}
        >
          {children}
        </div>
      </div>
    );
  }
);
ScrollArea.displayName = 'ScrollArea';

export { ScrollArea };
