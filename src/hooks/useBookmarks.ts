'use client';

import { useState, useEffect } from 'react';

const STORAGE_KEY = 'bookmarks';

export interface Bookmark {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  questionId: string;
  createdAt: number;
}

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(() => {
    const defaultBookmarks = [
      {
        id: '1',
        title: 'Urban Land Expansion Analysis',
        description: 'Question about Richa Mahtta\'s study on urban physical expansion and the influence of GDP per capita growth.',
        category: 'Reading',
        difficulty: 'Medium',
        questionId: '1',
        createdAt: Date.now() - 86400000 // 1 day ago
      },
      {
        id: '2',
        title: 'Component Lifecycle Methods',
        description: 'Understanding the lifecycle of React components and when different methods are called.',
        category: 'Reading',
        difficulty: 'Hard',
        questionId: '2',
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
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
  }, [bookmarks]);

  const addBookmark = (bookmark: Omit<Bookmark, 'id' | 'createdAt'>) => {
    const newBookmark: Bookmark = {
      ...bookmark,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: Date.now()
    };
    
    setBookmarks(prev => [newBookmark, ...prev]);
  };

  const removeBookmark = (id: string) => {
    setBookmarks(prev => prev.filter(bookmark => bookmark.id !== id));
  };

  const toggleBookmark = (questionId: string, questionData: Omit<Bookmark, 'id' | 'createdAt' | 'questionId'>) => {
    const exists = bookmarks.some(bookmark => bookmark.questionId === questionId);
    
    if (exists) {
      setBookmarks(prev => prev.filter(bookmark => bookmark.questionId !== questionId));
    } else {
      addBookmark({
        ...questionData,
        questionId
      });
    }
  };

  const isBookmarked = (questionId: string) => {
    return bookmarks.some(bookmark => bookmark.questionId === questionId);
  };

  return {
    bookmarks,
    addBookmark,
    removeBookmark,
    toggleBookmark,
    isBookmarked
  };
}
