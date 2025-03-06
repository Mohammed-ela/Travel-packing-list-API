///Users/elamrani/Desktop/Mobile/clement-backend/Travel-packing-list-API/src/routes/auth.js
const express = require("express");
const { registerUser, loginUser, getUserProfile } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Page d'inscription
router.post("/register", registerUser);

// Page de connexion
router.post("/login", loginUser);

// Page user
router.get("/me", authMiddleware, getUserProfile);

module.exports = router;
