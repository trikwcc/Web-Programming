const express = require('express');
const { Client } = require('pg');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

const client = new Client({
  host: 'localhost',
  user: 'delveter',
  port: '5432',
  password: '9988776655',
  database: 'imperial',
});

client.connect();

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/login.html'));
});

app.get('/login.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/login.html'));
});

app.get('/cadastroLivro.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/cadastroLivro.html'));
});

app.get('/cadastroUsuario.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/cadastroUsuario.html'));
});

app.get('/listaDeLivros.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/listaDeLivros.html'));
});

app.get('/livros', (req, res) => {
  client.query('SELECT * FROM livros', (err, result) => {
    if (!err) {
      const livros = result.rows;
      res.json({ success: true, livros });
    } else {
      console.log(err.message);
      res.status(500).json({ success: false, message: 'Erro ao recuperar dados.' });
    }
  });
});

app.post('/apagarLivro', (req, res) => {
  const livroId = req.body.id;

  const query = 'DELETE FROM livros WHERE id = $1';
  const values = [livroId];

  client.query(query, values, (err) => {
    if (!err) {
      console.log('Livro apagado com sucesso!');
      res.json({ success: true });
    } else {
      console.log(err.message);
      res.status(500).json({ success: false, message: 'Erro ao apagar livro.' });
    }
  });
});

app.post('/processarCadastroUsuario', (req, res) => {
  const { nome, email, password } = req.body;

  const query = 'INSERT INTO Usuario (username, email, password) VALUES ($1, $2, $3)';
  const values = [nome, email, password];

  client.query(query, values, (err) => {
    if (!err) {
      console.log('Usuário cadastrado com sucesso!');
      res.redirect('/');
    } else {
      console.error(err.message);
      res.status(500).send('Erro ao cadastrar usuário: ' + err.message);
    }
  });
});

app.post('/processarLogin', (req, res) => {
  const { email, password } = req.body;
  const query = 'SELECT * FROM Usuario WHERE email = $1 AND password = $2';
  const values = [email, password];

  client.query(query, values, (err, result) => {
    if (!err) {
      if (result.rows.length > 0) {
        console.log('Login bem-sucedido!');
        res.json({ success: true });
      } else {
        console.log('Credenciais inválidas');
        res.status(401).json({ success: false, message: 'Credenciais inválidas.' });
      }
    } else {
      console.error(err.message);
      res.status(500).json({ success: false, message: 'Erro ao processar login.' });
    }
  });
});

app.post('/processarCadastro', (req, res) => {
  const { NomeLivro, NomeAUTOR, sinopse, nota, comentario } = req.body;

  const query = 'INSERT INTO livros (livro, autor, sinopse, nota, comentario) VALUES ($1, $2, $3, $4, $5)';
  const values = [NomeLivro, NomeAUTOR, sinopse, nota, comentario];

  client.query(query, values, (err) => {
    if (!err) {
      console.log('Livro cadastrado com sucesso!');
      res.redirect('/listaDeLivros.html');
    } else {
      console.error(err.message);
      res.status(500).send('Erro ao cadastrar livro: ' + err.message);
    }
  });
});

app.post('/alterarLivro', (req, res) => {
  const { id, sinopse, comentario } = req.body;

  const query = 'UPDATE livros SET sinopse = $1, comentario = $2 WHERE id = $3';
  const values = [sinopse, comentario, id];

  client.query(query, values, (err) => {
    if (!err) {
      console.log('Livro alterado com sucesso!');
      res.json({ success: true });
    } else {
      console.error(err.message);
      res.status(500).json({ success: false, message: 'Erro ao alterar livro.' });
    }
  });
});

app.get('/login', (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect('/cadastroLivro.html');
  }
  res.sendFile(path.join(__dirname, 'public/login.html'));
});

app.use((req, res) => {
  res.status(404).send('404 - Not Found');
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
