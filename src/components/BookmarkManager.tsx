import React from 'react';
import { DraggableWidget } from './DraggableWidget';
import { Card } from './ui/card';
import { Bookmark, BookmarkPlus, Trash2, ExternalLink } from 'lucide-react';
import { useBookmarks } from '../hooks/useBookmarks';

interface BookmarkManagerProps {
  onClose: () => void;
}

export function BookmarkManager({ onClose }: BookmarkManagerProps) {
  const { bookmarks, removeBookmark } = useBookmarks();

  const handleRemoveBookmark = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    removeBookmark(id);
  };

  return (
    <DraggableWidget
      id="bookmark-manager"
      className="top-20 right-20"
      title="Bookmarks"
      onClose={onClose}
    >
      <Card className="w-96 bg-white rounded-b-xl">
        <div className="p-4">
          {bookmarks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Bookmark className="h-12 w-12 text-gray-300 mb-3" />
              <h3 className="text-lg font-medium text-gray-700 mb-1">No bookmarks yet</h3>
              <p className="text-sm text-gray-500 max-w-xs">
                Bookmark questions to quickly access them later. Click the bookmark icon on any question to save it.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {bookmarks.map((bookmark) => (
                <div 
                  key={bookmark.id}
                  className="flex items-start justify-between p-3 rounded-lg border border-gray-200 hover:border-blue-200 hover:bg-blue-50 transition-all duration-200"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <Bookmark className="h-4 w-4 text-blue-400 flex-shrink-0" />
                      <span className="font-medium text-gray-800 line-clamp-1">{bookmark.title}</span>
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-2">{bookmark.description}</p>
                    <div className="flex items-center mt-2 space-x-2">
                      <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                        {bookmark.category}
                      </span>
                      <span className="text-xs px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full">
                        {bookmark.difficulty}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-1 ml-2">
                    <button
                      className="p-1 text-gray-400 hover:text-blue-400 rounded-full hover:bg-blue-100 transition-colors"
                      title="Open question"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => handleRemoveBookmark(bookmark.id, e)}
                      className="p-1 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-100 transition-colors"
                      title="Remove bookmark"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="mt-4 pt-4 border-t border-gray-100">
            <button className="w-full flex items-center justify-center space-x-2 p-2 rounded-lg border border-dashed border-gray-300 text-gray-500 hover:border-blue-300 hover:text-blue-400 hover:bg-blue-50 transition-all duration-200">
              <BookmarkPlus className="h-4 w-4" />
              <span>Add Current Question</span>
            </button>
          </div>
        </div>
      </Card>
    </DraggableWidget>
  );
}