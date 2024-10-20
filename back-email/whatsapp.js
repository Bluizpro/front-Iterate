// No seu servidor Node.js
const express = require('express');
const cors = require('cors');
const twilio = require('twilio');
const admin = require('firebase-admin'); // Adiciona o Firebase Admin SDK
const bodyParser = require('body-parser'); // Para tratar JSON
const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json({ limit: '10mb' })); // Para suportar imagens grandes

// Inicialização do Firebase
const serviceAccount = require('./config/firebase.json'); // Caminho para sua chave de serviço

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'gs://salvaassinatura.appspot.com', // Ex: your-project.appspot.com
});

const bucket = admin.storage().bucket();

// Configurações do Twilio
const accountSid = 'AC8e14fdba54b332db561f2393580fcd1d'; // Seu Account SID do Twilio
const authToken = '8f82a199f3180159fc9deebf285077f2';   // Seu Auth Token do Twilio

// ============================================
// Endpoint para enviar mensagem via WhatsApp
app.post('/send-whatsapp', (req, res) => {
  let { message } = req.body;

  const client = new twilio(accountSid, authToken);
  let numeros = ['whatsapp:+5521979009967']; // Adicione mais números se necessário
  
  let promises = numeros.map(numero => {
    return client.messages.create({
      body: message,
      from: 'whatsapp:+14155238886', // Seu número do Twilio no formato whatsapp:+12345678901
      to: numero // Número do destinatário
    });
  });

  Promise.all(promises)
    .then(messages => {
      messages.forEach(message => console.log(message.sid));
      res.send('Mensagem enviada com sucesso!');
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Erro ao enviar a mensagem.');
    });
});

// Endpoint para enviar mensagem via WhatsApp com número dinâmico
app.post('/send-whatsapp/encomenda', (req, res) => {
  const { message, telefone } = req.body;

  console.log('Recebendo mensagem:', { message, telefone });

  const client = new twilio(accountSid, authToken);

  client.messages.create({
    body: message,
    from: 'whatsapp:+14155238886', // Seu número do Twilio
    to: `whatsapp:${telefone}`, // Número do destinatário
  })
  .then(message => {
    console.log('Mensagem enviada:', message.sid);
    res.send('Mensagem enviada com sucesso!');
  })
  .catch(err => {
    console.error('Erro ao enviar mensagem:', err);
    res.status(500).send('Erro ao enviar a mensagem.');
  });
});
// ============================================

// Endpoint para enviar a assinatura para o Firebase
app.post('/upload-signature', async (req, res) => {
  const { imageData } = req.body;

  if (!imageData) {
    return res.status(400).send('No image data provided.');
  }

  const timestamp = Date.now();
  const fileName = `assinaturas/${timestamp}.png`;
  const file = bucket.file(fileName);

  // Enviando a imagem para o Firebase
// Enviando a imagem para o Firebase
const buffer = Buffer.from(imageData.split(',')[1], 'base64');
await file.save(buffer, {
  contentType: 'image/png',
});

// Torna o arquivo público
await file.makePublic();

const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
res.send({ url: publicUrl });

});

app.listen(3000, () => console.log('Servidor rodando na porta 3000'));
