import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:5120/api/CorrespondenciaExterna', // Verifique se este URL está correto
  headers: {
    'Content-Type': 'application/json',
  },
});

// Cria uma nova correspondência externa
export async function createCorrespondenciaExterno(correspondenciaExterno) {
  try {
    const response = await apiClient.post('/', correspondenciaExterno);
    return response.data;
  } catch (error) {
    console.error(
      'Erro ao criar CorrespondenciaExterno:',
      error.response?.data || error.message
    );
    throw error;
  }
}

// Obtém todas as correspondências externas
export async function getCorrespondenciasExterno() {
  try {
    const response = await apiClient.get('/');
    return response.data;
  } catch (error) {
    console.error(
      'Erro ao obter Correspondencias Externas:',
      error.response?.data || error.message
    );
    throw error;
  }
}

// Obtém uma correspondência externa por ID
export async function getCorrespondenciaExternoById(id) {
  try {
    const response = await apiClient.get(`/${id}`);
    return response.data;
  } catch (error) {
    console.error(
      'Erro ao obter CorrespondenciaExterno por ID:',
      error.response?.data || error.message
    );
    throw error;
  }
}

// Atualiza uma correspondência externa existente
export async function updateCorrespondenciaExterno(id, correspondenciaExterno) {
  try {
    const response = await apiClient.put(`/${id}`, correspondenciaExterno);
    return response.data;
  } catch (error) {
    console.error(
      'Erro ao atualizar CorrespondenciaExterno:',
      error.response?.data || error.message
    );
    throw error;
  }
}

// Deleta uma correspondência externa existente
export async function deleteCorrespondenciaExterno(id) {
  try {
    const response = await apiClient.delete(`/${id}`);
    return response.data;
  } catch (error) {
    console.error(
      'Erro ao deletar CorrespondenciaExterno:',
      error.response?.data || error.message
    );
    throw error;
  }
}
