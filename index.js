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
  const userName = req.query.userName;

  const filePath = __dirname + '/public/cadastrado.html';

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Erro ao ler o arquivo');
      return;
    }

    // Substituir os placeholders no HTML pelos valores do email e senha
    const updatedData = data.replace('{{email}}', email).replace('{{password}}', password).replace('{{userName}}', userName);
    res.send(updatedData);
  });
});

app.post('/enviar-formulario', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const userName = req.body.userName;
  console.log(email, password, userName);

  res.redirect(`/cadastrado?email=${email}&password=${password}&userName=${userName}`);
});

app.get('/logado', (req, res) => {
  const login = req.query.login;
  const senha = req.query.senha;
  const userName = req.query.userName

  const filePath = __dirname + '/public/logado.html';

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Erro ao ler o arquivo');
      return;
    }

    // Substituir os placeholders no HTML pelos valores do email e senha
    const updatedData = data.replace('{{login}}', login).replace('{{senha}}', senha).replace('{{userName}}', userName);
    res.send(updatedData);
  });
});

app.post('/enviar-formulario2', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const userName = req.body.userName;
  const login = req.body.login;
  const senha = req.body.senha;

  console.log(login, senha, email, password, userName);

  if (email === login && password === senha) {
    console.log('Você está logado', email, password, userName);
    res.redirect(`/logado?userName=${userName}`);
  } else {
    console.log('Erro de login');
    res.redirect('/login-error');
  }
});

// Rota para exibir uma página de erro de login
app.get('/login-error', (req, res) => {
  res.send('Erro de login. Por favor, verifique suas credenciais e tente novamente.');
});

// Iniciando o servidor
const port = 3000;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
