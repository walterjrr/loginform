// Importando os módulos necessários
const express = require('express');
const bodyParser = require('body-parser');

const fs = require('fs');

// Criando uma instância do aplicativo Express
const app = express();

app.use(express.static('public'));

// Configurando o middleware para analisar o corpo das requisições
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Definindo uma rota básica
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/cadastrado', (req, res) => {
    const email = req.query.email;
    const password = req.query.password;

    const filePath = __dirname + '/public/cadastrado.html';

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Erro ao ler o arquivo');
      return;
    }

    // Substituir os placeholders no HTML pelos valores do email e senha
    const updatedData = data.replace('{{email}}', email).replace('{{password}}', password);
    res.send(updatedData);
  });
});


app.post('/enviar-formulario', (req, res) => {
    email = req.body.email
    password = req.body.password
    console.log(email, password)

    res.redirect(`/cadastrado?email=${email}&password=${password}`)
})

// Definindo outras rotas e lógica de negócio

// Iniciando o servidor
const port = 3000;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
