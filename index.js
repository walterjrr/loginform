// Importando os módulos necessários
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Criando uma instância do aplicativo Express
const app = express();

app.use('/public', express.static(path.join(__dirname, 'public')));

// Configurando o middleware para analisar o corpo das requisições
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuração do Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const destino = path.join(__dirname, 'public', 'imagens');
    cb(null, 'public/imagens/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
  }
});

const upload = multer({ storage: storage });


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
  const caminhoImagem = req.query.imagem

  const filePath = __dirname + '/public/logado.html';

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Erro ao ler o arquivo');
      return;
    }

    // Substituir os placeholders no HTML pelos valores do email e senha
    const updatedData = data.replace('{{login}}', login)
      .replace('{{senha}}', senha)
      .replace('{{userName}}', userName)
      .replace('{{caminhoImagem}}', caminhoImagem);

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

app.post('/upload-imagem', upload.single('imagem'), (req, res) => {
  try {
    // A imagem foi carregada com sucesso
    const imagem = req.file;

    // Verificar se uma imagem foi enviada
    if (!imagem) {
      res.status(400).send('Nenhuma imagem foi enviada.');
      return;
    }

    // Salvar a imagem em um diretório específico
    const caminhoImagem = 'public/imagens/' + imagem.filename;
    fs.rename(imagem.path, caminhoImagem, (err) => {
      if (err) {
        console.error('Erro ao salvar a imagem:', err);
        res.status(500).send('Erro ao salvar a imagem.');
        return;
      }

      // Realizar as ações desejadas com o caminho da imagem, como salvá-lo em uma constante
      console.log('Caminho da imagem:', caminhoImagem);
      console.log(req.body.userName)

      // Redirecionar para a página logado.html com o caminho da imagem
      res.redirect(`/logado?imagem=${encodeURIComponent(caminhoImagem)}&userName=${encodeURIComponent(req.body.userName)}`);
    });
  } catch (err) {
    console.error('Erro ao processar a solicitação:', err);
    res.status(500).send('Erro ao processar a solicitação.');
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
