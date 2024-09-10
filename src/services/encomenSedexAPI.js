import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:5120/api/CorrespondenciaSedex',
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function createCorrespondenciaSedex(correspondenciaSedex) {
  try {
    const response = await apiClient.post('/', correspondenciaSedex);
    return response.data;
  } catch (error) {
    console.error(
      'Erro ao criar CorrespondenciaSedex:',
      error.response?.data || error.message
    );
    throw error;
  }
}

// Obtém todas as correspondências Sedex
export async function getCorrespondenciasSedex() {
  try {
    const response = await apiClient.get('/');
    return response.data;
  } catch (error) {
    console.error(
      'Erro ao obter Correspondencias Sedex:',
      error.response?.data || error.message
    );
    throw error;
  }
}

// Obtém uma correspondência Sedex por ID
export async function getCorrespondenciaSedexById(id) {
  try {
    const response = await apiClient.get(`/${id}`);
    return response.data;
  } catch (error) {
    console.error(
      'Erro ao obter CorrespondenciaSedex por ID:',
      error.response?.data || error.message
    );
    throw error;
  }
}

// Atualiza uma correspondência Sedex existente
export async function updateCorrespondenciaSedex(id, correspondenciaSedex) {
  try {
    const response = await apiClient.put(`/${id}`, correspondenciaSedex);
    return response.data;
  } catch (error) {
    console.error(
      'Erro ao atualizar CorrespondenciaSedex:',
      error.response?.data || error.message
    );
    throw error;
  }
}

// Deleta uma correspondência Sedex existente
export async function deleteCorrespondenciaSedex(id) {
  try {
    const response = await apiClient.delete(`/${id}`);
    return response.data;
  } catch (error) {
    console.error(
      'Erro ao deletar CorrespondenciaSedex:',
      error.response?.data || error.message
    );
    throw error;
  }
}
