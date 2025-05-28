const db = require("./database/banco.js");
const express = require("express");
const path = require("path");
const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "views")));

// Rota para servir a página principal
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "principal.html"));
});

// Inicia o servidor
app.listen(3000, () => {
  console.log(`Servidor rodando em http://localhost:${3000}`);
});

// Rota para inserir dados no banco
// app.post('/inserir', (req, res) => {
//   const { coluna1, coluna2, coluna3 } = req.body;
//   const comando = `INSERT INTO tabela (coluna1, coluna2, coluna3)
//   VALUES ('${coluna1}', '${coluna2}', '${coluna3}')`;
//   db.executarComando(comando);
//   res.send('Dados inseridos com sucesso!');
// });
