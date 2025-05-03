const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Torna a pasta public acessível ao navegador
app.use(express.static('public'));

// Rota para servir a página principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'principal.html'));
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
