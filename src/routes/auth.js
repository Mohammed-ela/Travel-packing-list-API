const express = require("express");
const { registerUser, loginUser, getUser } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Page d'inscription
router.post("/register", registerUser);

// Page de connexion
router.post("/login", loginUser);

// Page user
router.get("/me", authMiddleware, getUser);

module.exports = router;
