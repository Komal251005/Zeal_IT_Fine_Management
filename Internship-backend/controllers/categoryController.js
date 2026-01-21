/**
 * ===========================================
 * Category Controller
 * ===========================================
 * Handles payment category CRUD operations
 */

const PaymentCategory = require('../models/PaymentCategory');
const { asyncHandler } = require('../middleware/errorMiddleware');

/**
 * @desc    Get all categories
 * @route   GET /api/categories
 * @access  Private
 */
const getAllCategories = asyncHandler(async (req, res) => {
    const { type, activeOnly } = req.query;

    const query = {};
    if (type) query.type = type;
    if (activeOnly === 'true') query.isActive = true;

    const categories = await PaymentCategory.find(query).sort({ name: 1 });

    res.status(200).json({
        success: true,
        data: {
            categories,
            count: categories.length
        }
    });
});

/**
 * @desc    Create a new category
 * @route   POST /api/categories
 * @access  Private
 */
const createCategory = asyncHandler(async (req, res) => {
    const { name, type, description } = req.body;

    // Check if category already exists
    const existingCategory = await PaymentCategory.findOne({
        name: { $regex: new RegExp(`^${name}$`, 'i') }
    });

    if (existingCategory) {
        res.status(400);
        throw new Error('Category with this name already exists');
    }

    const category = await PaymentCategory.create({
        name,
        type: type || 'fine',
        description
    });

    res.status(201).json({
        success: true,
        message: 'Category created successfully',
        data: category
    });
});

/**
 * @desc    Update a category
 * @route   PUT /api/categories/:id
 * @access  Private
 */
const updateCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, type, description, isActive } = req.body;

    const category = await PaymentCategory.findById(id);

    if (!category) {
        res.status(404);
        throw new Error('Category not found');
    }

    // Check if new name conflicts with existing category
    if (name && name !== category.name) {
        const existingCategory = await PaymentCategory.findOne({
            name: { $regex: new RegExp(`^${name}$`, 'i') },
            _id: { $ne: id }
        });
        if (existingCategory) {
            res.status(400);
            throw new Error('Category with this name already exists');
        }
    }

    category.name = name || category.name;
    category.type = type || category.type;
    category.description = description !== undefined ? description : category.description;
    category.isActive = isActive !== undefined ? isActive : category.isActive;

    await category.save();

    res.status(200).json({
        success: true,
        message: 'Category updated successfully',
        data: category
    });
});

/**
 * @desc    Delete a category
 * @route   DELETE /api/categories/:id
 * @access  Private
 */
const deleteCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const category = await PaymentCategory.findById(id);

    if (!category) {
        res.status(404);
        throw new Error('Category not found');
    }

    await category.deleteOne();

    res.status(200).json({
        success: true,
        message: 'Category deleted successfully'
    });
});

module.exports = {
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory
};
