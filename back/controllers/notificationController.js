const socket = require('../socket');
const Notification = require('../models/Notification');

// Fonction pour créer une notification
exports.createNotification = async (data) => {
  try {
    const notification = new Notification(data);
    await notification.save();
    
    const io = socket.getIO();
    
    io.to(notification.user.toString()).emit('newNotification', notification);
    
    return notification;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

// Récupérer les notifications de l'utilisateur connecté
exports.getUserNotifications = async (req, res) => {
  try {
    // L'authMiddleware doit attacher l'utilisateur à req.user
    const userId = req.user._id;
    const notifications = await Notification.find({ user: userId }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Marquer une notification comme lue
exports.markAsRead = async (req, res) => {
  try {
    const notificationId = req.params.id;
    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true }
    );
    res.json(notification);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
