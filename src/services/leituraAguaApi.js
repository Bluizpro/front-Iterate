import axios from 'axios';

const API_URL = 'http://localhost:5120/api/LeituraAgua'; // Substitua pelo URL correto da sua API

// Configuração do Axios com URL base
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Função para criar uma nova leitura de água
export const createLeituraAgua = async (leituraAgua) => {
  try {
    const response = await apiClient.post('/', leituraAgua);
    return response.data;
  } catch (error) {
    console.error(
      'Erro ao criar leitura de água:',
      error.response ? error.response.data : error.message
    );
    throw new Error(error.response ? error.response.data : error.message);
  }
};

// Função para buscar todas as leituras de água e retornar os consumos e datas
export const getLeiturasAgua = async () => {
  try {
    const response = await apiClient.get('/');

    // Mapeando os consumos e as datas de cada leitura
    const leituras = response.data.map((item) => ({
      consumo: item.consumo, // Ajuste "consumo" se necessário
      dataInicial: item.dataInicial, // Ajuste "dataInicial" para o nome correto da propriedade de data
    }));

    return leituras;
  } catch (error) {
    console.error(
      'Erro ao buscar leituras de água:',
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

// Função para buscar leituras de água por data
export const getLeiturasAguaPorData = async (data) => {
  try {
    const response = await apiClient.get(`/date/${data}`); // Chamando o endpoint correto com a data
    return response.data; // Retorna as leituras que correspondem à data fornecida
  } catch (error) {
    console.error(
      'Erro ao buscar leituras de água por data:',
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

// Função para atualizar uma leitura de água existente
export const updateLeituraAgua = async (id, leituraAgua) => {
  try {
    const response = await apiClient.put(`/${id}`, leituraAgua);
    return response.data;
  } catch (error) {
    console.error(
      'Erro ao atualizar leitura de água:',
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

// Função para deletar uma leitura de água
export const deleteLeituraAgua = async (id) => {
  try {
    const response = await apiClient.delete(`/${id}`);
    return response.data;
  } catch (error) {
    console.error(
      'Erro ao deletar leitura de água:',
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};
