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
