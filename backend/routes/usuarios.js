const express = require("express");
const router = express.Router();
const controller = require("../controllers/usuarioController");

// Cadastro
router.post("/", controller.cadastrar);

// Login
router.post("/login", controller.login);

module.exports = router;