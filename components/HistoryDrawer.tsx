import React from 'react';

export interface HistoryEntry {
  id: string;
  text: string;
  themes: string[];
  timestamp: Date;
}

interface HistoryDrawerProps {
  history: HistoryEntry[];
  isOpen: boolean;
  onClose: () => void;
  onSelect: (entry: HistoryEntry) => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({ history, isOpen, onClose, onSelect }) => {
  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity z-40 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      
      <div
        className={`fixed right-0 top-0 h-full w-80 bg-white shadow-xl transform transition-transform z-50 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">History</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
        </div>
        
        <div className="overflow-y-auto h-full pb-20">
          {history.length === 0 ? (
            <p className="p-6 text-gray-500 text-center">No history yet</p>
          ) : (
            <div className="p-4 space-y-4">
              {history.map((entry) => (
                <div
                  key={entry.id}
                  onClick={() => onSelect(entry)}
                  className="p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  <div className="text-sm text-gray-500 mb-1">
                    {entry.timestamp.toLocaleString()}
                  </div>
                  <div className="text-gray-800 line-clamp-3 mb-2">
                    {entry.text}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {entry.themes.map((theme, index) => (
                      <span
                        key={index}
                        className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full"
                      >
                        {theme}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};