const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const usuarioRoutes = require("./routes/usuarioRoutes");
const autoavaliacaoRoutes = require("./routes/autoavaliacaoRoutes");
const diarioHumorRoutes = require("./routes/diarioHumorRoutes");
const sessaoTerapiaRoutes = require("./routes/sessaoTerapiaRoutes");
const ComunidadeApoio = require("./routes/comunidadeaApoioRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/usuarios", usuarioRoutes);
app.use("/api/autoavaliacoes", autoavaliacaoRoutes);
app.use("/api/diario-humor", diarioHumorRoutes);
app.use("/api/sessao-terapia", sessaoTerapiaRoutes);
app.use("/api/comunidade-apoio", ComunidadeApoio);

const MONGO_URI = process.env.MONGO_URI;
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Conectado ao MongoDB"))
  .catch((error) =>
    console.log(`Erro na conexão com MongoDB: ${error.message}`)
  );

app.get("/", (req, res) => {
  res.send("API está rodando...");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
