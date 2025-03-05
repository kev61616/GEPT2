# Word Definition System

The Word Definition System shows definitions when users double-click on words. It includes:

1. Double-click detection
2. Word extraction
3. Definition fetching and caching
4. Popup display with animations
5. Word bookmarking functionality

## Selection Context

First, we need a context provider to manage text selection and double-clicked words:

```tsx
// SelectionContext.tsx
'use client';

import React, { useEffect } from 'react';

interface SelectionContextType {
  selectedText: string;
  setSelectedText: (text: string) => void;
  doubleClickedWord: string | null;
  setDoubleClickedWord: (word: string | null) => void;
  doubleClickPosition: { top: number; left: number } | null;
  setDoubleClickPosition: (position: { top: number; left: number } | null) => void;
}

// Ensure we're initializing with a non-null value
const SelectionContext = React.createContext<SelectionContextType>({
  selectedText: '',
  setSelectedText: () => {},
  doubleClickedWord: null,
  setDoubleClickedWord: () => {},
  doubleClickPosition: null,
  setDoubleClickPosition: () => {}
});

// Local storage keys
const WORD_STORAGE_KEY = 'doubleClickedWord';
const POSITION_STORAGE_KEY = 'doubleClickPosition';

export function SelectionProvider({ children }: { children: React.ReactNode }) {
  const [selectedText, setSelectedText] = React.useState('');
  const [doubleClickedWord, setDoubleClickedWord] = React.useState<string | null>(null);
  const [doubleClickPosition, setDoubleClickPosition] = React.useState<{ top: number; left: number } | null>(null);

  // Load persisted state from localStorage on initial render
  useEffect(() => {
    try {
      // Load word
      const savedWord = localStorage.getItem(WORD_STORAGE_KEY);
      if (savedWord) {
        setDoubleClickedWord(savedWord);
      }

      // Load position
      const savedPosition = localStorage.getItem(POSITION_STORAGE_KEY);
      if (savedPosition) {
        setDoubleClickPosition(JSON.parse(savedPosition));
      }
    } catch (error) {
      console.error('Error loading selection state from localStorage:', error);
    }
  }, []);

  // Custom setters that update localStorage
  const handleSetDoubleClickedWord = (word: string | null) => {
    setDoubleClickedWord(word);
    try {
      if (word) {
        localStorage.setItem(WORD_STORAGE_KEY, word);
      } else {
        localStorage.removeItem(WORD_STORAGE_KEY);
      }
    } catch (error) {
      console.error('Error saving word to localStorage:', error);
    }
  };

  const handleSetDoubleClickPosition = (position: { top: number; left: number } | null) => {
    setDoubleClickPosition(position);
    try {
      if (position) {
        localStorage.setItem(POSITION_STORAGE_KEY, JSON.stringify(position));
      } else {
        localStorage.removeItem(POSITION_STORAGE_KEY);
      }
    } catch (error) {
      console.error('Error saving position to localStorage:', error);
    }
  };

  // Listen for text selection
  React.useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      if (selection && selection.toString()) {
        setSelectedText(selection.toString());
      } else {
        setSelectedText('');
      }
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, []);

  // Handle double-click on words
  React.useEffect(() => {
    const handleDoubleClick = (e: MouseEvent) => {
      console.log('Double-click event triggered');
      
      // Only process double-clicks on text elements
      if (e.target instanceof HTMLElement) {
        // Get the text content of the target element
        const targetText = e.target.textContent || '';
        
        // Get the selection
        const selection = window.getSelection();
        if (!selection) return;
        
        // If there's a selection, use it
        if (selection.toString().trim()) {
          const selectedWord = selection.toString().trim();
          console.log('Selected word from selection:', selectedWord);
          
          // Only process if it's a single word (no spaces)
          if (selectedWord.indexOf(' ') === -1) {
            // Get the position for the definition bar
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            
            const position = {
              top: rect.top + window.scrollY - 10, // Position slightly above the word
              left: rect.left + rect.width / 2 + window.scrollX // Center it
            };
            
            handleSetDoubleClickedWord(selectedWord);
            handleSetDoubleClickPosition(position);
            return;
          }
        }
        
        // If no valid selection, try to extract the word at the click position
        const clickX = e.clientX;
        const clickY = e.clientY;
        
        // Create a range at the click position
        const range = document.caretRangeFromPoint(clickX, clickY);
        if (!range) return;
        
        // Get the text node and offset
        const textNode = range.startContainer;
        const offset = range.startOffset;
        
        // Only proceed if we have a text node
        if (textNode.nodeType !== Node.TEXT_NODE) return;
        
        const text = textNode.textContent || '';
        
        // Find the word boundaries
        let startPos = offset;
        let endPos = offset;
        
        // Find the start of the word
        while (startPos > 0 && /\w/.test(text[startPos - 1])) {
          startPos--;
        }
        
        // Find the end of the word
        while (endPos < text.length && /\w/.test(text[endPos])) {
          endPos++;
        }
        
        // Extract the word
        const word = text.substring(startPos, endPos).trim();
        console.log('Word from click position:', word);
        
        // Only process if it's a valid word
        if (word && word.length > 0 && word.indexOf(' ') === -1) {
          // Get the position for the definition bar
          const rect = range.getBoundingClientRect();
          
          const position = {
            top: rect.top + window.scrollY - 10, // Position slightly above the word
            left: rect.left + rect.width / 2 + window.scrollX // Center it
          };
          
          handleSetDoubleClickedWord(word);
          handleSetDoubleClickPosition(position);
        }
      }
    };

    document.addEventListener('dblclick', handleDoubleClick);
    
    return () => {
      document.removeEventListener('dblclick', handleDoubleClick);
    };
  }, []);

  const contextValue = React.useMemo(() => ({
    selectedText,
    setSelectedText,
    doubleClickedWord,
    setDoubleClickedWord: handleSetDoubleClickedWord,
    doubleClickPosition,
    setDoubleClickPosition: handleSetDoubleClickPosition
  }), [selectedText, doubleClickedWord, doubleClickPosition]);

  return (
    <SelectionContext.Provider value={contextValue}>
      {children}
    </SelectionContext.Provider>
  );
}

export function useSelection() {
  const context = React.useContext(SelectionContext);
  if (!context) {
    throw new Error('useSelection must be used within a SelectionProvider');
  }
  return context;
}
```

## Word Definition Hook

Next, we need a hook to fetch word definitions:

```tsx
// useWordDefinition.ts
'use client';

import { useState, useEffect } from 'react';

// Cache expiration time (24 hours in milliseconds)
const CACHE_EXPIRATION = 24 * 60 * 60 * 1000;

export interface WordDefinition {
  word: string;
  phonetic?: string;
  phonetics?: Array<{
    text: string;
    audio?: string;
  }>;
  origin?: string;
  meanings: Array<{
    partOfSpeech: string;
    definitions: Array<{
      definition: string;
      example?: string;
      synonyms: string[];
      antonyms: string[];
    }>;
  }>;
  etymology?: string;
}

// Mock data for development purposes
const mockDefinitions: Record<string, WordDefinition> = {
  urban: {
    word: 'urban',
    phonetic: '/ˈɜːbən/',
    phonetics: [{ text: '/ˈɜːbən/' }],
    origin: 'early 17th century: from Latin urbanus, from urbs, urb- "city"',
    meanings: [
      {
        partOfSpeech: 'adjective',
        definitions: [
          {
            definition: 'Relating to, situated in, or characteristic of a town or city.',
            example: 'the urban population',
            synonyms: ['built-up', 'town', 'city', 'metropolitan', 'suburban'],
            antonyms: ['rural', 'country']
          },
          {
            definition: '(of popular dance music) performed or produced by Black artists.',
            example: 'urban radio stations',
            synonyms: [],
            antonyms: []
          }
        ]
      }
    ],
    etymology: 'From Latin urbanus ("of or pertaining to a city"), from urbs ("city")'
  },
  // Add more mock definitions as needed
};

interface CachedDefinition {
  definition: WordDefinition;
  timestamp: number;
}

export function useWordDefinition() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [definition, setDefinition] = useState<WordDefinition | null>(null);

  // Check if a cached definition is still valid
  const isCacheValid = (cachedData: CachedDefinition): boolean => {
    const now = Date.now();
    return now - cachedData.timestamp < CACHE_EXPIRATION;
  };

  // Get definition from cache if available
  const getFromCache = (word: string): WordDefinition | null => {
    try {
      const cachedData = localStorage.getItem(`word_definition_${word.toLowerCase()}`);
      if (cachedData) {
        const parsedData: CachedDefinition = JSON.parse(cachedData);
        if (isCacheValid(parsedData)) {
          return parsedData.definition;
        } else {
          // Remove expired cache
          localStorage.removeItem(`word_definition_${word.toLowerCase()}`);
        }
      }
    } catch (error) {
      console.error('Error reading from cache:', error);
    }
    return null;
  };

  // Save definition to cache
  const saveToCache = (word: string, def: WordDefinition) => {
    try {
      const cacheData: CachedDefinition = {
        definition: def,
        timestamp: Date.now()
      };
      localStorage.setItem(`word_definition_${word.toLowerCase()}`, JSON.stringify(cacheData));
    } catch (error) {
      console.error('Error saving to cache:', error);
    }
  };

  const fetchDefinition = async (word: string) => {
    if (!word) return;
    
    // First check if we have a cached definition
    const cachedDefinition = getFromCache(word);
    if (cachedDefinition) {
      console.log('Using cached definition for:', word);
      setDefinition(cachedDefinition);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Normalize the word to lowercase for consistent lookup
      const normalizedWord = word.toLowerCase();
      
      // For development, use mock data
      if (mockDefinitions[normalizedWord]) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));
        const def = mockDefinitions[normalizedWord];
        setDefinition(def);
        saveToCache(word, def);
      } else {
        // In a real implementation, we would fetch from an API
        // const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        // if (!response.ok) throw new Error('Failed to fetch definition');
        // const data = await response.json();
        // setDefinition(data[0]);
        // saveToCache(word, data[0]);
        
        // For now, return a generic definition for words not in our mock data
        await new Promise(resolve => setTimeout(resolve, 300));
        const genericDef = {
          word: word,
          phonetic: `/ˈ${word}/`,
          meanings: [
            {
              partOfSpeech: 'noun',
              definitions: [
                {
                  definition: `Definition for "${word}" would appear here.`,
                  example: `Example using "${word}" would appear here.`,
                  synonyms: ['similar1', 'similar2'],
                  antonyms: ['opposite1', 'opposite2']
                }
              ]
            }
          ],
          etymology: 'Etymology information would appear here.'
        };
        setDefinition(genericDef);
        saveToCache(word, genericDef);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setDefinition(null);
    } finally {
      setLoading(false);
    }
  };

  const clearDefinition = () => {
    setDefinition(null);
    setError(null);
  };

  return {
    definition,
    loading,
    error,
    fetchDefinition,
    clearDefinition
  };
}
```

## Word Bookmarks Hook

To enable bookmarking words for later reference:

```tsx
// useWordBookmarks.ts
'use client';

import { useState, useEffect } from 'react';

const STORAGE_KEY = 'wordBookmarks';

export interface WordBookmark {
  id: string;
  word: string;
  definition: string;
  partOfSpeech: string;
  etymology?: string;
  createdAt: number;
}

export function useWordBookmarks() {
  const [wordBookmarks, setWordBookmarks] = useState<WordBookmark[]>(() => {
    const defaultBookmarks: WordBookmark[] = [
      {
        id: 'w1',
        word: 'urban',
        definition: 'Relating to, situated in, or characteristic of a town or city.',
        partOfSpeech: 'adjective',
        etymology: 'From Latin urbanus ("of or pertaining to a city"), from urbs ("city")',
        createdAt: Date.now() - 86400000 // 1 day ago
      },
      {
        id: 'w2',
        word: 'expansion',
        definition: 'The action of becoming larger or more extensive.',
        partOfSpeech: 'noun',
        etymology: 'From Latin expansio, from expandere ("to spread out")',
        createdAt: Date.now() - 172800000 // 2 days ago
      }
    ];

    if (typeof window === 'undefined') return defaultBookmarks;

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : defaultBookmarks;
    } catch {
      return defaultBookmarks;
    }
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(wordBookmarks));
  }, [wordBookmarks]);

  const addWordBookmark = (bookmark: Omit<WordBookmark, 'id' | 'createdAt'>) => {
    const newBookmark: WordBookmark = {
      ...bookmark,
      id: `w${Math.random().toString(36).substring(2, 9)}`,
      createdAt: Date.now()
    };
    
    setWordBookmarks(prev => [newBookmark, ...prev]);
  };

  const removeWordBookmark = (id: string) => {
    setWordBookmarks(prev => prev.filter(bookmark => bookmark.id !== id));
  };

  const toggleWordBookmark = (word: string, bookmarkData: Omit<WordBookmark, 'id' | 'createdAt' | 'word'>) => {
    const exists = wordBookmarks.some(bookmark => bookmark.word.toLowerCase() === word.toLowerCase());
    
    if (exists) {
      setWordBookmarks(prev => prev.filter(bookmark => bookmark.word.toLowerCase() !== word.toLowerCase()));
    } else {
      addWordBookmark({
        ...bookmarkData,
        word
      });
    }
  };

  const isWordBookmarked = (word: string) => {
    return wordBookmarks.some(bookmark => bookmark.word.toLowerCase() === word.toLowerCase());
  };

  return {
    wordBookmarks,
    addWordBookmark,
    removeWordBookmark,
    toggleWordBookmark,
    isWordBookmarked
  };
}
```

## Word Definition Bar Component

The popup component that displays the word definition:

```tsx
// WordDefinitionBar.tsx
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useWordDefinition } from '@/hooks/useWordDefinition';
import { useWordBookmarks } from '@/hooks/useWordBookmarks';
import { Bookmark, BookmarkPlus, Volume2 } from 'lucide-react';

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
  
  // Fetch definition when word changes
  useEffect(() => {
    if (word) {
      fetchDefinition(word);
      // Check if the word is bookmarked
      const bookmarked = isWordBookmarked(word);
      setIsBookmarked(bookmarked);
    }
  }, [word]);

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
