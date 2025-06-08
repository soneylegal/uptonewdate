// app.js

const express = require("express");
const path = require("path");
const mysql = require('mysql2'); // Importar o mysql2

// As classes Protagonista, Habilidades, CaixaItens devem estar disponíveis no backend
// E estão sendo importadas corretamente para uso no servidor.
const { Protagonista } = require("./public/js/protagonista"); // OK
const { Habilidades, CaixaItens } = require("./public/js/arsenal"); // OK


const app = express();
const PORT = 3000;

// Configurações do EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middlewares
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json()); // Para parsear JSON no corpo das requisições POST
app.use(express.urlencoded({ extended: true }));

// --- Funções de Conexão com o Banco de Dados ---
function getDbConnection(callback) {
  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    // password: '123456', // Se você tem senha, descomente e adicione
    database: 'test' // Conecta diretamente ao banco do projeto
  });

  connection.connect(function (err) {
    if (err) {
      console.error('Erro na conexão com o banco de dados test: ' + err.stack);
      return callback(err);
    }
    console.log('Conectado ao MySQL - test. ID: ' + connection.threadId);
    callback(null, connection);
  });
}

// Rota para página principal
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "principal.html"));
});

// Rota para login e criação/carregamento do personagem
app.post("/login", (req, res) => {
  const { user, campo } = req.body;

  getDbConnection((err, con) => {
    if (err) {
      return res.status(500).send('Erro ao conectar ao banco de dados.');
    }

    const sql = `
            SELECT p.id_personagem, p.nome, p.ocupacao, p.vida, p.armadura, p.dinheiro,
                   h1.nome_hab AS habilidade1_nome, h1.dano AS habilidade1_dano, h1.falha AS habilidade1_falha,
                   h2.nome_hab AS habilidade2_nome, h2.dano AS habilidade2_dano, h2.falha AS habilidade2_falha
            FROM personagem p
            LEFT JOIN habilidade h1 ON p.fk_id_habilidade1 = h1.id_habilidade
            LEFT JOIN habilidade h2 ON p.fk_id_habilidade2 = h2.id_habilidade
            WHERE p.id_personagem = 1;
        `;

    con.query(sql, (queryErr, results) => {
      con.end();

      if (queryErr) {
        console.error('Erro ao buscar dados do protagonista: ' + queryErr);
        return res.status(500).send('Erro ao carregar dados do personagem.');
      }

      let protaData;
      if (results && results.length > 0) {
        const row = results[0];
        protaData = {
          nome: row.nome,
          ocupacao: row.ocupacao,
          vida: row.vida !== null ? row.vida : 160,
          armadura: row.armadura,
          dinheiro: row.dinheiro,
          habilidade1: {
            nome: row.habilidade1_nome,
            dano: row.habilidade1_dano,
            falha: row.habilidade1_falha
          },
          habilidade2: {
            nome: row.habilidade2_nome,
            dano: row.habilidade2_dano,
            falha: row.habilidade2_falha
          }
        };
        console.log("Protagonista carregado do DB:", protaData.nome, "Vida:", protaData.vida);

      } else {
        console.warn("Protagonista com ID 1 não encontrado no DB. Usando dados padrão.");
        protaData = {
          nome: user || "Cangaceiro",
          ocupacao: campo || "Cabra da pexte",
          vida: 160,
          armadura: 10,
          dinheiro: 50,
          habilidade1: { nome: "Soco", dano: 15, falha: 2 },
          habilidade2: { nome: "Peixeira", dano: 30, falha: 4 }
        };
      }

      res.render("infoprota", { prota: protaData });
    });
  });
});

app.post('/api/atualizar-vida-protagonista', (req, res) => {
  const { vidaAtual } = req.body;
  const protagonistaId = 1;

  if (typeof vidaAtual === 'undefined' || vidaAtual < 0) {
    return res.status(400).json({ message: 'Vida inválida fornecida.' });
  }

  getDbConnection((err, con) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao conectar ao banco de dados.' });
    }

    const sql = `UPDATE personagem SET vida = ? WHERE id_personagem = ?`;
    con.query(sql, [vidaAtual, protagonistaId], (queryErr, result) => {
      con.end();

      if (queryErr) {
        console.error('Erro ao atualizar vida no DB: ' + queryErr);
        return res.status(500).json({ message: 'Erro interno ao salvar vida.' });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Protagonista não encontrado para atualização.' });
      }
      res.json({ message: 'Vida do protagonista atualizada com sucesso!', newLife: vidaAtual });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});