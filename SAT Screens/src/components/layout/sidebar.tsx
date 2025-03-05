import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@radix-ui/react-tooltip';

export function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false);

  const navItems = [
    { icon: '/overview_icon.png', label: 'Overview', description: 'Dashboard overview of your progress', active: true },
    { icon: '/subject_icon.png', label: 'Subject', description: 'Browse subjects and topics' },
    { icon: '/test_icon.png', label: 'Test', description: 'Practice tests and assessments' },
    { icon: '/report_icon.png', label: 'Report', description: 'View performance analytics' },
    { icon: '/class_icon.png', label: 'Class', description: 'Access your classroom' }
  ];

  return (
    <div 
      className={cn(
        "bg-white border-r flex flex-col items-center py-6 fixed left-0 top-0 bottom-0 z-50 transition-all duration-300 group",
        isExpanded ? "w-16" : "w-3"
      )}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className={cn(
        "absolute -right-3 top-1/2 -translate-y-1/2 transition-all duration-300",
        isExpanded ? "opacity-0 pointer-events-none" : "opacity-100"
      )}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "bg-gray-200 shadow-md rounded-full p-2",
          "cursor-pointer transition-all duration-300",
          "hover:scale-110 hover:shadow-lg hover:bg-gray-300",
          isExpanded ? "rotate-180" : "rotate-0",
          "focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2",
          "group/handle relative"
        )}
        aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
      >
        <ChevronRight className="w-4 h-4 text-gray-700 transition-transform group-hover/handle:translate-x-0.5" />
        <div className={cn(
          "absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1",
          "bg-black/75 text-white text-xs rounded whitespace-nowrap",
          "opacity-0 group-hover/handle:opacity-100 pointer-events-none",
          "translate-x-2 group-hover/handle:translate-x-0",
          "transition-all duration-200"
        )}>
          {isExpanded ? "Collapse menu" : "Expand menu"}
        </div>
      </button>
      </div>
      <div 
        className={cn(
          "w-8 h-8 relative transition-opacity duration-300",
          isExpanded ? "opacity-100" : "opacity-0"
        )}
        aria-label="Math Learning Platform logo"
        role="img"
      >
        <img
          src="/images/brainbox_logo.png"
          alt="Math Learning Platform"
          className="w-full h-full object-contain"
        />
      </div>
      <div className={cn(
        "flex flex-col gap-6 mt-8 transition-opacity duration-300",
        isExpanded ? "opacity-100" : "opacity-0"
      )}>
        {navItems.map((item, index) => (
          <div key={index} className="relative group/item">
            <div
              className={cn(
                "p-2.5 rounded-lg cursor-pointer transition-all duration-200",
                "hover:scale-105",
                item.active ? "bg-indigo-50 shadow-sm" : "hover:bg-yellow-50/80"
              )}
              aria-label={item.description}
              role="button"
              aria-current={item.active ? "page" : undefined}
            >
              <div className="w-8 h-8">
              <img
                src={`/images/${item.icon}`}
                alt=""
                className="w-full h-full object-contain"
              />
              </div>
            </div>
            <div
              className={cn(
                "absolute left-full top-1/2 -translate-y-1/2 ml-2",
                "bg-white border shadow-lg rounded-lg px-3 py-2",
                "text-sm font-medium text-gray-700 whitespace-nowrap",
                "opacity-0 group-hover/item:opacity-100",
                "translate-x-2 group-hover/item:translate-x-0",
                "transition-all duration-200 pointer-events-none z-50"
              )}
            >
              {item.label}
            </div>
          </div>
        ))}
      </div>
      <div className={cn(
        "absolute bottom-6 left-0 right-0 flex flex-col items-center space-y-4 transition-opacity duration-300",
        isExpanded ? "opacity-100" : "opacity-0"
      )}>
        <div className="relative">
          <button
            className="flex flex-col items-center gap-1 cursor-pointer"
            aria-label="Your current progress score: 50 points"
            role="status"
          >
            <img
              src="/images/orb_icon.png"
              alt="Progress indicator"
              className="w-8 h-8 object-contain"
            />
            <span className="text-sm font-medium text-gray-600">50</span>
          </button>
        </div>
        <div
          className="w-8 h-8 relative cursor-pointer"
          aria-label="Achievement badge: Star performer"
          role="status"
        >
          <img
            src="/images/user_icon.png"
            alt="User achievement badge"
            className="w-full h-full object-contain"
          />
        </div>
      </div>
    </div>
  );
}