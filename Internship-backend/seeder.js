/**
 * ===========================================
 * Database Seeder Script
 * ===========================================
 * Seeds the database with initial admin user
 * and optional sample data
 * 
 * Usage:
 * - To seed: npm run seed
 * - To clear: npm run seed:clear
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('./models/Admin');
const Student = require('./models/Student');
const Expenditure = require('./models/Expenditure');

// Load environment variables
dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for seeding...');
    } catch (error) {
        console.error('MongoDB Connection Error:', error.message);
        process.exit(1);
    }
};

// ===========================================
// Sample Data
// ===========================================

const sampleAdmin = {
    email: process.env.ADMIN_EMAIL || 'admin@college.edu',
    password: process.env.ADMIN_PASSWORD || 'Admin@123',
    name: 'System Admin'
};

// ===========================================
// Seeder Functions
// ===========================================

/**
 * Seed admin user only
 */
const seedData = async () => {
    try {
        await connectDB();

        // Clear existing admin (to allow re-seeding)
        console.log('\nClearing existing admin...');
        await Admin.deleteMany({});
        console.log('✓ Existing admin cleared');

        // Seed Admin
        console.log('\nSeeding admin user...');
        const admin = await Admin.create(sampleAdmin);
        console.log(`✓ Admin created: ${admin.email}`);

        console.log('\n===========================================');
        console.log('✅ Admin seeded successfully!');
        console.log('===========================================');
        console.log(`\nAdmin Credentials:`);
        console.log(`  Email: ${sampleAdmin.email}`);
        console.log(`  Password: ${sampleAdmin.password}`);
        console.log('\nNote: Upload student data via CSV files.');
        console.log('\n');

        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error.message);
        process.exit(1);
    }
};

/**
 * Clear all data
 */
const clearData = async () => {
    try {
        await connectDB();

        console.log('\nClearing all data...');
        await Admin.deleteMany({});
        await Student.deleteMany({});
        await Expenditure.deleteMany({});

        console.log('\n===========================================');
        console.log('✅ All data cleared successfully!');
        console.log('===========================================\n');

        process.exit(0);
    } catch (error) {
        console.error('Error clearing database:', error.message);
        process.exit(1);
    }
};

/**
 * Seed only admin user (for production)
 */
const seedAdminOnly = async () => {
    try {
        await connectDB();

        // Check if admin exists
        const existingAdmin = await Admin.findOne({ email: sampleAdmin.email });

        if (existingAdmin) {
            console.log('Admin user already exists');
        } else {
            const admin = await Admin.create(sampleAdmin);
            console.log(`✓ Admin created: ${admin.email}`);
        }

        console.log('\n===========================================');
        console.log('Admin setup complete!');
        console.log('===========================================\n');

        process.exit(0);
    } catch (error) {
        console.error('Error seeding admin:', error.message);
        process.exit(1);
    }
};

// ===========================================
// Run based on command line argument
// ===========================================

const arg = process.argv[2];

if (arg === '-c' || arg === '--clear') {
    clearData();
} else if (arg === '-a' || arg === '--admin') {
    seedAdminOnly();
} else {
    seedData();
}
