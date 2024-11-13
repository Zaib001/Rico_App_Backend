const User = require('../models/User');

/**
 * Calculate an engagement score for a user based on their recent activity, profile completeness, interactions, and other metrics.
 * @param {Object} user - User object
 * @returns {Number} - Engagement score (0-10)
 */
exports.calculateEngagementScore = (user) => {
  let score = 0;

  // Constants for weights
  const RECENT_ACTIVITY_POINTS = 5;            // For being active within the last week
  const INTERACTION_POINTS = 5;                // Based on the number of interactions
  const PROFILE_COMPLETENESS_POINTS = 3;       // For having a complete profile
  const STREAK_POINTS = 3;                     // Reward for login streaks (consecutive daily logins)
  const MESSAGE_POINTS = 3;                    // For the number of messages sent/received
  const MATCH_POINTS = 2;                      // For the number of matches a user has
  const LIKE_POINTS = 2;                       // For the number of likes given/received
  const LOGIN_FREQUENCY_POINTS = 2;            // For frequent logins over the past month
  const POSITIVE_FEEDBACK_POINTS = 2;          // For receiving positive ratings or feedback from others

  // 1. Check for recent activity (active within the past week)
  if (user.lastActive && user.lastActive > Date.now() - 7 * 24 * 60 * 60 * 1000) {
    score += RECENT_ACTIVITY_POINTS;
  }

  // 2. Interaction points (e.g., user has interacted with others frequently)
  if (user.interactions && user.interactions.length > 10) {
    score += INTERACTION_POINTS;
  }

  // 3. Profile completeness (if the user has a profile picture, bio, and filters set)
  if (user.profilePicture && user.bio && user.filters) {
    score += PROFILE_COMPLETENESS_POINTS;
  }

  // 4. Daily login streaks (reward users who log in on consecutive days)
  if (user.loginStreak && user.loginStreak >= 5) {
    score += STREAK_POINTS;  // Adjust the value for more or fewer consecutive logins
  }

  // 5. Messages sent/received (reward for engaging in conversations)
  if (user.messages && user.messages.length > 20) {
    score += MESSAGE_POINTS;
  }

  // 6. Match count (reward for getting matches)
  if (user.matches && user.matches.length > 5) {
    score += MATCH_POINTS;
  }

  // 7. Likes received/given (reward users for likes activity)
  if (user.likes && user.likes.length > 10) {
    score += LIKE_POINTS;
  }

  // 8. Login frequency (reward users who log in frequently over the last 30 days)
  if (user.loginCount && user.loginCount > 15) {  // E.g., logged in at least half of the last 30 days
    score += LOGIN_FREQUENCY_POINTS;
  }

  // 9. Positive feedback/ratings (reward users who receive positive ratings from others)
  if (user.positiveFeedback && user.positiveFeedback.length > 5) {
    score += POSITIVE_FEEDBACK_POINTS;
  }

  // Cap the engagement score at 10 points
  return Math.min(score, 10);
};
