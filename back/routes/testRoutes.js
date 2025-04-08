const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const auth = require("../middleware/authMiddleware");
const Tweet = require("../models/Tweet");

// Route pour obtenir un token de test
router.get("/get-test-token", (req, res) => {
  // Créer un utilisateur de test
  const testUser = {
    _id: "507f1f77bcf86cd799439011", // ID MongoDB factice
    username: "testuser",
    role: "user",
  };

  // Générer le token
  const token = jwt.sign(
    { userId: testUser._id, username: testUser.username },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  // Renvoyer le token avec des exemples d'utilisation
  res.json({
    message: "Token de test généré avec succès",
    token,
    exemples: {
      createTweet: {
        method: "POST",
        url: "/api/tweets",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: {
          content: "Mon premier tweet !",
          media: [],
        },
      },
      getAllTweets: {
        method: "GET",
        url: "/api/tweets",
      },
      likeTweet: {
        method: "PUT",
        url: "/api/tweets/:tweetId/like",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    },
  });
});

// Route de test pour créer un tweet (avec auth réelle)
router.post("/create-tweet", auth, async (req, res) => {
  try {
    const tweet = new Tweet({
      content: req.body.content || "Tweet de test",
      author: req.user._id,
      media: req.body.media || [],
    });

    await tweet.save();
    res.status(201).json({
      message: "Tweet créé avec succès",
      tweet,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la création du tweet",
      error: error.message,
    });
  }
});

// Route de test pour liker un tweet (avec auth réelle)
router.post("/like-tweet/:tweetId", auth, async (req, res) => {
  try {
    const tweet = await Tweet.findById(req.params.tweetId);
    if (!tweet) {
      return res.status(404).json({ message: "Tweet non trouvé" });
    }

    await tweet.like(req.user._id);
    res.json({
      message: "Tweet liké avec succès",
      tweet,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors du like",
      error: error.message,
    });
  }
});

// Route de test pour récupérer tous les tweets (publique)
router.get("/tweets", async (req, res) => {
  try {
    const tweets = await Tweet.find().sort({ createdAt: -1 }).limit(10);

    res.json({
      message: "Tweets récupérés avec succès",
      count: tweets.length,
      tweets,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération des tweets",
      error: error.message,
    });
  }
});

module.exports = router;
