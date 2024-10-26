import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';

interface RecordFormProps {
  onSubmit: (content: string) => Promise<void>;
}

export function RecordForm({ onSubmit }: RecordFormProps) {
  const [content, setContent] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      await onSubmit(content);
      setContent('');
    } catch (error) {
      console.error('Error creating record:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-4 mb-8">
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Enter your content..."
        className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
      >
        <PlusCircle size={20} />
        Add Record
      </button>
    </form>
  );
}