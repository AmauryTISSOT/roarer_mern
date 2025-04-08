const express = require("express");
const router = express.Router();
const tweetController = require("../controllers/tweetController");
const authMiddleware = require("../middleware/authMiddleware");

// Routes publiques (pas besoin d'authentification)
router.get("/", tweetController.getFeed); // Récupérer tous les tweets
router.get("/search", tweetController.searchTweets); // Rechercher des tweets
router.get("/:id", tweetController.getTweet); // Récupérer un tweet spécifique

// Routes protégées (nécessitent une authentification)
router.use(authMiddleware); // Middleware d'authentification

// Routes de base pour les tweets
router.post("/",authMiddleware, tweetController.createTweet); // Créer un tweet
router.delete("/:id", tweetController.deleteTweet); // Supprimer un tweet

// Routes pour les interactions
router.put("/:id/like", tweetController.likeTweet);
router.delete("/:id/like", tweetController.unlikeTweet);
router.post("/:id/retweet", tweetController.retweet);
router.post("/:id/comment", tweetController.comment);
router.post("/:id/bookmark", tweetController.bookmark);

module.exports = router;
