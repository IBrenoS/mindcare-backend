const express = require("express");
const Autoavaliacao = require("../models/autoavaliacao");
const proteger = require("../middlewares/authMiddleware");
const router = express.Router();

// Criar uma nova autoavaliação
router.post("/", proteger(), async (req, res) => {
  const { resultados, feedback } = req.body;

  try {
    const novaAutoavaliacao = new Autoavaliacao({
      usuario: req.usuario._id,
      resultados,
      feedback,
    });
    await novaAutoavaliacao.save();
    res.status(201).json(novaAutoavaliacao);
  } catch (error) {
    res.status(400).json({ mensagem: error.message });
  }
});

// Obter todas as autoavaliações do usuário
router.get("/", proteger(["admin"]), async (req, res) => {
  try {
    const autoavaliacoes = await Autoavaliacao.find({
      usuario: req.usuario._id,
    });
    res.json(autoavaliacoes);
  } catch (error) {
    res.status(500).json({ mensagem: error.message });
  }
});

// Obter uma autoavaliação específica
router.get("/perfil", proteger(), async (req, res) => {
  try {
    const autoavaliacao = await Autoavaliacao.findById(req.params.id);
    if (
      !autoavaliacao ||
      autoavaliacao.usuario.toString() !== req.usuario._id.toString()
    ) {
      return res.status(404).json({ mensagem: "Autoavaliação não encontrada" });
    }
    res.json(autoavaliacao);
  } catch (error) {
    res.status(500).json({ mensagem: error.message });
  }
});

// Atualizar uma autoavaliação
router.put("/perfil", proteger(), async (req, res) => {
  const { resultados, feedback } = req.body;

  try {
    const autoavaliacaoAtualizada = await Autoavaliacao.findByIdAndUpdate(
      req.params.id,
      { resultados, feedback },
      { new: true }
    );
    res.json(autoavaliacaoAtualizada);
  } catch (error) {
    res.status(400).json({ mensagem: error.message });
  }
});

// Deletar uma autoavaliação
router.delete("/perfil", proteger(), async (req, res) => {
  try {
    const autoavaliacao = await Autoavaliacao.findById(req.params.id);
    if (
      !autoavaliacao ||
      autoavaliacao.usuario.toString() !== req.usuario._id.toString()
    ) {
      return res.status(404).json({ mensagem: "Autoavaliação não encontrada" });
    }
    await autoavaliacao.remove();
    res.json({ mensagem: "Autoavaliação deletada com sucesso" });
  } catch (error) {
    res.status(500).json({ mensagem: error.message });
  }
});

module.exports = router;
