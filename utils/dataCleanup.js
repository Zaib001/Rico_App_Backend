const schedule = require('node-schedule');
const Match = require('../models/Match');
const Message = require('../models/Message');

schedule.scheduleJob('0 0 * * *', async () => {
  const now = new Date();
  await Match.deleteMany({ expiresAt: { $lt: now } });
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  await Message.deleteMany({ createdAt: { $lt: thirtyDaysAgo } });
  console.log('Expired matches and messages cleaned up');
});
