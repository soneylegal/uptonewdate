"use strict";


const mysql = require('mysql2');
const { data_para_str, imprime_contato } = require('./util');


function open_connection_and_create_db(callback) {
  console.log("Conectando...");

  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root'
    // sem 'database'
  });

  connection.connect(function(err) {
    if (err) {
      console.error('Erro na conexão: ' + err.stack);
      return;
    }
    console.log('Conectado ao MySQL. ID: ' + connection.threadId);

    const sql_create_db = `CREATE DATABASE IF NOT EXISTS dbprojeto`;

    connection.query(sql_create_db, function(err) {
      if (err) {
        console.error('Erro ao criar banco: ' + err);
        return;
      }

      console.log("Banco de dados 'dbprojeto' criado/verificado.");

      connection.changeUser({ database: 'dbprojeto' }, function(err) {
        if (err) {
          console.error('Erro ao mudar para o banco: ' + err);
          return;
        }

        console.log("Conectado ao banco 'dbprojeto'");
        callback(connection);
      });
    });
  });
}

function callback_erro(err, results, fields) {
  if (err) {
    console.error('Erro: ' + err);
    return;
  }
}

function create_table_habilidades(con) {
  console.log("Criando tabela 'habilidade'...");
  const sql = `
    CREATE TABLE IF NOT EXISTS habilidade (
      id_habilidade INT NOT NULL PRIMARY KEY,
      dano INT,
      falha INT,
      nome_hab VARCHAR(255)
    );
  `;
  con.query(sql, callback_erro);
}

function create_table_cenas(con) {
  console.log("Criando tabela 'cenas'...");
  const sql = `
    CREATE TABLE IF NOT EXISTS cenas (
      id_cenas INT NOT NULL PRIMARY KEY,
      descricao VARCHAR(255),
      ganho INT,
      nome_cena VARCHAR(255)
    );
  `;
  con.query(sql, callback_erro);
}

function create_table_mapa_fases(con){
  console.log("criando tabela mapa_fases...")
  const sql = `
  CREATE TABLE IF NOT EXISTS mapa_fases(
  id_local INT NOT NULL PRIMARY KEY, 
  nome_mapa VARCHAR(255),
  id_fases INT,
  status VARCHAR(255),
  nome_fases VARCHAR(255),
  fk_id_cenas INT,
  FOREIGN KEY (fk_id_cenas) REFERENCES cenas(id_cenas)
  );
  `
  con.query(sql, callback_erro)
   
  console.log('fim...')
}

function create_table_dialogo(con) {
  console.log("Criando tabela 'dialogo'...");
  const sql = `
    CREATE TABLE IF NOT EXISTS dialogo (
      id_dialogo INT NOT NULL PRIMARY KEY,
      fk_id_personagem INT,
      fala VARCHAR(255),
      FOREIGN KEY (fk_id_personagem) REFERENCES personagem(id_personagem)
    );
  `;
  con.query(sql, callback_erro);
}

function create_table_dialogo_mapa_fases(con) {
  console.log("Criando tabela 'diaalogo_mapa_fases'...");
  const sql = `
    CREATE TABLE IF NOT EXISTS mapa_fases (
      fk_id_local INT,
      fk_id_dialogo INT,
      FOREIGN KEY (fk_id_local) REFERENCES mapa_fases(id_local),
      FOREIGN KEY (fk_id_dialogo) REFERENCES dialogo(id_dialogo),
      PRIMARY KEY(fk_id_local, fk_id_dialogo)
    );
  `;
  con.query(sql, callback_erro);
}

function create_table_itens(con) {
  console.log("Criando tabela 'itens'...");
  const sql = `
    CREATE TABLE IF NOT EXISTS itens (
      id_item INT NOT NULL PRIMARY KEY,
      item VARCHAR(255)
    );
  `;
  con.query(sql, callback_erro);
}

function create_table_personagem(con) {
  console.log("Criando tabela 'personagem'...");
  const sql = `
    CREATE TABLE IF NOT EXISTS personagem (
      id_personagem INT NOT NULL PRIMARY KEY,
      nome VARCHAR(255),
      vida INT,
      dinheiro INT,
      ocupacao VARCHAR(255),
      armadura INT,
      velocidade INT,
      reputacao INT,
      personagem_tipo VARCHAR(255),
      fk_id_item INT,
      fk_id_habilidade1 INT,
      fk_id_habilidade2 INT,
      FOREIGN KEY (fk_id_item) REFERENCES itens(id_item),
      FOREIGN KEY (fk_id_habilidade1) REFERENCES habilidade(id_habilidade),
      FOREIGN KEY (fk_id_habilidade2) REFERENCES habilidade(id_habilidade)
    );
  `;
  con.query(sql, callback_erro);
}


function inserir_itens1(con) {
   console.log("Inserindo itens 1...");
   const sql = `INSERT INTO itens (id_item, item)
             VALUES (1, 'cantil');`;
   con.query(sql, callback_erro);
 }


 function inserir_personagem1(con) {
   console.log("Inserindo personagem 1...");
   const sql = `INSERT INTO personagem (id_personagem, nome, vida, dinheiro, ocupacao, armadura, velocidade, reputacao, personagem_tipo, fk_id_item, fk_id_habilidade1, fk_id_habilidade2 )
                VALUES (1, 'protagonista', 100, 0, 'a definir', 0, 0, 0, 'jogador', 1,NULL,NULL);`;
   con.query(sql, callback_erro);
 }

 function inserir_hab1(con) {
   console.log("Inserindo hab 1...");
   const sql = `INSERT INTO habilidade (id_habilidade, dano, falha, nome_hab)
             VALUES (1, 7, 2, 'pistola');`;
   con.query(sql, callback_erro);
 }

 function inserir_hab2(con) {
   console.log("Inserindo hab 2...");
   const sql = `INSERT INTO habilidade (id_habilidade, dano, falha, nome_hab)
             VALUES (2, 12, 5, 'tiro duplo de escopeta');`;
   con.query(sql, callback_erro);
 }

  function inserir_personagem2(con) {
   console.log("Inserindo personagem 2...");
   const sql = `INSERT INTO personagem (id_personagem, nome, vida, dinheiro, ocupacao, armadura, velocidade, reputacao, personagem_tipo, fk_id_item, fk_id_habilidade1, fk_id_habilidade2 )
                VALUES (2, 'Lampião', 80, 500, 'Líder do cangaço', 2, 4, 100, 'NPC', NULL , 1, 2);`;
   con.query(sql, callback_erro);
 }

 
function inserir_personagem3(con) {
   console.log("Inserindo personagem 3...");
   const sql = `INSERT INTO personagem (id_personagem, nome, vida, dinheiro, ocupacao, armadura, velocidade, reputacao, personagem_tipo, fk_id_item, fk_id_habilidade1, fk_id_habilidade2 )
                VALUES (3, 'Maria Rendeira', NULL, NULL, 'dona de casa', NULL, NULL, NULL, 'NPC', NULL,NULL,NULL);`;
   con.query(sql, callback_erro);
 }

 function inserir_dialogo1(con) {
  console.log("Inserindo dialogo 1...");
  const sql = `INSERT INTO dialogo (id_dialogo, fk_id_personagem, fala)
               VALUES (1, 2, 'Acorda, cabra! Precisa saber lutar à risca faca se quiser se juntar ao bando.');`;
  con.query(sql, callback_erro);
}

function inserir_dialogo2(con) {
  console.log("Inserindo dialogo 2...");
  const sql = `INSERT INTO dialogo (id_dialogo, fk_id_personagem, fala)
               VALUES (2, 1, 'Quem é você?!');`;
  con.query(sql, callback_erro);
}

function inserir_dialogo3(con) {
  console.log("Inserindo dialogo 3...");
  const sql = `INSERT INTO dialogo (id_dialogo, fk_id_personagem, fala)
               VALUES (3, 2, 'Capitão do cangaço. Estou aqui para te ensinar a meter bala nos macacos! Agora, aperte a tecla ''Enter'' para começar.');`;
  con.query(sql, callback_erro);
}

function inserir_dialogo4(con) {
  console.log("Inserindo dialogo 4...");
  const sql = `INSERT INTO dialogo (id_dialogo, fk_id_personagem, fala)
               VALUES (4, 3, 'Oh, pelo amor de meu Padinho. Me ajude a resgatar a minha jóia de família! Um jagunço a levou...');`;
  con.query(sql, callback_erro);
}

function inserir_dialogo5(con) {
  console.log("Inserindo dialogo 5...");
  const sql = `INSERT INTO dialogo (id_dialogo, fk_id_personagem, fala)
               VALUES (5, 1, 'Se acalme, posso ajudar a sinhora. Para onde levaram?');`;
  con.query(sql, callback_erro);
}

function inserir_dialogo6(con) {
  console.log("Inserindo dialogo 6...");
  const sql = `INSERT INTO dialogo (id_dialogo, fk_id_personagem, fala)
               VALUES (6, 3, 'Para a fazenda do Coronel Francisco de Texeira. Se adiante cabra!');`;
  con.query(sql, callback_erro);
}


// function consulta_contatos(con) {
//   console.log("Consultando contatos...");
//   const sql = `SELECT * FROM contatos;`;
//   con.query(sql, function(err, results, fields) {
//     if (err) {
//       console.error('Erro: ' + err.stack);
//       return;
//     }

//     console.log("Consulta realizada com sucesso:");
//     if (results) {
//       results.forEach(imprime_contato);
//     }
//   });
// }

function close(con) {
  console.log("Fechando conexão...");
  con.end(callback_erro);
}



console.log("==== INÍCIO ====");

open_connection_and_create_db(function(conexao) {
   create_table_habilidades(conexao);
  create_table_cenas(conexao);
  create_table_mapa_fases(conexao);
  create_table_itens(conexao)
  create_table_personagem(conexao)
  create_table_dialogo(conexao);
  create_table_dialogo_mapa_fases(conexao);
  inserir_itens1(conexao)
  inserir_personagem1(conexao)
  inserir_hab1(conexao)
  inserir_hab2(conexao)
  inserir_personagem2(conexao)
  inserir_personagem3(conexao)
  inserir_dialogo1(conexao)
  inserir_dialogo2(conexao)
  inserir_dialogo3(conexao)
  inserir_dialogo4(conexao)
  inserir_dialogo5(conexao)
  inserir_dialogo6(conexao)
  close(conexao);
});

console.log("==== FIM ====");
