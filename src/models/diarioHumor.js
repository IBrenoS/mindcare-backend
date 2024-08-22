const mongoose = require("mongoose");

const DiarioHumorSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true
  },
  dataEntrada: {
    type: Date,
    default: Date.now,
  },
  humor: {
    type: String,
    required: true,
  },
  anotacoes: {
    type: String,
  },
});

const DiarioHumor = mongoose.model("DiarioHumor", DiarioHumorSchema);

module.exports = DiarioHumor;
