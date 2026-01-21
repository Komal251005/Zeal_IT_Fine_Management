/**
 * ===========================================
 * Authentication Controller
 * ===========================================
 * Handles admin authentication operations
 */

const Admin = require('../models/Admin');
const { generateToken } = require('../middleware/authMiddleware');
const { asyncHandler } = require('../middleware/errorMiddleware');

/**
 * @desc    Login admin
 * @route   POST /api/auth/login
 * @access  Public
 */
const loginAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Validate request body
    if (!email || !password) {
        res.status(400);
        throw new Error('Please provide email and password');
    }

    // Find admin by email and include password field
    const admin = await Admin.findOne({ email: email.toLowerCase() }).select('+password');

    // Check if admin exists
    if (!admin) {
        res.status(401);
        throw new Error('Invalid email or password');
    }

    // Compare passwords
    const isMatch = await admin.comparePassword(password);

    if (!isMatch) {
        res.status(401);
        throw new Error('Invalid email or password');
    }

    // Update last login timestamp
    admin.lastLogin = new Date();
    await admin.save();

    // Generate JWT token
    const token = generateToken(admin._id);

    // Send response
    res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
            id: admin._id,
            email: admin.email,
            name: admin.name,
            lastLogin: admin.lastLogin,
            token: token
        }
    });
});

/**
 * @desc    Get current admin profile
 * @route   GET /api/auth/profile
 * @access  Private
 */
const getProfile = asyncHandler(async (req, res) => {
    // Admin is attached to request by auth middleware
    const admin = await Admin.findById(req.admin.id);

    if (!admin) {
        res.status(404);
        throw new Error('Admin not found');
    }

    res.status(200).json({
        success: true,
        data: {
            id: admin._id,
            email: admin.email,
            name: admin.name,
            createdAt: admin.createdAt,
            lastLogin: admin.lastLogin
        }
    });
});

/**
 * @desc    Register new admin (for initial setup only)
 * @route   POST /api/auth/register
 * @access  Public (should be disabled after initial setup)
 */
const registerAdmin = asyncHandler(async (req, res) => {
    const { email, password, name } = req.body;

    // Validate required fields
    if (!email || !password) {
        res.status(400);
        throw new Error('Please provide email and password');
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: email.toLowerCase() });

    if (existingAdmin) {
        res.status(400);
        throw new Error('Admin with this email already exists');
    }

    // Create new admin
    const admin = await Admin.create({
        email: email.toLowerCase(),
        password: password,
        name: name || 'Admin'
    });

    // Generate token
    const token = generateToken(admin._id);

    res.status(201).json({
        success: true,
        message: 'Admin registered successfully',
        data: {
            id: admin._id,
            email: admin.email,
            name: admin.name,
            token: token
        }
    });
});

/**
 * @desc    Change admin password
 * @route   PUT /api/auth/change-password
 * @access  Private
 */
const changePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    // Validate request
    if (!currentPassword || !newPassword) {
        res.status(400);
        throw new Error('Please provide current password and new password');
    }

    if (newPassword.length < 6) {
        res.status(400);
        throw new Error('New password must be at least 6 characters');
    }

    // Get admin with password
    const admin = await Admin.findById(req.admin.id).select('+password');

    // Verify current password
    const isMatch = await admin.comparePassword(currentPassword);

    if (!isMatch) {
        res.status(401);
        throw new Error('Current password is incorrect');
    }

    // Update password
    admin.password = newPassword;
    await admin.save();

    // Generate new token
    const token = generateToken(admin._id);

    res.status(200).json({
        success: true,
        message: 'Password changed successfully',
        data: {
            token: token
        }
    });
});

module.exports = {
    loginAdmin,
    getProfile,
    registerAdmin,
    changePassword
};
