'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useWordDefinition } from '@/hooks/useWordDefinition';
import { useWordBookmarks } from '@/hooks/useWordBookmarks';
import { useSelection } from '@/contexts/SelectionContext';
import { Bookmark, BookmarkPlus, Volume2, GripVertical } from 'lucide-react';

interface WordDefinitionBarProps {
  word: string;
  position: { top: number; left: number };
  onClose: () => void;
  onShowWordBookmarks?: () => void;
}

// Local storage key for saving position
const POSITION_STORAGE_KEY = 'wordDefinitionPosition';

export function WordDefinitionBar({ word, position, onClose, onShowWordBookmarks }: WordDefinitionBarProps) {
  const { definition, loading, error, fetchDefinition } = useWordDefinition();
  const { isWordBookmarked, toggleWordBookmark } = useWordBookmarks();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [popupPosition, setPopupPosition] = useState<{ top: number; left: number } | null>(null);
  
  // Debug: Log props
  useEffect(() => {
    console.log('WordDefinitionBar - word:', word);
    console.log('WordDefinitionBar - position:', position);
  }, [word, position]);
  
  // Fetch definition when word changes
  useEffect(() => {
    if (word) {
      console.log('Fetching definition for word:', word);
      fetchDefinition(word);
      // Check if the word is bookmarked
      const bookmarked = isWordBookmarked(word);
      setIsBookmarked(bookmarked);
    }
  }, [word]); // Remove fetchDefinition and isWordBookmarked from dependencies

  // Initialize position
  useEffect(() => {
    // Try to load saved position from localStorage
    try {
      const savedPosition = localStorage.getItem(POSITION_STORAGE_KEY);
      if (savedPosition) {
        setPopupPosition(JSON.parse(savedPosition));
      } else {
        // Use calculated position if no saved position
        setPopupPosition(calculateInitialPosition());
      }
    } catch (error) {
      console.error('Error loading saved position:', error);
      setPopupPosition(calculateInitialPosition());
    }
  }, [position]);

  // Handle ESC key press to close the popup
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    // Handle clicks outside the popup
    const handleClickOutside = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  // Handle dragging
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && popupPosition) {
        const newLeft = e.clientX - dragOffset.x;
        const newTop = e.clientY - dragOffset.y;
        
        // Update position
        const newPosition = { 
          left: newLeft, 
          top: newTop 
        };
        
        setPopupPosition(newPosition);
      }
    };
    
    const handleMouseUp = () => {
      if (isDragging && popupPosition) {
        setIsDragging(false);
        
        // Save position to localStorage
        try {
          localStorage.setItem(POSITION_STORAGE_KEY, JSON.stringify(popupPosition));
        } catch (error) {
          console.error('Error saving position:', error);
        }
      }
    };
    
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, popupPosition]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (popupRef.current && popupPosition) {
      // Only start dragging from the header area
      const target = e.target as HTMLElement;
      if (target.closest('.drag-handle')) {
        setIsDragging(true);
        
        // Calculate the offset of the mouse from the popup's top-left corner
        const rect = popupRef.current.getBoundingClientRect();
        setDragOffset({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
        
        // Prevent text selection during drag
        e.preventDefault();
      }
    }
  };

  const handleBookmarkToggle = () => {
    if (definition) {
      toggleWordBookmark(word, {
        definition: definition.meanings[0]?.definitions[0]?.definition || 'No definition available',
        partOfSpeech: definition.meanings[0]?.partOfSpeech || 'unknown',
        etymology: definition.etymology
      });
      setIsBookmarked(!isBookmarked);
    }
  };

  // Calculate initial position to ensure the bar stays within viewport
  // and position it towards the center of the screen
  const calculateInitialPosition = () => {
    const barWidth = 320; // Approximate width of the bar
    const barHeight = 300; // Approximate height of the bar
    const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1000;
    const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
    const padding = 20; // Padding from window edges
    
    // Calculate center of screen
    const centerX = windowWidth / 2;
    const centerY = windowHeight / 2;
    
    // Calculate vector from word to center
    const vectorX = centerX - position.left;
    const vectorY = centerY - position.top;
    
    // Normalize the vector (make it a unit vector)
    const magnitude = Math.sqrt(vectorX * vectorX + vectorY * vectorY);
    const normalizedX = vectorX / magnitude;
    const normalizedY = vectorY / magnitude;
    
    // Use the normalized vector to position the popup along the path to center
    // but not all the way to center - about 30% of the way
    const distanceToTravel = Math.min(magnitude * 0.3, 150); // Cap at 150px or 30% of distance
    
    // Calculate position along the path to center
    let left = position.left + normalizedX * distanceToTravel;
    let top = position.top + normalizedY * distanceToTravel;
    
    // Adjust to ensure the popup is centered on this point
    left = left - barWidth / 2;
    top = top - barHeight / 2;
    
    // Final boundary checks to ensure the popup stays within the viewport
    left = Math.max(padding, Math.min(left, windowWidth - barWidth - padding));
    top = Math.max(padding, Math.min(top, windowHeight - barHeight - padding));
    
    return { top, left };
  };

  // Get the current position style
  const getPositionStyle = () => {
    if (popupPosition) {
      return {
        top: `${popupPosition.top}px`,
        left: `${popupPosition.left}px`
      };
    }
    return calculateInitialPosition();
  };

  if (loading) {
    return (
      <div 
        ref={popupRef}
        className="word-definition-bar fixed z-50 bg-white/90 backdrop-blur-md rounded-xl shadow-xl border border-gray-200 p-4 w-80 animate-in fade-in zoom-in-75 slide-in-from-bottom-4 duration-700 ease-in-out"
        style={{
          ...getPositionStyle(),
          transformOrigin: `${position.left}px ${position.top}px`
        }}
      >
        <div className="flex justify-center items-center h-40">
          <div className="animate-pulse flex space-x-4">
            <div className="flex-1 space-y-4 py-1">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !definition) {
    return (
      <div 
        ref={popupRef}
        className="word-definition-bar fixed z-50 bg-white/90 backdrop-blur-md rounded-xl shadow-xl border border-gray-200 p-4 w-80 animate-in fade-in zoom-in-75 slide-in-from-bottom-4 duration-700 ease-in-out"
        style={{
          ...getPositionStyle(),
          transformOrigin: `${position.left}px ${position.top}px`
        }}
      >
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold text-gray-800">{word}</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div className="text-center py-8">
          <p className="text-red-500">Sorry, we couldn't find a definition for this word.</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={popupRef}
      onMouseDown={handleMouseDown}
      className="word-definition-bar fixed z-50 bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-gray-200 p-0 w-80 animate-in fade-in zoom-in-75 slide-in-from-bottom-4 duration-700 ease-in-out hover:shadow-2xl transition-all overflow-hidden"
      style={{
        ...getPositionStyle(),
        transformOrigin: `${position.left}px ${position.top}px`
      }}
    >
      {/* Horizontal drag handle bar */}
      <div className="w-full h-8 bg-gray-100 flex items-center justify-center drag-handle cursor-move">
        <div className="w-16 h-1.5 bg-gray-300 rounded-full"></div>
      </div>
      
      <div className="p-5">
        {/* Header with word and close button */}
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-semibold text-gray-800">{definition.word}</h3>
            {definition.phonetic && (
              <span className="text-sm text-gray-500">{definition.phonetic}</span>
            )}
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        {/* Action buttons */}
        <div className="flex items-center space-x-2 mb-4">
          <button 
            className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
            title="Listen to pronunciation"
          >
            <Volume2 size={16} className="text-gray-600" />
          </button>
          <button 
            className={`p-1.5 rounded-full hover:bg-gray-100 transition-colors ${isBookmarked ? 'text-blue-500' : 'text-gray-600'}`}
            title={isBookmarked ? "Remove from bookmarks" : "Add to bookmarks"}
            onClick={handleBookmarkToggle}
          >
            {isBookmarked ? (
              <Bookmark size={16} className="fill-blue-500 text-blue-500" />
            ) : (
              <BookmarkPlus size={16} />
            )}
          </button>
          
          {/* Part of speech tag */}
          {definition.meanings[0]?.partOfSpeech && (
            <span className="ml-auto text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
              {definition.meanings[0].partOfSpeech}
            </span>
          )}
        </div>
        
        {/* Definition */}
        <div className="mb-4 transition-all duration-300 hover:translate-x-1">
          <h4 className="text-xs uppercase tracking-wider text-gray-500 mb-1">Definition</h4>
          <p className="text-sm text-gray-800">
            {definition.meanings[0]?.definitions[0]?.definition || 'No definition available'}
          </p>
          
          {/* Example */}
          {definition.meanings[0]?.definitions[0]?.example && (
            <p className="text-sm text-gray-600 italic mt-2">
              "{definition.meanings[0].definitions[0].example}"
            </p>
          )}
        </div>
        
        {/* Etymology */}
        {definition.etymology && (
          <div className="mb-4 transition-all duration-300 hover:translate-x-1">
            <h4 className="text-xs uppercase tracking-wider text-gray-500 mb-1">Etymology</h4>
            <p className="text-sm text-gray-800">{definition.etymology}</p>
          </div>
        )}
        
        {/* Synonyms & Antonyms */}
        {(definition?.meanings?.[0]?.definitions?.[0]?.synonyms?.length || definition?.meanings?.[0]?.definitions?.[0]?.antonyms?.length) && (
          <div className="mb-4">
            {definition.meanings[0]?.definitions[0]?.synonyms?.length > 0 && (
              <div className="mb-3 transition-all duration-300 hover:translate-x-1">
                <h4 className="text-xs uppercase tracking-wider text-gray-500 mb-1">Synonyms</h4>
                <div className="flex flex-wrap gap-1">
                  {definition.meanings[0]?.definitions[0]?.synonyms?.slice(0, 5).map((synonym, index) => (
                    <span key={index} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full hover:bg-blue-50 hover:text-blue-700 transition-colors">
                      {synonym}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {definition.meanings[0]?.definitions[0]?.antonyms?.length > 0 && (
              <div className="transition-all duration-300 hover:translate-x-1">
                <h4 className="text-xs uppercase tracking-wider text-gray-500 mb-1">Antonyms</h4>
                <div className="flex flex-wrap gap-1">
                  {definition.meanings[0]?.definitions[0]?.antonyms?.slice(0, 5).map((antonym, index) => (
                    <span key={index} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full hover:bg-red-50 hover:text-red-700 transition-colors">
                      {antonym}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Additional meanings */}
        {definition?.meanings && definition.meanings.length > 1 && (
          <div className="transition-all duration-300 hover:translate-x-1">
            <h4 className="text-xs uppercase tracking-wider text-gray-500 mb-1">Other meanings</h4>
            <div className="space-y-2">
              {(definition.meanings as any[]).slice(1, 3).map((meaning, index) => (
                <div key={index} className="text-sm">
                  <span className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded-full mr-1">
                    {meaning.partOfSpeech}
                  </span>
                  <span className="text-gray-800">
                    {meaning.definitions?.[0]?.definition || 'No definition available'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
