/**
 * ===========================================
 * Authentication Routes
 * ===========================================
 * Routes for admin authentication
 */

const express = require('express');
const router = express.Router();
const {
    loginAdmin,
    getProfile,
    registerAdmin,
    changePassword
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate admin and get token
 * @access  Public
 * 
 * Request Body:
 * {
 *   "email": "admin@college.edu",
 *   "password": "your_password"
 * }
 */
router.post('/login', loginAdmin);

/**
 * @route   POST /api/auth/register
 * @desc    Register a new admin (initial setup)
 * @access  Public
 * 
 * Request Body:
 * {
 *   "email": "admin@college.edu",
 *   "password": "your_password",
 *   "name": "Admin Name" (optional)
 * }
 * 
 * NOTE: This route should be disabled or protected after initial admin setup
 */
router.post('/register', registerAdmin);

/**
 * @route   GET /api/auth/profile
 * @desc    Get current admin profile
 * @access  Private (requires JWT token)
 * 
 * Headers:
 * Authorization: Bearer <token>
 */
router.get('/profile', protect, getProfile);

/**
 * @route   PUT /api/auth/change-password
 * @desc    Change admin password
 * @access  Private
 * 
 * Request Body:
 * {
 *   "currentPassword": "old_password",
 *   "newPassword": "new_password"
 * }
 */
router.put('/change-password', protect, changePassword);

module.exports = router;
