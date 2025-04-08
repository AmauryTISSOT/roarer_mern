const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Route d'inscription
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(400).json({
        message: "L'email ou le nom d'utilisateur est déjà utilisé",
      });
    }

    // Créer un nouvel utilisateur
    const user = new User({
      username,
      email,
      password,
    });

    // Sauvegarder l'utilisateur
    await user.save();

    // Générer le token
    const token = user.generateAuthToken();

    // Retourner la réponse
    res.status(201).json({
      message: "Utilisateur créé avec succès",
      token,
      user: user.getPublicProfile(),
    });
  } catch (error) {
    console.error("Erreur lors de l'inscription:", error);
    res.status(500).json({
      message: "Erreur lors de la création de l'utilisateur",
      error: error.message,
    });
  }
});

// Route de connexion
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Trouver l'utilisateur
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ message: "Email ou mot de passe incorrect" });
    }

    // Vérifier le mot de passe
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "Email ou mot de passe incorrect" });
    }

    // Générer le token
    const token = user.generateAuthToken();

    // Retourner la réponse
    res.json({
      message: "Connexion réussie",
      token,
      user: user.getPublicProfile(),
    });
  } catch (error) {
    console.error("Erreur lors de la connexion:", error);
    res.status(500).json({
      message: "Erreur lors de la connexion",
      error: error.message,
    });
  }
});

module.exports = router;
