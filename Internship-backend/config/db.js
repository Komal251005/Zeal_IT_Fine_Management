/**
 * ===========================================
 * MongoDB Database Connection Configuration
 * ===========================================
 * Handles MongoDB connection using Mongoose
 */

const mongoose = require('mongoose');

/**
 * Connect to MongoDB database
 * @returns {Promise<void>}
 */
const connectDB = async () => {
    try {
        // MongoDB connection options
        const options = {
            // These options help with connection stability
            maxPoolSize: 10, // Maintain up to 10 socket connections
        };

        // Connect to MongoDB
        const conn = await mongoose.connect(process.env.MONGO_URI, options);

        console.log(`\n===========================================`);
        console.log(`📦 MongoDB Connected Successfully`);
        console.log(`🔗 Host: ${conn.connection.host}`);
        console.log(`📁 Database: ${conn.connection.name}`);
        console.log(`===========================================\n`);

        // Handle connection events
        mongoose.connection.on('error', (err) => {
            console.error(`MongoDB connection error: ${err}`);
        });

        mongoose.connection.on('disconnected', () => {
            console.warn('MongoDB disconnected. Attempting to reconnect...');
        });

        mongoose.connection.on('reconnected', () => {
            console.log('MongoDB reconnected successfully');
        });

    } catch (error) {
        console.error(`\n❌ MongoDB Connection Error: ${error.message}`);
        console.error('Please check your MONGO_URI in .env file\n');
        process.exit(1);
    }
};

module.exports = connectDB;
