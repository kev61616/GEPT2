'use client';

import React from 'react';
import { Button } from '@/components/ui/button';

interface BookmarkButtonProps {
  isBookmarked: boolean;
  onClick: () => void;
}

export function BookmarkButton({ isBookmarked, onClick }: BookmarkButtonProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      className={`flex items-center ${isBookmarked ? 'text-yellow-500' : 'text-gray-500'}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill={isBookmarked ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-5 h-5 mr-1"
      >
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      </svg>
      <span className="hidden sm:inline">
        {isBookmarked ? 'Bookmarked' : 'Bookmark'}
      </span>
    </Button>
  );
}
