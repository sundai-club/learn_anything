import axios from 'axios';
import { KnowledgeGraph } from '../types/knowledge';

const api = axios.create({
    baseURL: 'https://learn-anything-199983032721.us-central1.run.app',
    headers: {
        'Content-Type': 'application/json',
    },
});

export const knowledgeService = {
    async processWikiLink(wikiUrl: string): Promise<KnowledgeGraph> {
        const { data } = await api.post<KnowledgeGraph>('/get-graph', {
            url: wikiUrl, // Send "url" directly at the top level of the body
        });
        return data;
    }
};