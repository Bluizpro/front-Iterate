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

export const getArchivedAnnotations = async () => {
  try {
    const response = await apiClient.get('/arquivado'); // Use `apiClient` aqui
    return response.data; // Retorna a lista de anotações arquivadas
  } catch (error) {
    console.error('Erro ao buscar anotações arquivadas:', error);
    throw error; // Lança o erro para que possa ser tratado
  }
};
