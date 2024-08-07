// services/anotacaoApi.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:5120/api/Anotacao',
});

export async function createAnnotation(anotacao) {
  const response = await apiClient.post('/', anotacao);
  return response.data;
}

export async function getAnnotations() {
  const response = await apiClient.get('/');
  return response.data;
}

export async function archiveAnnotation(id) {
  const response = await apiClient.put(`/arquivar/${id}`);
  return response.data;
}

export async function getArchivedAnnotations() {
  const response = await apiClient.get('/arquivado');
  return response.data;
}
