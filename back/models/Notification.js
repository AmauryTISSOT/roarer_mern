const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['tweet', 'retweet', 'comment', 'like'], required: true },
  content: { type: String },
  isRead: { type: Boolean, default: false },
  tweet: { type: mongoose.Schema.Types.ObjectId, ref: 'Tweet' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', NotificationSchema);