const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // The user receiving the notification
  type: { type: String, required: true }, // Type of notification (e.g., 'likeAccepted')
  message: { type: String, required: true },
  date: { type: Date, default: Date.now },
  read: { type: Boolean, default: false }, // Whether the notification has been read
});

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;
