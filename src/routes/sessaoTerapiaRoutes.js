const express = require("express");
const SessaoTerapia = require("../models/sessaoTerapia");
const proteger = require("../middlewares/authMiddleware");
const router = express.Router();

// Criar uma nova sessão de terapia
router.post("/", proteger(), async (req, res) => {
  const { nomeTerapeuta, dataSessao, anotacoesSessao, feedback } = req.body;

  try {
    const novaSessao = new SessaoTerapia({
      usuario: req.usuario._id,
      nomeTerapeuta,
      dataSessao,
      anotacoesSessao,
      feedback,
    });
    await novaSessao.save();
    res.status(201).json(novaSessao);
  } catch (error) {
    res.status(400).json({ mensagem: error.message });
  }
});

// Obter todas as sessões de terapia do usuário
router.get("/", proteger(["admin"]), async (req, res) => {
  try {
    const sessoes = await SessaoTerapia.find({ usuario: req.usuario._id });
    res.json(sessoes);
  } catch (error) {
    res.status(500).json({ mensagem: error.message });
  }
});

// Obter uma sessão de terapia específica
router.get("/perfil", proteger(), async (req, res) => {
  try {
    const sessao = await SessaoTerapia.findById(req.params.id);
    if (!sessao || sessao.usuario.toString() !== req.usuario._id.toString()) {
      return res.status(404).json({ mensagem: "Sessão não encontrada" });
    }
    res.json(sessao);
  } catch (error) {
    res.status(500).json({ mensagem: error.message });
  }
});

// Atualizar uma sessão de terapia
router.put("/perfil", proteger(), async (req, res) => {
  const { nomeTerapeuta, dataSessao, anotacoesSessao, feedback } = req.body;

  try {
    const sessaoAtualizada = await SessaoTerapia.findByIdAndUpdate(
      req.params.id,
      { nomeTerapeuta, dataSessao, anotacoesSessao, feedback },
      { new: true }
    );
    res.json(sessaoAtualizada);
  } catch (error) {
    res.status(400).json({ mensagem: error.message });
  }
});

// Deletar uma sessão de terapia
router.delete("/perfil", proteger(), async (req, res) => {
  try {
    const sessao = await SessaoTerapia.findById(req.params.id);
    if (!sessao || sessao.usuario.toString() !== req.usuario._id.toString()) {
      return res.status(404).json({ mensagem: "Sessão não encontrada" });
    }
    await sessao.remove();
    res.json({ mensagem: "Sessão deletada com sucesso" });
  } catch (error) {
    res.status(500).json({ mensagem: error.message });
  }
});

module.exports = router;
