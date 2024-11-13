const redis = require('redis');
require('dotenv').config();

// Create a Redis client
const redisClient = redis.createClient({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: process.env.REDIS_PORT || 6379,       
});

// Handle Redis client connection errors
redisClient.on('error', (err) => {
  console.error('Redis connection error:', err);
});

// Handle successful connection to Redis
redisClient.on('connect', () => {
  console.log('Connected to Redis successfully');
});

// Optionally handle reconnection logic
redisClient.on('reconnecting', () => {
  console.log('Reconnecting to Redis...');
});

// Initialize Redis client and export it for use in other files
redisClient.connect().catch(console.error);

module.exports = redisClient;
