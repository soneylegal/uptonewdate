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

// Rota para página principal (tela inicial + tela de login)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "principal.html"));
});

// Rota para login e criação/carregamento do personagem
// ... (código existente do app.js)

// Rota para login e criação/carregamento do personagem
app.post("/login", (req, res) => {
  const { user, campo } = req.body; // Captura os dados do formulário

  getDbConnection((err, con) => {
    if (err) {
      return res.status(500).send('Erro ao conectar ao banco de dados.');
    }

    // Tenta buscar o protagonista com ID 1 no banco (se você estiver usando um ID fixo para teste)
    const sql = `
            SELECT p.id_personagem, p.nome, p.ocupacao, p.vida, p.armadura, p.dinheiro,
                   h1.nome_hab AS habilidade1_nome, h1.dano AS habilidade1_dano, h1.falha AS habilidade1_falha,
                   h2.nome_hab AS habilidade2_nome, h2.dano AS habilidade2_dano, h2.falha AS habilidade2_falha
            FROM personagem p
            LEFT JOIN habilidade h1 ON p.fk_id_habilidade1 = h1.id_habilidade
            LEFT JOIN habilidade h2 ON p.fk_id_habilidade2 = h2.id_habilidade
            WHERE p.id_personagem = 1; -- Assumindo que você sempre busca/atualiza o ID 1 para este teste
        `;

    con.query(sql, (queryErr, results) => {
      con.end();

      if (queryErr) {
        console.error('Erro ao buscar dados do protagonista: ' + queryErr);
        return res.status(500).send('Erro ao carregar dados do personagem.');
      }

      let protaData;
      if (results && results.length > 0) {
        // Se o protagonista com ID 1 existe no banco, usa os dados do banco
        const row = results[0];
        protaData = {
          nome: row.nome,
          ocupacao: row.ocupacao,
          vida: row.vida !== null ? row.vida : 160, // Usa vida do banco, ou 160 como padrão
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

        // Opcional: Se quiser atualizar o nome e ocupação do banco com os do formulário
        // Você precisaria de um UPDATE SQL aqui. Por agora, vamos garantir que o EJS
        // use os dados do formulário SE NÃO HOUVER DADOS DO BANCO.
        // Mas, se o protagonista ID 1 já existe, ele usará os dados do banco.
        // Para simplificar para este teste, vamos garantir que os valores do formulário
        // sejam usados caso o protagonista não seja encontrado no DB.

      } else {
        // Se o protagonista com ID 1 NÃO existe no banco, cria um NOVO com os dados do formulário
        console.warn("Protagonista com ID 1 não encontrado no DB. Criando novo com dados do formulário.");
        protaData = {
          nome: user || "Cangaceiro", // Usa o nome do formulário, ou "Cangaceiro" como fallback
          ocupacao: campo || "Cabra da pexte", // Usa a ocupação do formulário, ou "Cabra da pexte" como fallback
          vida: 160,
          armadura: 10,
          dinheiro: 50,
          habilidade1: { nome: "Soco", dano: 15, falha: 2 },
          habilidade2: { nome: "Peixeira", dano: 30, falha: 4 }
        };

        // Opcional: Inserir este novo protagonista no banco de dados.
        // Para este teste, não vamos inserir para não complicar, apenas garantindo que
        // os dados do formulário sejam exibidos. Se você quiser persistir, precisaria de uma query INSERT aqui.
      }

      res.render("infoprota", { prota: protaData });
    });
  });
});

app.post('/api/atualizar-vida-protagonista', (req, res) => {
  const { vidaAtual } = req.body;
  const protagonistaId = 1; // Mantendo fixo por enquanto

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