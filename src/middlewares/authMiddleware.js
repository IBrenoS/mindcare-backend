const jwt = require("jsonwebtoken");
const Usuario = require("../models/usuario");

const proteger = (roles = []) => {
  return async (req, res, next) => {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      try {
        token = req.headers.authorization.split(" ")[1];
        const decodificado = jwt.verify(token, process.env.JWT_SECRET);

        req.usuario = await Usuario.findById(decodificado.id).select("-senha");

        // Verifica se a role do usuário está na lista de roles permitidas
        if (roles.length && !roles.includes(req.usuario.role)) {
          return res.status(403).json({ mensagem: "Acesso negado" });
        }

        next();
      } catch (error) {
        return res
          .status(401)
          .json({ mensagem: "Não autorizado, token inválido" });
      }
    }

    if (!token) {
      return res.status(401).json({ mensagem: "Não autorizado, sem token" });
    }
  };
};

module.exports = proteger;
