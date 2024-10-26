import { Record } from '../types/Record';

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const recordsApi = {
  async getRecords(): Promise<Record[]> {
    try {
      const response = await fetch('/api/records');
      return handleResponse(response);
    } catch (error) {
      console.error('Failed to fetch records:', error);
      throw new Error('Failed to load records. Please try again later.');
    }
  },

  async createRecord(content: string): Promise<Record> {
    try {
      const response = await fetch('/api/records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Failed to create record:', error);
      throw new Error('Failed to create record. Please try again.');
    }
  },

  async deleteRecord(id: string): Promise<void> {
    try {
      const response = await fetch(`/api/records/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Failed to delete record:', error);
      throw new Error('Failed to delete record. Please try again.');
    }
  },
};