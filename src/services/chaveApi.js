import axios from 'axios';

// Configura a instância do Axios com a URL base do backend
const api = axios.create({
  baseURL: 'http://localhost:5000/api/Chave', // Altere para a URL do seu back-end
  timeout: 10000, // Define um tempo limite (10 segundos)
});

// Serviço para salvar uma chave no backend
export const salvarChave = async (chave) => {
  try {
    // Envia a chave ao back-end pelo método POST
    const response = await api.post('/', chave); // '/' define a rota raiz da API
    return response.data; // Retorna os dados da resposta para o consumidor da função
  } catch (error) {
    // Tratamento detalhado de erros
    if (error.response) {
      // O servidor respondeu com um status diferente de 2xx
      console.error('Erro do servidor:', error.response.data);
      throw new Error(
        `Erro do servidor: ${error.response.data.message || 'Não especificado'}`
      );
    } else if (error.request) {
      // A requisição foi feita, mas nenhuma resposta foi recebida
      console.error('Sem resposta do servidor:', error.request);
      throw new Error(
        'Não foi possível se conectar ao servidor. Verifique sua conexão ou URL.'
      );
    } else {
      // Algo aconteceu ao configurar a requisição
      console.error('Erro ao configurar a requisição:', error.message);
      throw new Error('Erro ao configurar a requisição: ' + error.message);
    }
  }
};

// Adicione mais funções conforme necessário para outros endpoints
export const buscarChaves = async () => {
  try {
    const response = await api.get('/');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar as chaves:', error);
    throw error;
  }
};

export const buscarChavePorId = async (id) => {
  try {
    const response = await api.get(`/${id}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar a chave:', error);
    throw error;
  }
};

export const atualizarChave = async (id, chaveAtualizada) => {
  try {
    const response = await api.put(`/${id}`, chaveAtualizada);
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar a chave:', error);
    throw error;
  }
};

export const excluirChave = async (id) => {
  try {
    const response = await api.delete(`/${id}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao excluir a chave:', error);
    throw error;
  }
};
