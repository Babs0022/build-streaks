import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';

interface LogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLog: (note: string) => void;
  isLoading?: boolean;
}

export const LogModal: React.FC<LogModalProps> = ({
  isOpen,
  onClose,
  onLog,
  isLoading = false,
}) => {
  const [note, setNote] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (note.trim()) {
      onLog(note.trim());
      setNote('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">Log Your Progress</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-2">
              What did you build today?
            </label>
            <textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Describe what you worked on today..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              rows={4}
              maxLength={500}
              disabled={isLoading}
            />
            <div className="text-right text-sm text-gray-500 mt-1">
              {note.length}/500
            </div>
          </div>
          
          <div className="flex space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!note.trim() || isLoading}
              className="flex-1"
            >
              {isLoading ? 'Logging...' : 'Log Day'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
