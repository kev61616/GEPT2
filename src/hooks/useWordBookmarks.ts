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

// Use fixed timestamps for server-side rendering to avoid hydration mismatch
const ONE_DAY_MS = 86400000;
const TWO_DAYS_MS = 172800000;

// Default bookmarks with fixed timestamps for consistent server/client rendering
const defaultBookmarks: WordBookmark[] = [
  {
    id: 'w1',
    word: 'urban',
    definition: 'Relating to, situated in, or characteristic of a town or city.',
    partOfSpeech: 'adjective',
    etymology: 'From Latin urbanus ("of or pertaining to a city"), from urbs ("city")',
    createdAt: 1709654400000 // Fixed timestamp instead of Date.now() - ONE_DAY_MS
  },
  {
    id: 'w2',
    word: 'expansion',
    definition: 'The action of becoming larger or more extensive.',
    partOfSpeech: 'noun',
    etymology: 'From Latin expansio, from expandere ("to spread out")',
    createdAt: 1709568000000 // Fixed timestamp instead of Date.now() - TWO_DAYS_MS
  }
];

export function useWordBookmarks() {
  const [wordBookmarks, setWordBookmarks] = useState<WordBookmark[]>(defaultBookmarks);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load saved bookmarks from localStorage only after initial render on client
  useEffect(() => {
    if (typeof window !== 'undefined' && !isInitialized) {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          setWordBookmarks(JSON.parse(saved));
        }
        setIsInitialized(true);
      } catch (error) {
        console.error('Error loading word bookmarks from localStorage:', error);
      }
    }
  }, [isInitialized]);

  // Save bookmarks to localStorage only after initialization and when bookmarks change
  useEffect(() => {
    if (typeof window !== 'undefined' && isInitialized) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(wordBookmarks));
    }
  }, [wordBookmarks, isInitialized]);

  const addWordBookmark = (bookmark: Omit<WordBookmark, 'id' | 'createdAt'>) => {
    // Generate a more deterministic ID based on the word and current time
    // This is still client-side only, but we've already hydrated by this point
    const timestamp = Date.now();
    const newBookmark: WordBookmark = {
      ...bookmark,
      id: `w${timestamp.toString(36)}`,
      createdAt: timestamp
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
