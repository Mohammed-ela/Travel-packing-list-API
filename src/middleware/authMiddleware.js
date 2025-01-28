const jwt = require("jsonwebtoken");
// check le jeton jwt
const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Accès non autorisé" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch {
        res.status(401).json({ error: "Token invalide" });
    }
};

module.exports = authMiddleware;
