import React from 'react';
import { Trash2 } from 'lucide-react';
import { Record } from '../types/Record';

interface RecordsListProps {
  records: Record[];
  onDelete: (id: string) => void;
  loading: boolean;
}

export function RecordsList({ records, onDelete, loading }: RecordsListProps) {
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No records found. Create one to get started!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {records.map((record) => (
        <div
          key={record.id}
          className="p-4 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors group"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <p className="text-gray-900">{record.content}</p>
              <p className="text-sm text-gray-500 mt-1">
                Created: {new Date(record.created_at).toLocaleString()}
              </p>
            </div>
            <button
              onClick={() => onDelete(record.id)}
              className="p-2 text-gray-400 opacity-0 group-hover:opacity-100 hover:text-red-600 transition-all"
              title="Delete record"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}