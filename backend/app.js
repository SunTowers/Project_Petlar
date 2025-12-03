const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const express = require("express");

const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./database/database"); // <-- IMPORTANTE: conecta ao SQLite

const app = express();

const path = require("path");

app.use(express.static(path.join(__dirname, "..")));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());

// -----------------------------
// ROTAS USANDO O BANCO REAL
// -----------------------------

// Criar usuário
app.post("/usuarios", (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ erro: "Nome, email e senha são obrigatórios" });
  }

  // criptografar senha
  const senhaCriptografada = bcrypt.hashSync(senha, 10);

  db.run(
    `INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)`,
    [nome, email, senhaCriptografada],
    function (erro) {
      if (erro) {
        return res.status(500).json({ erro: "Erro ao inserir usuário" });
      }

      return res.json({
        mensagem: "Usuário criado com sucesso!",
        usuario: { id: this.lastID, nome, email }
      });
    }
  );
});
app.post("/login", (req, res) => {
  const { email, senha } = req.body;

  db.get(`SELECT * FROM usuarios WHERE email = ?`, [email], (erro, usuario) => {
    if (erro) return res.status(500).json({ erro: "Erro no servidor" });
    if (!usuario) return res.status(400).json({ erro: "Usuário não encontrado" });

    // comparar senha
    const senhaCorreta = bcrypt.compareSync(senha, usuario.senha);

    if (!senhaCorreta) {
      return res.status(400).json({ erro: "Senha incorreta" });
    }

    // gerar token
    const token = jwt.sign(
      { id: usuario.id, email: usuario.email },
      "MEU_SEGREDO_SUPER_SEGURO",
      { expiresIn: "2h" }
    );

    return res.json({
      mensagem: "Login efetuado com sucesso!",
      token
    });
  });
});

// Listar usuários
app.get("/usuarios", (req, res) => {
  const query = "SELECT id, nome, email, criado_em FROM usuarios";

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error("Erro ao buscar usuários:", err.message);
      return res.status(500).json({ erro: "Erro ao buscar usuários" });
    }

    return res.json(rows);
  });
});

// Rota simples de teste
app.get("/", (req, res) => {
  res.send("API funcionando com SQLite!");
});

// Iniciar servidor
app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});