import axios from 'axios';
import { auth } from '../firebase';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

axios.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export interface BRD {
  id: number;
  title: string;
  summary: string;
  // Mapped from backend BlueprintDto
  features: { description: string }[];
  techStack: string[];
  targetAudience: string[];
  challenges: string[];
  roadmap: { stage: string; phase: string; description: string }[];
  createdAt?: string;
  updatedAt?: string;
}

// Helper to map backend's lists to the UI's expected object structure if needed
// For now, we'll keep it simple and update the UI components to use features/challenges directly.

export const generateIdea = async (inputs: any): Promise<BRD> => {
  const response = await axios.post(`${API_URL}/generate`, inputs);
  return response.data;
};

export const uploadFile = async (file: File): Promise<BRD> => {
  const formData = new FormData();
  formData.append('file', file);
  // NEW: This endpoint will be implemented in the next step
  const response = await axios.post(`${API_URL}/upload`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

export const uploadText = async (text: string): Promise<BRD> => {
  const response = await axios.post(`${API_URL}/upload-text`, { content: text });
  return response.data;
};

export const getBrd = async (id: number): Promise<BRD> => {
  const response = await axios.get(`${API_URL}/ideas/${id}`);
  return response.data;
};

export const updateBrd = async (id: number, data: BRD): Promise<BRD> => {
  const response = await axios.put(`${API_URL}/ideas/${id}`, data);
  return response.data;
};

export const getMyIdeas = async (): Promise<BRD[]> => {
  const response = await axios.get(`${API_URL}/ideas/me`);
  return response.data;
};
 
export const downloadPdf = async (id: number, title: string) => {
  const response = await axios.get(`${API_URL}/ideas/${id}/pdf`, { responseType: 'blob' });
  triggerBrowserDownload(response.data, `${title.replace(/\s+/g, '_')}_Blueprint.pdf`);
};
 
export const downloadDocx = async (id: number, title: string) => {
  const response = await axios.get(`${API_URL}/ideas/${id}/docx`, { responseType: 'blob' });
  triggerBrowserDownload(response.data, `${title.replace(/\s+/g, '_')}_Blueprint.docx`);
};
 
const triggerBrowserDownload = (blobData: Blob, filename: string) => {
  const url = window.URL.createObjectURL(new Blob([blobData]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};
