const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");
const authMiddleware = require("../middleware/authMiddleware"); 

// Routes publiques
router.get("/:tweetId", commentController.getComments); 
router.get("/:commentId/replies", commentController.getReplies);

// Routes protégées
router.use(authMiddleware); 

// Gestion des commentaires
router.post("/:tweetId", commentController.createComment); 
router.post("/:commentId/reply", commentController.replyToComment);
router.delete("/:commentId", commentController.deleteComment);

// Interactions avec les commentaires
router.put("/:commentId/like", commentController.likeComment);
router.delete("/:commentId/like", commentController.unlikeComment);

module.exports = router;
