import axios from 'axios';
import { KnowledgeGraph } from '../types/knowledge';

const api = axios.create({
  baseURL: '/api',  // This will point to your Next.js API routes
  headers: {
    'Content-Type': 'application/json',
  },
});

export const knowledgeService = {
  async processWikiLink(wikiUrl: string): Promise<KnowledgeGraph> {
    const { data } = await api.get<KnowledgeGraph>('/process-wiki', {
      params: { url: wikiUrl }
    });
    return data;
  }
};