const express = require("express");
const router = express.Router();

// Importer les routes
const userRoutes = require("./userRoutes")
const tweetRoutes = require("./tweetRoutes");
const commentRoutes = require("./commentRoutes");
const bookmarkRoutes = require("./bookmarkRoutes");
const testRoutes = require("./testRoutes");
const authRoutes = require("./authRoutes");
const retweetRoutes = require("./retweetRoutes");
const reactionRoutes = require("./reactionRoutes");
const notificationRoutes = require('./notificationRoutes');

// Routes de test
// router.use("/test", testRoutes);

// Routes d'authentification
router.use("/api/auth", authRoutes);

// Routes principales
router.use("/api/users", userRoutes);
router.use("/api/tweets", tweetRoutes);
router.use("/api/comments", commentRoutes);
router.use("/api/bookmarks", bookmarkRoutes);
router.use("/api/retweets", retweetRoutes);
router.use("/api/reactions", reactionRoutes);
router.use("/api/notifications", notificationRoutes);
module.exports = router;

