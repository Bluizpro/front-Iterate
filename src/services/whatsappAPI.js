// services/whatsappApi.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function enviarMensagemWhatsApp(telefone, mensagem) {
  try {
    const response = await apiClient.post('/send-whatsapp/encomenda', {
      message: mensagem,
      telefone: telefone,
    });
    return response.data;
  } catch (error) {
    console.error(
      'Erro ao enviar mensagem via WhatsApp:',
      error.response?.data || error.message
    );
    throw error;
  }
}
