import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://gestor-encomenda-back.onrender.com/api/CorrespondenciaExterna', // Verifique se este URL está correto
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

export async function updateCorrespondenciaExternoRetirada(
  id,
  nomePessoaRetiraExterno
) {
  try {
    const response = await apiClient.put(
      `/${id}/Retirada`, // Este é o endpoint correto para dar baixa
      nomePessoaRetiraExterno // Passando o nome da pessoa
    );
    return response.data;
  } catch (error) {
    console.error(
      'Erro ao atualizar Correspondencia Externa como retirada:',
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

// Função para buscar correspondências externas retiradas
export async function getCorrespondenciasExternasRetiradas() {
  try {
    const response = await apiClient.get('/encomenda/retirada'); // Ajustado o caminho
    return response.data;
  } catch (error) {
    console.error(
      'Erro ao obter Correspondencias Externas retiradas:',
      error.response?.data || error.message
    );
    throw error;
  }
}
