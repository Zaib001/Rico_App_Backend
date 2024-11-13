const mongoose = require('mongoose');
const logger = require('../utils/logger'); // Import the logger you just created

const connectDB = async () => {
    const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
        socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
        // Additional options can be added as needed
    };

    try {
        await mongoose.connect(process.env.DB_URI || "mongodb+srv://zebimalik4567:0JRah3RfhsqTCOwI@cluster0.6jhoy.mongodb.net/", options);
        logger.info('MongoDB connected successfully');
    } catch (error) {
        logger.error(`MongoDB connection error: ${error.message}`);
        process.exit(1);
    }

    mongoose.connection.on('error', (err) => {
        logger.error(`MongoDB connection error: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
        logger.warn('MongoDB connection lost. Attempting to reconnect...');
        connectDB(); // Reconnect on disconnect
    });
};

// Graceful shutdown
const shutdown = () => {
    mongoose.connection.close(() => {
        logger.info('MongoDB connection closed due to app termination');
        process.exit(0);
    });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

// Initial connection
module.exports = connectDB;
