const express = require("express");
const Usuario = require("../models/usuario");
const router = express.Router();
const jwt = require("jsonwebtoken");
const proteger = require("../middlewares/authMiddleware");

// Criar um novo usuário
router.post("/", async (req, res) => {
  const { nome, email, senha, role } = req.body;

  try {
    const novoUsuario = new Usuario({ nome, email, senha, role });
    await novoUsuario.save();
    res.status(201).json(novoUsuario);
  } catch (error) {
    res.status(400).json({ mensagem: error.message });
  }
});

// Login do usuário
router.post("/login", async (req, res) => {
  const { email, senha } = req.body;

  try {
    const usuario = await Usuario.findOne({ email });

    if (usuario && (await usuario.compararSenha(senha))) {
      res.json({
        _id: usuario._id,
        nome: usuario.nome,
        email: usuario.email,
        token: gerarToken(usuario._id),
      });
    } else {
      res.status(401).json({ mensagem: "Credenciais inválidas" });
    }
  } catch (error) {
    res.status(500).json({ mensagem: error.message });
  }
});

// Obter o perfil do usuário autenticado
router.get("/perfil", proteger(), async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario.id); // Assume que o ID do usuário está no token
    if (!usuario)
      return res.status(404).json({ mensagem: "Usuário não encontrado" });
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ mensagem: error.message });
  }
});

// Atualizar o perfil do usuário autenticado
router.put("/perfil", proteger(), async (req, res) => {
  const { nome, email, senha } = req.body;

  try {
    const usuarioAtualizado = await Usuario.findByIdAndUpdate(
      req.usuario.id, // Assume que o ID do usuário está no token
      { nome, email, senha },
      { new: true }
    );
    res.json(usuarioAtualizado);
  } catch (error) {
    res.status(400).json({ mensagem: error.message });
  }
});

// Deletar o perfil do usuário autenticado
router.delete("/perfil", proteger(), async (req, res) => {
  try {
    await Usuario.findByIdAndDelete(req.usuario.id); // Assume que o ID do usuário está no token
    res.json({ mensagem: "Usuário deletado com sucesso" });
  } catch (error) {
    res.status(500).json({ mensagem: error.message });
  }
});

router.get("/", proteger(["admin"]), async (req, res) => {
  try {
    const usuarios = await Usuario.find(); // Busca todos os usuários
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ mensagem: error.message });
  }
});

// Função para gerar token JWT
const gerarToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

module.exports = router;
