import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5120/api/Chave', // URL do seu backend
});

export const salvarChave = async (chave) => {
  try {
    const response = await api.post('/Chave', chave);
    return response.data;
  } catch (error) {
    throw error;
  }
};
