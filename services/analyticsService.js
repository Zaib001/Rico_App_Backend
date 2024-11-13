// services/analyticsService.js
const Analytics = require('../models/Analytics');

/**
 * Log user message activities to the analytics collection.
 * @param {String} userId - ID of the user sending the message.
 * @param {String} receiverId - ID of the user receiving the message.
 */
exports.logMessageActivity = async (userId, receiverId) => {
  try {
    await Analytics.create({ userId, receiverId, activityType: 'message_sent' });
  } catch (err) {
    console.error('Error logging message activity:', err);
  }
};

/**
 * Log match creation activities to the analytics collection.
 * @param {String} userId - ID of the user creating the match.
 * @param {Object} filtersUsed - Filters used in the match creation.
 */
exports.logMatchCreation = async (userId, filtersUsed) => {
  try {
    await Analytics.create({ userId, filtersUsed, activityType: 'match_created' });
  } catch (err) {
    console.error('Error logging match creation:', err);
  }
};

/**
 * Log profile update activities to the analytics collection.
 * @param {String} userId - ID of the user updating the profile.
 * @param {Object} updates - The updates made to the profile.
 */
exports.logProfileUpdate = async (userId, updates) => {
  try {
    await Analytics.create({ userId, filtersUsed: updates, activityType: 'profile_updated' });
  } catch (err) {
    console.error('Error logging profile update:', err);
  }
};
