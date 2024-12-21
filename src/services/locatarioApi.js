import axios from 'axios';

const API_URL = 'http://localhost:5001/api/Locatarios'; // Substitua pelo URL da sua API

// Configuração do Axios com URL base
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Função para criar um locatário
export const createLocatario = async (locatario) => {
  try {
    const response = await apiClient.post('/', locatario);
    return response.data;
  } catch (error) {
    console.error(
      'Erro ao criar locatário:',
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};
export async function getLocatario() {
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

// Função para buscar locatários por conjunto
export const getLocatariosByConjunto = async (conjunto) => {
  console.log('Conjunto:', conjunto); // Log do valor do conjunto
  try {
    const response = await apiClient.get(`/ByConjunto/${conjunto}`);
    console.log('Resposta da API:', response.data); // Log da resposta
    return response.data;
  } catch (error) {
    console.error(
      'Erro ao buscar locatários:',
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};
