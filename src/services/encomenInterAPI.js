import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:5120/api/CorrespondenciaInterno',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Cria uma nova correspondência interna
export async function createCorrespondenciaInterno(correspondenciaInterno) {
  try {
    const response = await apiClient.post('/', correspondenciaInterno);
    return response.data;
  } catch (error) {
    console.error(
      'Erro ao criar CorrespondenciaInterno:',
      error.response?.data || error.message
    );
    throw error;
  }
}

// Obtém todas as correspondências internas
export async function getCorrespondenciasInternas() {
  try {
    const response = await apiClient.get('/');
    return response.data;
  } catch (error) {
    console.error(
      'Erro ao obter Correspondencias Internas:',
      error.response?.data || error.message
    );
    throw error;
  }
}

// Obtém uma correspondência interna por ID
export async function getCorrespondenciaInternaById(id) {
  try {
    const response = await apiClient.get(`/${id}`);
    return response.data;
  } catch (error) {
    console.error(
      'Erro ao obter CorrespondenciaInterna por ID:',
      error.response?.data || error.message
    );
    throw error;
  }
}

export async function updateCorrespondenciaInternaRetirada(
  id,
  nomePessoaRetiraInterno
) {
  try {
    const response = await apiClient.put(
      `/${id}/devolver`, // A URL do endpoint deve estar correta
      nomePessoaRetiraInterno // O nome da pessoa deve ser passado como corpo
    );
    return response.data;
  } catch (error) {
    console.error(
      'Erro ao atualizar Correspondencia Interna como retirada:',
      error.response?.data || error.message
    );
    throw error;
  }
}

// Deleta uma correspondência interna existente
export async function deleteCorrespondenciaInterno(id) {
  try {
    const response = await apiClient.delete(`/${id}`);
    return response.data;
  } catch (error) {
    console.error(
      'Erro ao deletar CorrespondenciaInterna:',
      error.response?.data || error.message
    );
    throw error;
  }
}
