const admin = require('firebase-admin');

// Initialize Firebase Admin SDK if needed (assumes it’s already configured)
const pushNotificationService = {
  /**
   * Send a push notification to the user's device using FCM or another push service.
   * @param {String} deviceToken - The receiver's device token.
   * @param {Object} payload - The notification payload.
   */
  async send(deviceToken, payload) {
    try {
      // Validate device token
      if (!deviceToken) {
        throw new Error('Device token is missing or invalid');
      }

      // Validate payload
      if (!payload || (!payload.title && !payload.body && !payload.data)) {
        throw new Error('Notification payload is missing or invalid');
      }

      // Example: Sending notification using Firebase Cloud Messaging (FCM)
      const message = {
        notification: {
          title: payload.title || '',
          body: payload.body || '',
          sound: payload.sound || 'default',
        },
        data: payload.data || {}, // Additional data for the app (e.g., message metadata)
      };

      await admin.messaging().sendToDevice(deviceToken, message);

      console.log('Push notification sent successfully');
    } catch (error) {
      console.error('Error sending push notification:', {
        error: error.message,
        deviceToken,
        payload,
      });
      throw new Error('Failed to send push notification');
    }
  },
};

module.exports = pushNotificationService;
