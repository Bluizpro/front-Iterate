// services/anotacaoApi.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://gestor-encomenda-back.onrender.com/api/Visitante', // URL base para a API de visitantes
});

export async function createVisitante(visitante) {
  try {
    const response = await apiClient.post('/', visitante);
    return response.data;
  } catch (error) {
    console.error(
      'Erro ao criar visitante:',
      error.response ? error.response.data : error.message
    );
    throw error;
  }
}

export async function getVisitantes() {
  try {
    const response = await apiClient.get('/');
    return response.data;
  } catch (error) {
    console.error(
      'Erro ao obter visitantes:',
      error.response ? error.response.data : error.message
    );
    throw error;
  }
}

export async function deleteVisitante(id) {
  try {
    await apiClient.delete(`/${id}`);
  } catch (error) {
    console.error(
      'Erro ao remover visitante:',
      error.response ? error.response.data : error.message
    );
    throw error;
  }
}
