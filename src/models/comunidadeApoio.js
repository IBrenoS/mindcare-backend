const mongoose  = require("mongoose");

const ComunidadeApoioSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true
  },
  dataPostagem: {
    type: Date,
    default: Date.now,
  },
  conteudo: {
    type: String,
    required: true,
  },
  comentarios: [{
    usuario: {
      type: mongoose.Schema.Types.ObjectId, ref: 'Usuario',
    },
    dataComentario: {
      type: Date,
      default: Date.now,
    },
    conteudo: {
      type: String,
    },
  }]
});

const ComunidadeApoio = mongoose.model("ComunidadeApoio", ComunidadeApoioSchema);

module.exports = ComunidadeApoio;
