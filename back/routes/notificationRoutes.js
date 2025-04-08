const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const authMiddleware = require('../middleware/authMiddleware');

// Récupérer toutes les notifications pour l'utilisateur connecté
router.get('/', authMiddleware, notificationController.getUserNotifications);

// Marquer une notification comme lue
router.patch('/:id', authMiddleware, notificationController.markAsRead);

module.exports = router;
