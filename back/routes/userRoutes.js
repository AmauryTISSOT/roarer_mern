const express = require("express");
const { 
  getUsers, 
  registerUser, 
  loginUser, 
  updateProfilePicture, 
  getUserProfile,
  followUser
} = require("../controllers/userController");
const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const router = express.Router();

console.log("📌 Routes enregistrées : /, /register, /login");

router.get("/", protect, getUsers);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.patch("/follow/:id", protect, followUser);
router.put("/profile-picture", protect, upload.single("profilePicture"), updateProfilePicture);
router.get("/profile", protect, getUserProfile);

module.exports = router;
