import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TimerDisplayProps extends Omit<HTMLMotionProps<'div'>, 'className'> {
  variant?: 'default' | 'minimal' | 'pill' | 'card' | 'gradient' | 'outline' | 'split' | 'glow' | 'modern' | 'compact';
  time?: string;
}

export function TimerDisplay({ variant = 'default', time = '00:01:13', ...props }: TimerDisplayProps) {
  const variants = {
    default: "text-xl font-mono text-gray-600",
    minimal: "text-lg font-mono tracking-wider text-gray-700",
    pill: "px-4 py-1.5 bg-gray-100 rounded-full font-mono text-gray-700",
    card: "px-4 py-2 bg-white shadow-sm rounded-lg font-mono text-gray-700 border",
    gradient: "px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg font-mono",
    outline: "px-4 py-1.5 border-2 border-indigo-500 text-indigo-600 rounded-lg font-mono",
    split: "flex items-center gap-1 font-mono text-lg",
    glow: "px-4 py-2 bg-indigo-500 text-white rounded-lg font-mono shadow-lg shadow-indigo-500/20",
    modern: "flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg font-mono",
    compact: "text-sm font-mono bg-gray-100 px-2 py-1 rounded"
  };

  if (variant === 'split') {
    const [minutes, seconds] = time.split(':').slice(1);
    return (
      <motion.div 
        className={variants.split}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        {...props}
      >
        <div className="px-2 py-1 bg-gray-100 rounded">{minutes}</div>
        <span className="text-gray-400">:</span>
        <div className="px-2 py-1 bg-gray-100 rounded">{seconds}</div>
      </motion.div>
    );
  }

  if (variant === 'modern') {
    return (
      <motion.div 
        className={variants.modern}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        {...props}
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="10" strokeWidth="2"/>
          <path d="M12 6v6l4 2" strokeWidth="2"/>
        </svg>
        {time}
      </motion.div>
    );
  }

  const variantClassName = variant ? variants[variant] : variants.default;

  return (
    <motion.div 
      className={cn(variantClassName, "transition-all duration-300")}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      whileHover={{ scale: 1.02 }}
      {...props}
    >
      {time}
    </motion.div>
  );
}