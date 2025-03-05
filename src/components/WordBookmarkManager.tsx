'use client';

import React from 'react';
import { DraggableWidget } from './DraggableWidget';
import { Card } from './ui/card';
import { Bookmark, BookmarkX, ExternalLink, Search } from 'lucide-react';
import { useWordBookmarks } from '../hooks/useWordBookmarks';

interface WordBookmarkManagerProps {
  onClose: () => void;
}

export function WordBookmarkManager({ onClose }: WordBookmarkManagerProps) {
  const { wordBookmarks, removeWordBookmark } = useWordBookmarks();
  const [searchTerm, setSearchTerm] = React.useState('');

  const handleRemoveBookmark = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    removeWordBookmark(id);
  };

  const filteredBookmarks = searchTerm
    ? wordBookmarks.filter(bookmark => 
        bookmark.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bookmark.definition.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : wordBookmarks;

  return (
    <DraggableWidget
      id="word-bookmark-manager"
      title="Word Bookmarks"
      onClose={onClose}
    >
      <Card className="w-96 bg-white rounded-b-xl">
        <div className="p-4">
          {/* Search input */}
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Search words..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {filteredBookmarks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Bookmark className="h-12 w-12 text-gray-300 mb-3" />
              <h3 className="text-lg font-medium text-gray-700 mb-1">No word bookmarks yet</h3>
              <p className="text-sm text-gray-500 max-w-xs">
                Double-click on any word in the question text and bookmark it to save it for later reference.
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {filteredBookmarks.map((bookmark) => (
                <div 
                  key={bookmark.id}
                  className="flex items-start justify-between p-3 rounded-lg border border-gray-200 hover:border-blue-200 hover:bg-blue-50 transition-all duration-200"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <Bookmark className="h-4 w-4 text-blue-400 flex-shrink-0" />
                      <span className="font-medium text-gray-800">{bookmark.word}</span>
                      <span className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                        {bookmark.partOfSpeech}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">{bookmark.definition}</p>
                    {bookmark.etymology && (
                      <p className="text-xs text-gray-500 mt-1 italic">{bookmark.etymology}</p>
                    )}
                  </div>
                  <div className="flex flex-col space-y-1 ml-2">
                    <button
                      className="p-1 text-gray-400 hover:text-blue-400 rounded-full hover:bg-blue-100 transition-colors"
                      title="Look up in dictionary"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => handleRemoveBookmark(bookmark.id, e)}
                      className="p-1 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-100 transition-colors"
                      title="Remove bookmark"
                    >
                      <BookmarkX className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {wordBookmarks.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500 text-center">
              {wordBookmarks.length} {wordBookmarks.length === 1 ? 'word' : 'words'} bookmarked
            </div>
          )}
        </div>
      </Card>
    </DraggableWidget>
  );
}
