const express = require("express");
const DiarioHumor = require("../models/diarioHumor");
const proteger = require("../middlewares/authMiddleware");
const router = express.Router();

// Criar uma nova entrada no diário de humor
router.post("/", proteger(), async (req, res) => {
  const { humor, anotacoes } = req.body;

  try {
    const novaEntrada = new DiarioHumor({
      usuario: req.usuario._id,
      humor,
      anotacoes,
    });
    await novaEntrada.save();
    res.status(201).json(novaEntrada);
  } catch (error) {
    res.status(400).json({ mensagem: error.message });
  }
});

// Obter todas as entradas do diário de humor do usuário
router.get("/", proteger(["admin"]), async (req, res) => {
  try {
    const entradas = await DiarioHumor.find({ usuario: req.usuario._id });
    res.json(entradas);
  } catch (error) {
    res.status(500).json({ mensagem: error.message });
  }
});

// Obter uma entrada específica do diário de humor
router.get("/perfil", proteger(), async (req, res) => {
  try {
    const entrada = await DiarioHumor.findById(req.params.id);
    if (!entrada || entrada.usuario.toString() !== req.usuario._id.toString()) {
      return res.status(404).json({ mensagem: "Entrada não encontrada" });
    }
    res.json(entrada);
  } catch (error) {
    res.status(500).json({ mensagem: error.message });
  }
});

// Atualizar uma entrada no diário de humor
router.put("/perfil", proteger(), async (req, res) => {
  const { humor, anotacoes } = req.body;

  try {
    const entradaAtualizada = await DiarioHumor.findByIdAndUpdate(
      req.params.id,
      { humor, anotacoes },
      { new: true }
    );
    res.json(entradaAtualizada);
  } catch (error) {
    res.status(400).json({ mensagem: error.message });
  }
});

// Deletar uma entrada no diário de humor
router.delete("/perfil", proteger(), async (req, res) => {
  try {
    const entrada = await DiarioHumor.findById(req.params.id);
    if (!entrada || entrada.usuario.toString() !== req.usuario._id.toString()) {
      return res.status(404).json({ mensagem: "Entrada não encontrada" });
    }
    await entrada.remove();
    res.json({ mensagem: "Entrada deletada com sucesso" });
  } catch (error) {
    res.status(500).json({ mensagem: error.message });
  }
});

module.exports = router;
