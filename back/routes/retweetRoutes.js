const express = require("express");
const router = express.Router();
const retweetController = require("../controllers/retweetController");
const authMiddleware = require("../middleware/authMiddleware"); 

// Toutes les routes de retweets nécessitent une authentification
router.use(authMiddleware);

// Routes principales pour les retweets
router.post("/tweet/:tweetId", retweetController.createRetweet);
router.delete("/tweet/:tweetId", retweetController.deleteRetweet);
router.get("/tweet/:tweetId", retweetController.getTweetRetweets);
router.get("/user", retweetController.getUserRetweets);

// Routes pour les interactions (likes)
router.put("/:retweetId/like", retweetController.likeRetweet);
router.delete("/:retweetId/like", retweetController.unlikeRetweet);

module.exports = router;
