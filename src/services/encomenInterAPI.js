import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api/CorrespondenciaInterno',
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
    // Envia a requisição PUT com o nomePessoaRetiraInterno no corpo da requisição
    const response = await apiClient.put(
      `/${id}/devolver`, // A URL do endpoint
      nomePessoaRetiraInterno // Apenas o nomePessoaRetiraInterno como string
    );

    // Retorna a resposta da API
    return response.data;
  } catch (error) {
    console.error(
      'Erro ao atualizar Correspondência Interna como retirada:',
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
// Função para buscar correspondências internas retiradas
export async function getCorrespondenciasInternasRetiradas() {
  try {
    const response = await apiClient.get('encomenda/retirada');
    return response.data;
  } catch (error) {
    console.error(
      'Erro ao obter Correspondencias Internas retiradas:',
      error.response?.data || error.message
    );
    throw error;
  }
}
