const db = require("./database");

// Criar tabela de usuários se não existir
const createUsersTable = `
CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    senha TEXT NOT NULL,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
);
`;

db.run(createUsersTable, (err) => {
  if (err) {
    console.error("Erro ao criar tabela de usuários:", err.message);
  } else {
    console.log("Tabela 'usuarios' verificada/criada com sucesso!");
  }
});

db.close();