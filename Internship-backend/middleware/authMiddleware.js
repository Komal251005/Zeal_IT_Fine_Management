/**
 * ===========================================
 * JWT Authentication Middleware
 * ===========================================
 * Protects routes by verifying JWT tokens
 */

const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

/**
 * Protect routes - Verify JWT token
 * This middleware checks if the request has a valid JWT token
 * and attaches the admin user to the request object
 */
const protect = async (req, res, next) => {
    let token;

    try {
        // Check for token in Authorization header
        // Format: "Bearer <token>"
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            // Extract token from header
            token = req.headers.authorization.split(' ')[1];
        }

        // Check if token exists
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized. No token provided.'
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find admin by ID from token payload
        // Exclude password from the result
        const admin = await Admin.findById(decoded.id).select('-password');

        // Check if admin exists
        if (!admin) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized. Admin not found.'
            });
        }

        // Attach admin to request object
        req.admin = admin;

        // Proceed to next middleware/route handler
        next();

    } catch (error) {
        console.error('Auth middleware error:', error.message);

        // Handle specific JWT errors
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Not authorized. Invalid token.'
            });
        }

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Not authorized. Token has expired.'
            });
        }

        // Generic error
        return res.status(401).json({
            success: false,
            message: 'Not authorized. Token verification failed.'
        });
    }
};

/**
 * Generate JWT Token
 * @param {string} id - Admin ID to include in token payload
 * @returns {string} - Signed JWT token
 */
const generateToken = (id) => {
    return jwt.sign(
        { id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
};

module.exports = {
    protect,
    generateToken
};
