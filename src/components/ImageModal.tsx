'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';

interface ImageModalProps {
  onClose: (e: React.MouseEvent | KeyboardEvent) => void;
}

export function ImageModal({ onClose }: ImageModalProps) {
  // Add keyboard event listener for Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose(e);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-[8px] flex items-center justify-center z-50 animate-[fadeIn_0.2s_ease-out]"
      onClick={onClose}
    >
      <div className="relative w-[75%] max-h-[75vh] animate-[scaleIn_0.3s_ease-out]">
        <div className="bg-white p-2 rounded-lg shadow-lg">
          <div className="flex items-center justify-center">
            <Image
              src="/images/question-image.svg"
              alt="Urban Land Expansion Study"
              width={1200}
              height={800}
              className="w-full h-auto object-contain"
              priority
              onClick={onClose} // Allow clicking on the image to close
            />
          </div>
          
          <div className="absolute top-2 right-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose(e);
              }}
              className="bg-white rounded-full p-1 shadow-md hover:bg-gray-100 focus:outline-none"
              title="Close"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-6 h-6"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
