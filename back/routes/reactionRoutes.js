const express = require("express");
const router = express.Router();
const reactionController = require("../controllers/reactionController");
const authMiddleware = require("../middleware/authMiddleware"); 

router.use(authMiddleware); 

router.post("/bulk", reactionController.bulkInsertReactions);
router.get("/", reactionController.getAllReactions);
router.get("/post/:postId", reactionController.getReactionsByPost);

module.exports = router;
