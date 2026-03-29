import axios from 'axios';
import { auth } from '../firebase';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// Fix #8 — scoped instance, does NOT pollute the global axios object
export const apiClient = axios.create({ baseURL: API_URL });

apiClient.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Fix #10 — features is string[], matching what GroqService.readStringList() returns
export interface BRD {
  id: number;
  title: string;
  summary: string;
  features: string[];
  techStack: string[];
  targetAudience: string[];
  challenges: string[];
  roadmap: { stage: string; phase: string; description: string }[];
  prd: string;
  createdAt?: string;
  updatedAt?: string;
}

export const generateIdea = async (inputs: unknown): Promise<BRD> => {
  const response = await apiClient.post('/generate', inputs);
  return response.data;
};



export const uploadText = async (text: string): Promise<BRD> => {
  const response = await apiClient.post('/upload-text', { content: text });
  return response.data;
};

export const uploadFile = async (file: File): Promise<BRD> => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await apiClient.post('/upload-file', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const getBrd = async (id: number): Promise<BRD> => {
  const response = await apiClient.get(`/ideas/${id}`);
  return response.data;
};

export const updateBrd = async (id: number, data: BRD): Promise<BRD> => {
  const response = await apiClient.put(`/ideas/${id}`, data);
  return response.data;
};

export const getMyIdeas = async (): Promise<BRD[]> => {
  const response = await apiClient.get('/ideas/me');
  return response.data;
};

// Fix #15 — returns Promise<void> so callers can wrap in try/catch
export const downloadPdf = async (id: number, title: string): Promise<void> => {
  const response = await apiClient.get(`/ideas/${id}/pdf`, { responseType: 'blob' });
  triggerBrowserDownload(response.data, `${title.replace(/\s+/g, '_')}_Blueprint.pdf`);
};

export const downloadDocx = async (id: number, title: string): Promise<void> => {
  const response = await apiClient.get(`/ideas/${id}/docx`, { responseType: 'blob' });
  triggerBrowserDownload(response.data, `${title.replace(/\s+/g, '_')}_Blueprint.docx`);
};

const triggerBrowserDownload = (blobData: Blob, filename: string): void => {
  const url = window.URL.createObjectURL(new Blob([blobData]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};
