'use client';

import React from 'react';
import Image from 'next/image';

interface QuestionImageProps {
  onImageClick: () => void;
}

export function QuestionImage({ onImageClick }: QuestionImageProps) {
  return (
    <div className="relative">
      <div 
        className="h-48 bg-gray-100 flex items-center justify-center cursor-pointer"
        onClick={onImageClick}
      >
        <Image
          src="/images/question-image.svg"
          alt="Urban Land Expansion Study"
          width={600}
          height={300}
          className="h-full w-auto object-contain"
          priority
        />
      </div>
      
      <div className="absolute bottom-2 right-2">
        <button
          onClick={onImageClick}
          className="bg-white rounded-full p-1 shadow-md hover:bg-gray-100 focus:outline-none"
          title="Expand image"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5"
          >
            <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
