import { useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ToolWindowProps {
  id: string;
  title: string;
  url: string;
  position: { x: number; y: number };
  onClose: () => void;
  onPositionChange: (position: { x: number; y: number }) => void;
}

export function ToolWindow({ id, title, url, position, onClose, onPositionChange }: ToolWindowProps) {
  const constraintsRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(position.x);
  const y = useMotionValue(position.y);
  const scale = useTransform([x, y], () => 1);

  useEffect(() => {
    x.set(position.x);
    y.set(position.y);
  }, [position, x, y]);

  return (
    <motion.div
      ref={constraintsRef}
      className="fixed inset-0 pointer-events-none z-50"
    >
      <motion.div
        drag
        dragMomentum={false}
        dragElastic={0}
        style={{ x, y, scale }}
        className="absolute pointer-events-auto"
        onDragEnd={() => {
          onPositionChange({ x: x.get(), y: y.get() });
        }}
      >
        <div className={cn(
          "bg-white rounded-lg shadow-2xl",
          "border border-gray-200",
          "w-[800px] h-[600px]",
          "flex flex-col"
        )}>
          <div className={cn(
            "flex items-center justify-between",
            "px-4 py-2 border-b",
            "bg-gray-50 rounded-t-lg"
          )}>
            <h3 className="font-medium">{title}</h3>
            <button
              onClick={onClose}
              className={cn(
                "p-1 rounded-full",
                "hover:bg-gray-200",
                "transition-colors"
              )}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1">
            <iframe
              src={url}
              title={title}
              className="w-full h-full rounded-b-lg"
              sandbox="allow-scripts allow-same-origin allow-forms"
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}