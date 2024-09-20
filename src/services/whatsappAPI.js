// services/whatsappAPI.js
import axios from 'axios';

export const enviarMensagemWhatsApp = async (telefone, mensagem) => {
  try {
    const response = await axios.post(
      'http://localhost:3000/send-whatsapp/encomenda',
      {
        telefone, // telefone do destinatário
        message: mensagem, // mensagem a ser enviada
      }
    );
    return response.data; // Retorna a resposta da API
  } catch (error) {
    console.error('Erro ao enviar mensagem WhatsApp:', error);
    throw error;
  }
};
