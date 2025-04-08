const express = require("express");
const router = express.Router();
const bookmarkController = require("../controllers/bookmarkController");
const authMiddleware = require("../middleware/authMiddleware"); 

// Toutes les routes de signets nécessitent une authentification
router.use(authMiddleware);

// Gestion des signets
router.get("/", bookmarkController.getBookmarks);
router.post("/:tweetId", bookmarkController.addBookmark); 
router.delete("/:tweetId", bookmarkController.removeBookmark);
router.put("/:tweetId", bookmarkController.updateBookmark);

// Gestion des collections
router.get("/collections", bookmarkController.getCollections);
router.post("/:tweetId/collections", bookmarkController.addToCollection); 
router.delete(
  "/:tweetId/collections/:collection",
  bookmarkController.removeFromCollection
);

module.exports = router;
