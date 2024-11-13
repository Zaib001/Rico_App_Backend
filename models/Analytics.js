// models/Analytics.js
const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  receiverId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: false 
  },
  activityType: { 
    type: String, 
    enum: ['message_sent', 'match_created', 'profile_updated'], 
    required: true 
  },
  filtersUsed: {
    type: mongoose.Schema.Types.Mixed, 
    required: false 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

const Analytics = mongoose.model('Analytics', analyticsSchema);
module.exports = Analytics;
