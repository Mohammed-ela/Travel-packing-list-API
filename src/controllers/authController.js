const User = require("../models/User");

// Contrôleur pour enregistrer un utilisateur
const registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérifie si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Cet email est déjà utilisé." });
    }

    // Crée un nouvel utilisateur
    const user = new User({ email, password });
    await user.save();

    res.status(201).json({ message: "Utilisateur créé avec succès." });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur.", error });
  }
};

// Contrôleur pour connecter un utilisateur
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Rechercher l'utilisateur par email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Identifiants invalides." });
    }

    // Comparer le mot de passe fourni avec celui dans la base
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Identifiants invalides." });
    }

    // Générer un token JWT si la comparaison est réussie
    const token = require("jsonwebtoken").sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({ token });
  } catch (error) {
    console.error("Erreur lors de la connexion :", error);
    res.status(500).json({ message: "Erreur serveur.", error });
  }
};


// Contrôleur pour récupérer les informations de l'utilisateur connecté
const getUserProfile = async (req, res) => {
  try {
    // Récupère l'utilisateur connecté grâce à l'ID dans le token
    const user = await User.findById(req.user.userId).select("-password"); // Exclut le mot de passe
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur.", error });
  }
};

module.exports = { registerUser, loginUser, getUserProfile };
