import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5120/api/Chave', // URL do seu backend
});

// Função para salvar a chave no back-end
export const salvarChave = async (chave) => {
  try {
    // Envia a chave para o back-end usando o método POST
    const response = await api.post('', chave); // Mantenha a URL vazia aqui, pois já definimos baseURL
    return response.data; // Retorna os dados da resposta
  } catch (error) {
    console.error('Erro ao salvar a chave:', error);
    throw error; // Lança o erro para que possa ser tratado no componente
  }
};
