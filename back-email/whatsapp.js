// No seu servidor Node.js
const express = require('express');
const cors = require('cors');
const twilio = require('twilio');
const app = express();

app.use(cors());

app.use(express.json());

const accountSid = 'AC8e14fdba54b332db561f2393580fcd1d'; // Seu Account SID do Twilio
const authToken = '8f82a199f3180159fc9deebf285077f2';   // Seu Auth Token do Twilio

app.post('/send-whatsapp', (req, res) => {
  let { message } = req.body;

  const client = new twilio(accountSid, authToken);
  let numeros = ['whatsapp:+5521979009967', 'whatsapp:+5511981860553', 'whatsapp:+5511953050582'];
  
  let promises = numeros.map(numero => {
    return client.messages.create({
      body: message,
      from: 'whatsapp:+14155238886', // Seu número do Twilio no formato whatsapp:+12345678901
      to: numero // Número do destinatário no formato whatsapp:+09876543210
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

app.post('/send-whatsapp/encomenda', (req, res) => {
  let { message, telefone } = req.body;

  const client = new twilio(accountSid, authToken);

  client.messages.create({
    body: message,
    from: 'whatsapp:+14155238886', 
    to: `whatsapp:${telefone}` 
  })
  .then(message => {
    console.log(message.sid);
    res.send('Mensagem enviada com sucesso!');
  })
  .catch(err => {
    console.error(err);
    res.status(500).send('Erro ao enviar a mensagem.');
  });
});


app.listen(3000, () => console.log('Servidor rodando na porta 3000'));
