const pushNotificationService = require('./pushNotificationService');
const logger = require('../utils/logger');

const notificationService = {
  async sendMessageNotification(receiver, sender, message) {
    try {
      if (!receiver.deviceToken) {
        throw new Error(`Receiver ${receiver._id} does not have a valid device token`);
      }

      const notificationPayload = createNotificationPayload(receiver, sender, message);

      await pushNotificationService.send(receiver.deviceToken, notificationPayload);
      logger.info(`Notification sent to ${receiver._id} by ${sender._id}`);
    } catch (error) {
      logger.error('Error sending message notification:', {
        receiverId: receiver._id,
        senderId: sender._id,
        messageId: message._id,
        error: error.message,
      });

      // Retry with limited attempts
      await retryNotification(receiver, sender, message, 1);
    }
  },
};

/**
 * Retry sending the notification with exponential backoff.
 */
async function retryNotification(receiver, sender, message, attempt) {
  const maxRetries = 3;
  const retryDelay = 1000 * Math.pow(2, attempt); // Exponential backoff: 1s, 2s, 4s, etc.

  if (attempt > maxRetries) {
    logger.error(`Failed to send notification after ${maxRetries} attempts`, {
      receiverId: receiver._id,
      senderId: sender._id,
      messageId: message._id,
    });
    // Consider queuing or alerting for manual intervention here
    return;
  }

  try {
    logger.info(`Retrying notification (attempt ${attempt}) for receiver ${receiver._id}`);
    
    const notificationPayload = createNotificationPayload(receiver, sender, message);

    await pushNotificationService.send(receiver.deviceToken, notificationPayload);
    logger.info(`Retry successful: Notification sent to ${receiver._id} on attempt ${attempt}`);
  } catch (retryError) {
    logger.error(`Retry failed (attempt ${attempt}):`, retryError.message);
    
    // Wait before the next retry
    setTimeout(async () => {
      await retryNotification(receiver, sender, message, attempt + 1);
    }, retryDelay);
  }
}

/**
 * Helper function to construct the notification payload.
 */
function createNotificationPayload(receiver, sender, message) {
  return {
    title: `${sender.name} sent you a message`,
    body: message.message || 'You have a new audio message',
    sound: 'default',
    data: {
      messageId: message._id,
      senderId: sender._id,
      messageType: message.messageType || 'text',
    },
  };
}

module.exports = notificationService;
