// services/anotacaoApi.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:5120/api/QtcInfor',
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

export async function getArchivedQtcInfos() {
  const response = await apiClient.get('/arquivar-qtc');
  return response.data;
}
