const mongoose = require("mongoose");

const AutoavaliacaoSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true
  },
  data: {
    type: Date,
    default: Date.now,
  },
  resultados: {
    type: Map,
    of: Number,
    required: true,
  },
  feedback: {
    type: String,
  }
});

const Autoavaliacao = mongoose.model("Autoavaliacao", AutoavaliacaoSchema);

module.exports = Autoavaliacao;
