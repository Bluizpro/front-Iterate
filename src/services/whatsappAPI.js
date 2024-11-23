import axios from 'axios';

export const enviarMensagemWhatsApp = async (telefone, mensagem) => {
  try {
    const dataEnvio = new Date().toISOString(); // Data no formato ISO (yyyy-MM-ddTHH:mm:ss.sssZ)

    const response = await axios.post(
      'https://disparowhat.onrender.com/send-whatsapp/encomenda',
      {
        telefone, // telefone do destinatário
        message: mensagem, // mensagem a ser enviada
        dataEnvio, // data e hora em que a mensagem foi enviada
      }
    );
    return response.data; // Retorna a resposta da API
  } catch (error) {
    console.error('Erro ao enviar mensagem WhatsApp:', error);
    throw error;
  }
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const enviarMensagemWhatsAppAgua = async (mensagem) => {
  try {
    const dataEnvio = new Date().toISOString(); // Data no formato ISO (yyyy-MM-ddTHH:mm:ss.sssZ)

    const response = await axios.post(
      'https://disparowhat.onrender.com/send-whatsapp', // URL do endpoint
      {
        message: mensagem, // mensagem a ser enviada
        dataEnvio, // data e hora em que a mensagem foi enviada
      }
    );
    return response.data; // Retorna a resposta da API
  } catch (error) {
    console.error('Erro ao enviar mensagem WhatsApp:', error);
    throw error;
  }
};
