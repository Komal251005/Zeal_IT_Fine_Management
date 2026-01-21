/**
 * ===========================================
 * Category Routes
 * ===========================================
 * Routes for payment category management
 */

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory
} = require('../controllers/categoryController');

// All routes are protected
router.use(protect);

// GET /api/categories - Get all categories
router.get('/', getAllCategories);

// POST /api/categories - Create a new category
router.post('/', createCategory);

// PUT /api/categories/:id - Update a category
router.put('/:id', updateCategory);

// DELETE /api/categories/:id - Delete a category
router.delete('/:id', deleteCategory);

module.exports = router;
