const mongoose = require("mongoose");

const SessaoTerapiaSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true
  },
  nomeTerapeuta: {
    type: String,
    required: true,
  },
  dataSessao: {
    type: Date,
    required: true,
  },
  anotacoesSessao: {
    type: String,
  },
  feedback: {
    type: String,
  },
});

const SessaoTerapia = mongoose.model("SessaoTerapia", SessaoTerapiaSchema);

module.exports = SessaoTerapia;
