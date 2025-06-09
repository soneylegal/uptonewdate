// app.js

const express = require("express");
const path = require("path");
const mysql = require('mysql2');

const { Protagonista } = require("./public/js/protagonista");
const { Habilidades, CaixaItens } = require("./public/js/arsenal");
const { Personagem } = require("./public/js/personagem");

const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

function getDbConnection(callback) {
  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'test'
  });

  connection.connect(err => {
    if (err) {
      console.error('Erro na conexão com o banco de dados test: ' + err.stack);
      return callback(err);
    }
    console.log('Conectado ao MySQL - test. ID: ' + connection.threadId);
    callback(null, connection);
  });
}

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "principal.html"));
});

app.post("/login", (req, res) => {
  const { user, campo } = req.body;
  const protagonistaId = 1;

  getDbConnection((err, con) => {
    if (err) {
      return res.status(500).send('Erro ao conectar ao banco de dados.');
    }

    const selectSql = `
      SELECT p.id_personagem, p.nome, p.ocupacao, p.vida, p.armadura, p.dinheiro,
             h1.id_habilidade AS habilidade1_id, h1.nome_hab AS habilidade1_nome, h1.dano AS habilidade1_dano, h1.falha AS habilidade1_falha,
             h2.id_habilidade AS habilidade2_id, h2.nome_hab AS habilidade2_nome, h2.dano AS habilidade2_dano, h2.falha AS habilidade2_falha
      FROM personagem p
      LEFT JOIN habilidade h1 ON p.fk_id_habilidade1 = h1.id_habilidade
      LEFT JOIN habilidade h2 ON p.fk_id_habilidade2 = h2.id_habilidade
      WHERE p.id_personagem = 1;
    `;

    con.query(selectSql, [protagonistaId], (selectErr, results) => {
      if (selectErr) {
        con.end();
        console.error('Erro ao buscar dados do protagonista: ' + selectErr);
        return res.status(500).send('Erro ao carregar dados do personagem.');
      }

      const defaults = {
        vida: 160,
        armadura: 10,
        dinheiro: 50,
        habilidade1: "Soco",
        habilidade2: "Peixeira"
      };

      let needsFullInitialization = false;
      let protaData;

      if (results && results.length > 0) {
        const row = results[0];

        if (
          row.vida === null || row.armadura === null || row.dinheiro === null ||
          row.habilidade1_id === null || row.habilidade2_id === null ||
          row.vida === 0 || row.dinheiro === 0
        ) {
          needsFullInitialization = true;
          console.log("Dados incompletos do personagem. Inicializando...");
        } else {
          protaData = {
            nome: user || row.nome,
            ocupacao: campo || row.ocupacao,
            vida: row.vida,
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
        }
      } else {
        needsFullInitialization = true;
        console.warn("Personagem não encontrado. Inicializando do zero.");
      }

      if (needsFullInitialization) {
        const initializeSql = `
          UPDATE personagem
          SET nome = ?, ocupacao = ?, vida = ?, armadura = ?, dinheiro = ?,
              fk_id_habilidade1 = (SELECT id_habilidade FROM habilidade WHERE nome_hab = ?),
              fk_id_habilidade2 = (SELECT id_habilidade FROM habilidade WHERE nome_hab = ?)
          WHERE id_personagem = ?;
        `;

        con.query(initializeSql, [
          user, campo,
          defaults.vida, defaults.armadura, defaults.dinheiro,
          defaults.habilidade1, defaults.habilidade2,
          protagonistaId
        ], (initErr) => {
          if (initErr) {
            con.end();
            console.error('Erro ao inicializar dados do personagem: ' + initErr);
            return res.status(500).send('Erro na inicialização.');
          }

          con.query(selectSql, [protagonistaId], (finalSelectErr, finalResults) => {
            con.end();
            if (finalSelectErr || !finalResults || finalResults.length === 0) {
              return res.status(500).send('Erro ao buscar dados após inicialização.');
            }

            const finalRow = finalResults[0];
            protaData = {
              nome: finalRow.nome,
              ocupacao: finalRow.ocupacao,
              vida: finalRow.vida,
              armadura: finalRow.armadura,
              dinheiro: finalRow.dinheiro,
              habilidade1: {
                nome: finalRow.habilidade1_nome,
                dano: finalRow.habilidade1_dano,
                falha: finalRow.habilidade1_falha
              },
              habilidade2: {
                nome: finalRow.habilidade2_nome,
                dano: finalRow.habilidade2_dano,
                falha: finalRow.habilidade2_falha
              }
            };
            console.log("Personagem inicializado e carregado:", protaData.nome);
            res.render("infoprota", { prota: protaData });
          });
        });

      } else {
        const updateSql = `UPDATE personagem SET nome = ?, ocupacao = ? WHERE id_personagem = ?`;
        con.query(updateSql, [user, campo, protagonistaId], (updateErr) => {
          if (updateErr) {
            con.end();
            return res.status(500).send('Erro ao atualizar nome/ocupação.');
          }
          con.end();
          res.render("infoprota", { prota: protaData });
        });
      }
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
    con.query(sql, [vidaAtual, protagonistaId], (queryErr) => {
      con.end();
      if (queryErr) {
        return res.status(500).json({ message: 'Erro ao atualizar vida.' });
      }
      res.json({ message: 'Vida atualizada com sucesso.' });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
