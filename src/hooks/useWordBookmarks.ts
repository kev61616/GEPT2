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
