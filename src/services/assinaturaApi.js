// src/services/signatureService.js
import axios from 'axios';

const API_URL = 'https://disparrro-back.onrender.com'; // URL do seu servidor Node.js

// Função para fazer o upload da assinatura
export const uploadSignature = async (imageData) => {
  try {
    const response = await axios.post(`${API_URL}/upload-signature`, {
      imageData,
    });
    return response.data; // Retorna a URL pública da imagem
  } catch (error) {
    console.error('Erro ao enviar a assinatura:', error);
    throw error; // Propaga o erro
  }
};
// src/services/assinaturaService.js

const API_URL_back = 'https://gestor-encomenda.onrender.com/api/Assinatura'; // URL do seu servidor backend

// Função para fazer o upload da assinatura
export const saveAssinatura = async (assinatura) => {
  try {
    const response = await axios.post(API_URL_back, assinatura); // Envia a assinatura para o backend
    return response.data; // Retorna a assinatura criada
  } catch (error) {
    console.error('Erro ao enviar a assinatura:', error);
    throw error; // Propaga o erro
  }
};
