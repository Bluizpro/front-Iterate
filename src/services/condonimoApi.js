// services/condominoApi.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api/Condomino',
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function createCondomino(condomino) {
  try {
    const response = await apiClient.post('/', condomino);
    return response.data;
  } catch (error) {
    console.error(
      'Erro ao criar Condomino:',
      error.response?.data || error.message
    );
    throw error;
  }
}

export async function getCondominos() {
  try {
    const response = await apiClient.get('/');
    return response.data;
  } catch (error) {
    console.error(
      'Erro ao obter Condominos:',
      error.response?.data || error.message
    );
    throw error;
  }
}

export async function updateCondomino(condomino) {
  try {
    const response = await apiClient.put(`/${condomino.conjunto}`, condomino);
    return response.data;
  } catch (error) {
    console.error(
      'Erro ao atualizar Condomino:',
      error.response?.data || error.message
    );
    throw error;
  }
}
