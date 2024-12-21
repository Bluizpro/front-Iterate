// services/anotacaoApi.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:5001/api/QtcInfor',
});
export async function createQtcInfos(qtcInfo) {
  const response = await apiClient.post('/', qtcInfo);
  return response.data;
}

export async function getQtcInfos() {
  const response = await apiClient.get('/');
  return response.data;
}

export async function archiveQtcInfo(id) {
  const response = await apiClient.put(`/arquivar-qtc/${id}`);
  return response.data;
}

/* export async function getArchivedQtcInfos() {
  const response = await apiClient.get('/arquivar');
  return response.data;
} */
export const getArchivedQtcInfos = async () => {
  try {
    const response = await apiClient.get('/arquivado'); // Use `apiClient` aqui
    return response.data; // Retorna a lista de anotações arquivadas
  } catch (error) {
    console.error('Erro ao buscar anotações arquivadas:', error);
    throw error; // Lança o erro para que possa ser tratado
  }
};
