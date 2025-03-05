'use client';

import React from 'react';
import '@/styles/breakpoints.css'; // Import the breakpoints CSS

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  // Only show the first item (Reading) on mobile
  const firstItem = items[0];

  return (
    <>
      {/* Mobile version - only show "Reading" */}
      <div className="mobile-breadcrumb ml-3">
        <a
          href={firstItem.href}
          className="text-xs text-gray-500"
        >
          {firstItem.label}
        </a>
      </div>

      {/* Desktop version - full breadcrumb */}
      <nav className="desktop-breadcrumb ml-6" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2">
          {items.map((item, index) => (
            <li key={item.label} className="flex items-center">
              {index > 0 && (
                <span className="text-gray-400 mx-2">/</span>
              )}
              <a
                href={item.href}
                className={`text-sm ${
                  index === items.length - 1
                    ? 'text-gray-700 font-medium'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
