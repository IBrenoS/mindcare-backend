const express = require("express");
const ComunidadeApoio = require("../models/ComunidadeApoio");
const { proteger, autorizar } = require("../middlewares/authMiddleware");
const router = express.Router();

// Criar uma nova postagem na comunidade de apoio
router.post("/", proteger, async (req, res) => {
  const { conteudo } = req.body;

  try {
    const novaPostagem = new ComunidadeApoio({
      usuario: req.usuario._id,
      conteudo,
    });
    await novaPostagem.save();
    res.status(201).json(novaPostagem);
  } catch (error) {
    res.status(400).json({ mensagem: error.message });
  }
});

// Obter todas as postagens da comunidade de apoio
router.get("/", proteger, autorizar(["admin"]), async (req, res) => {
  try {
    const postagens = await ComunidadeApoio.find().populate("usuario", "nome");
    res.json(postagens);
  } catch (error) {
    res.status(500).json({ mensagem: error.message });
  }
});

// Obter uma postagem específica da comunidade de apoio
router.get("/perfil", proteger, async (req, res) => {
  try {
    const postagem = await ComunidadeApoio.findById(req.params.id).populate(
      "usuario",
      "nome"
    );
    if (!postagem) {
      return res.status(404).json({ mensagem: "Postagem não encontrada" });
    }
    res.json(postagem);
  } catch (error) {
    res.status(500).json({ mensagem: error.message });
  }
});

// Atualizar uma postagem da comunidade de apoio
router.put("/perfil", proteger, async (req, res) => {
  const { conteudo } = req.body;

  try {
    const postagemAtualizada = await ComunidadeApoio.findByIdAndUpdate(
      req.params.id,
      { conteudo },
      { new: true }
    );
    res.json(postagemAtualizada);
  } catch (error) {
    res.status(400).json({ mensagem: error.message });
  }
});

// Deletar uma postagem da comunidade de apoio
router.delete("/perfil", proteger, async (req, res) => {
  try {
    const postagem = await ComunidadeApoio.findById(req.params.id);
    if (!postagem) {
      return res.status(404).json({ mensagem: "Postagem não encontrada" });
    }
    await postagem.remove();
    res.json({ mensagem: "Postagem deletada com sucesso" });
  } catch (error) {
    res.status(500).json({ mensagem: error.message });
  }
});

module.exports = router;
