// services/funcionarioApi.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:5001/api/Funcionario',
});

export async function createFuncionario(funcionario) {
  try {
    const response = await apiClient.post('/', funcionario);
    return response.data;
  } catch (error) {
    console.error(
      'Erro ao criar funcionário:',
      error.response ? error.response.data : error.message
    );
    throw error;
  }
}

export async function getFuncionario() {
  try {
    const response = await apiClient.get('/');
    return response.data;
  } catch (error) {
    console.error(
      'Erro ao obter funcionários:',
      error.response ? error.response.data : error.message
    );
    throw error;
  }
}

export async function removeFuncionario(conjunto) {
  try {
    const response = await apiClient.delete(`/${conjunto}`);
    return response.data;
  } catch (error) {
    console.error(
      'Erro ao remover funcionário:',
      error.response ? error.response.data : error.message
    );
    throw error;
  }
}
