/**
 * ===========================================
 * PaymentCategory Model
 * ===========================================
 * Schema for payment categories (fines, fees, etc.)
 */

const mongoose = require('mongoose');

const paymentCategorySchema = new mongoose.Schema({
    // Category name (e.g., "Late Fine", "ITSA Committee Fees")
    name: {
        type: String,
        required: [true, 'Category name is required'],
        trim: true,
        unique: true,
        maxlength: [100, 'Category name cannot exceed 100 characters']
    },

    // Type: fine or fee
    type: {
        type: String,
        required: [true, 'Category type is required'],
        enum: ['fine', 'fee'],
        default: 'fine'
    },

    // Description (optional)
    description: {
        type: String,
        trim: true,
        maxlength: [500, 'Description cannot exceed 500 characters']
    },

    // Whether this category is active
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Create and export the model
const PaymentCategory = mongoose.model('PaymentCategory', paymentCategorySchema);

module.exports = PaymentCategory;
