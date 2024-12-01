"use client";
import { useState } from 'react';
import { KnowledgeGraph } from '../types/knowledge';
import { knowledgeService } from '../services/api';

interface WikiUrlFormProps {
  onSubmit: (data: KnowledgeGraph) => void;
  onError: (error: string) => void;
  processing: boolean;
  setProcessing: (processing: boolean) => void;
}

export function WikiUrlForm({ onSubmit, onError, processing, setProcessing }: WikiUrlFormProps) {
  const [wikiUrl, setWikiUrl] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wikiUrl.trim()) {
      onError('Please enter a Wikipedia URL');
      return;
    }

    setProcessing(true);

    try {
      const data = await knowledgeService.processWikiLink(wikiUrl);
      onSubmit(data);
    } catch (err) {
      onError('Failed to process Wikipedia URL');
      console.error('Error processing wiki URL:', err);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto mb-8">
      <div className="flex gap-4">
        <input
          type="url"
          value={wikiUrl}
          onChange={(e) => setWikiUrl(e.target.value)}
          placeholder="Enter Wikipedia URL"
          className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          disabled={processing}
        />
        <button
          type="submit"
          disabled={processing}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {processing ? 'Processing...' : 'Generate'}
        </button>
      </div>
    </form>
  );
}