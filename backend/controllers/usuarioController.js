const bcrypt = require("bcrypt");
const Usuario = require("../models/Usuario");

module.exports = {
  
  cadastrar: async (req, res) => {
    const { nome, email, senha } = req.body;

    const senhaCriptografada = await bcrypt.hash(senha, 10);

    Usuario.criar(nome, email, senhaCriptografada, (err, id) => {
      if (err) return res.status(400).json({ erro: "Email já cadastrado" });

      res.json({ id, nome, email });
    });
  },

  login: (req, res) => {
    const { email, senha } = req.body;

    Usuario.buscarPorEmail(email, async (err, usuario) => {
      if (!usuario) return res.status(404).json({ erro: "Usuário não encontrado" });

      const senhaValida = await bcrypt.compare(senha, usuario.senha);

      if (!senhaValida) return res.status(401).json({ erro: "Senha incorreta" });

      res.json({
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
      });
    });
  }
};