const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const notificationController = require('./notificationController');

// 🔹 Récupérer tous les utilisateurs
const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};


//Recuperer User apartir de son Id


// 🔹 Inscription d'un utilisateur
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Vérifier si l'utilisateur existe déjà
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "Email déjà utilisé" });
        }

        // 🔐 Hashage du mot de passe
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Création du nouvel utilisateur
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: "Utilisateur créé avec succès" });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

// 🔹 Connexion d'un utilisateur
const loginUser = async (req, res) => {
    console.log("🔍 loginUser a été appelé !");
    try {
        const { email, password } = req.body;
        console.log("📩 Email reçu :", email);

        // Vérifier si l'utilisateur existe
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Utilisateur non trouvé" });
        }

        // Vérifier le mot de passe
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Mot de passe incorrect" });
        }

        // Générer un token JWT
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.json({ message: "Connexion réussie", token });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

module.exports = { getUsers, registerUser, loginUser };
// 🔹 Mettre à jour la photo de profil
const updateProfilePicture = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Aucune image envoyée" });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        user.profilePicture = `/uploads/${req.file.filename}`;
        await user.save();

        res.json({ message: "Photo de profil mise à jour", profilePicture: user.profilePicture });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

// 🔹 Récupérer le profil de l'utilisateur
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("name email profilePicture");
        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

const followUser = async (req, res) => {
    try {
      // L'ID de l'utilisateur à suivre est dans req.params.id
      const targetUserId = req.params.id;
      // L'utilisateur connecté est disponible via req.user (middleware d'authentification)
      const currentUserId = req.user._id;
  
      // Vérifier que l'utilisateur ne se suit pas lui-même
      if (currentUserId.toString() === targetUserId) {
        return res.status(400).json({ error: "Vous ne pouvez pas vous suivre vous-même." });
      }
  
      // Récupérer les données de l'utilisateur connecté et de l'utilisateur cible
      const currentUser = await User.findById(currentUserId);
      const targetUser = await User.findById(targetUserId);
  
      if (!targetUser) {
        return res.status(404).json({ error: "Utilisateur cible introuvable." });
      }
  
      // Vérifier si l'utilisateur connecté suit déjà l'utilisateur cible
      if (currentUser.following.includes(targetUserId)) {
        return res.status(400).json({ error: "Vous suivez déjà cet utilisateur." });
      }
  
      // Ajouter l'utilisateur cible dans la liste des suivis de l'utilisateur connecté
      currentUser.following.push(targetUserId);
      // Ajouter l'utilisateur connecté dans la liste des followers de l'utilisateur cible
      targetUser.followers.push(currentUserId);
  
      // Sauvegarder les deux utilisateurs
      await currentUser.save();
      await targetUser.save();
  
      await notificationController.createNotification({
        user: targetUserId,
        type: 'follow',
        content: `${currentUser.name} vous suit.`,
      });
  
      res.status(200).json({ message: "Utilisateur suivi avec succès." });
    } catch (error) {
      console.error("Erreur lors du follow :", error);
      res.status(500).json({ error: error.message });
    }
  };

module.exports = { getUsers, registerUser, loginUser, updateProfilePicture, getUserProfile, followUser };
