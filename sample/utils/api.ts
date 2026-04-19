import axios from 'axios';

const API = axios.create({
  baseURL: 'http://127.0.0.1:8000', // FastAPI URL
});

export const submitCodeForReview = async (file: File, language: string) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('language', language);

  const response = await API.post('/review', formData);
  return response.data.review;
};
