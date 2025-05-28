const db = require("./banco");
const prompt = require("prompt-sync")();

function salvarRegistro(tabela, dados, campoUnico) {
  const colunas = Object.keys(dados);
  const valores = Object.values(dados);

  if (!colunas.includes(campoUnico)) {
    console.log(
      `Erro: o campo único "${campoUnico}" não está presente nos dados fornecidos.`
    );
    return;
  }

  const verificacaoSQL = `SELECT * FROM ${tabela} WHERE ${campoUnico} = ?`;

  db.all(verificacaoSQL, [dados[campoUnico]], (err, rows) => {
    if (err) {
      console.log(`Erro ao consultar a tabela ${tabela}:`, err.message);
      return;
    }

    if (rows.length > 0) {
      console.log(
        `Registro já existe na tabela ${tabela} com ${campoUnico} = "${dados[campoUnico]}"`
      );
      return;
    }

    const placeholders = colunas.map(() => "?").join(", ");
    const insertSQL = `INSERT INTO ${tabela} (${colunas.join(
      ", "
    )}) VALUES (${placeholders})`;

    db.run(insertSQL, valores, function (err) {
      if (err) {
        console.log(`Erro ao inserir na tabela ${tabela}:`, err.message);
      } else {
        console.log(
          `Registro inserido com sucesso na tabela ${tabela}. ID: ${this.lastID}`
        );
      }
    });
  });
}

class Musicas {
  constructor(id = null, nome, genero) {
    this.id = id;
    this.nome = nome;
    this.genero = genero;
  }

  salvar() {
    salvarRegistro(
      "musicas",
      {
        nome: this.nome,
        genero: this.genero,
      },
      "nome"
    );
  }
}

class Artistas {
  constructor(id = null, nome) {
    this.id = id;
    this.nome = nome;
  }

  salvar() {
    salvarRegistro(
      "artistas",
      {
        nome: this.nome,
      },
      "nome"
    );
  }
}

class Programa {
  constructor(id = null, nome) {
    this.id = id;
    this.nome = nome;
  }

  salvar() {
    salvarRegistro(
      "programa",
      {
        nome: this.nome,
      },
      "nome"
    );
  }
}

class Ouvinte {
  constructor(celular, nome, bairro) {
    this.celular = celular;
    this.nome = nome;
    this.bairro = bairro;
  }

  salvar() {
    salvarRegistro(
      "ouvinte",
      {
        celular: this.celular,
        nome: this.nome,
        bairro: this.bairro,
      },
      "celular"
    );
  }
}

class Pedido {
  constructor(horario, id_musica, id_programa, id_ouvinte) {
    this.horario = horario;
    this.id_musica = id_musica;
    this.id_programa = id_programa;
    this.id_ouvinte = id_ouvinte;
  }

  salvar() {
    salvarRegistro(
      "pedido",
      {
        horario: this.horario,
        id_musica: this.id_musica,
        id_programa: this.id_programa,
        celular: this.id_ouvinte,
      },
      "id_musica"
    );
  }
}

const artistas = [
  new Artistas(null, "Taylor Swift"),
  new Artistas(null, "Drake"),
  new Artistas(null, "Adele"),
  new Artistas(null, "Beyoncé"),
  new Artistas(null, "Ed Sheeran"),
];
artistas.forEach((a) => a.salvar());

const musicas = [
  new Musicas(null, "Blank Space", "Pop"),
  new Musicas(null, "Hotline Bling", "Hip-Hop"),
  new Musicas(null, "Hello", "Soul"),
  new Musicas(null, "Halo", "R&B"),
  new Musicas(null, "Perfect", "Pop"),
];
musicas.forEach((m) => m.salvar());

const programas = [
  new Programa(null, "Manhã Musical"),
  new Programa(null, "Tarde Hits"),
  new Programa(null, "Noite Romântica"),
  new Programa(null, "Top 10 da Semana"),
  new Programa(null, "Clássicos do Pop"),
];
programas.forEach((p) => p.salvar());

const ouvintes = [
  new Ouvinte(999111222, "Lucas", "Centro"),
  new Ouvinte(999333444, "Maria", "Jatiúca"),
  new Ouvinte(999555666, "João", "Farol"),
  new Ouvinte(999777888, "Ana", "Ponta Verde"),
  new Ouvinte(999999000, "Carlos", "Trapiche"),
];
ouvintes.forEach((o) => o.salvar());

const pedidos = [
  new Pedido("08:00", 1, 1, 999111222),
  new Pedido("09:00", 2, 2, 999333444),
  new Pedido("10:00", 3, 3, 999555666),
  new Pedido("11:00", 4, 4, 999777888),
  new Pedido("12:00", 5, 5, 999999000),
];
pedidos.forEach((p) => p.salvar());

function salvarRelacionamentoArtistaMusica(id_artista, id_musica) {
  const sql = `INSERT OR IGNORE INTO artista_musica (id_artista, id_musica) VALUES (?, ?)`;
  db.run(sql, [id_artista, id_musica]);
}

for (let i = 0; i < artistas.length; i++) {
  salvarRelacionamentoArtistaMusica(i + 1, i + 1);
}

//Perdão professor não sei usar async e await (ainda) 😢😢
setTimeout(() => {
  console.log("\nTop 10 músicas mais pedidas:");
  db.all(
    `
    SELECT m.nome AS musica, COUNT(p.id_musica) AS total_pedidos
    FROM pedido p
    JOIN musicas m ON m.id_musica = p.id_musica
    GROUP BY p.id_musica
    ORDER BY total_pedidos DESC
    LIMIT 5;
  `,
    [],
    (err, rows) => {
      if (err) throw err;
      rows.forEach((row) => {
        console.log(`${row.musica}: ${row.total_pedidos} pedido(s)`);
      });
    }
  );

  console.log("\nTop 3 artistas mais pedidos:");
  db.all(
    `
    SELECT a.nome AS artista, COUNT(p.id_musica) AS total_pedidos
    FROM pedido p
    JOIN musicas m ON m.id_musica = p.id_musica
    JOIN artista_musica am ON am.id_musica = m.id_musica
    JOIN artistas a ON a.id_artista = am.id_artista
    GROUP BY a.id_artista
    ORDER BY total_pedidos DESC
    LIMIT 3;
  `,
    [],
    (err, rows) => {
      if (err) throw err;
      rows.forEach((row) => {
        console.log(`${row.artista}: ${row.total_pedidos} pedido(s)`);
      });
    }
  );
}, 2000);
