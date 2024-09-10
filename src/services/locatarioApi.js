import axios from 'axios';

const API_URL = 'http://localhost:5120/api/Locatarios'; // Substitua pelo URL da sua API

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

// Função para buscar locatários por conjunto
export const getLocatariosByConjunto = async (conjunto) => {
  try {
    const response = await apiClient.get(`/ByConjunto/${conjunto}`);
    return response.data;
  } catch (error) {
    console.error(
      'Erro ao buscar locatários:',
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};
