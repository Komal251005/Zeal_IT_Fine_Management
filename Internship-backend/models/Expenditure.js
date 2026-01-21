/**
 * ===========================================
 * Expenditure Model
 * ===========================================
 * Schema for department expenditure records
 */

const mongoose = require('mongoose');

const expenditureSchema = new mongoose.Schema({
    // Expenditure amount
    amount: {
        type: Number,
        required: [true, 'Amount is required'],
        min: [0, 'Amount cannot be negative']
    },

    // Description of the expenditure
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true,
        maxlength: [500, 'Description cannot exceed 500 characters']
    },

    // Category of expenditure (optional)
    category: {
        type: String,
        trim: true,
        enum: {
            values: ['infrastructure', 'equipment', 'stationery', 'events', 'maintenance', 'other'],
            message: 'Invalid category'
        },
        default: 'other'
    },

    // Department that made the expenditure (optional)
    department: {
        type: String,
        trim: true
    },

    // Date of expenditure
    date: {
        type: Date,
        default: Date.now
    },

    // Admin who added this expenditure
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin'
    },

    // Receipt number or reference (optional)
    receiptNumber: {
        type: String,
        trim: true
    },

    // Additional notes
    notes: {
        type: String,
        trim: true,
        maxlength: [1000, 'Notes cannot exceed 1000 characters']
    }
}, {
    // Add createdAt and updatedAt timestamps
    timestamps: true
});

// ===========================================
// Static Methods
// ===========================================

/**
 * Calculate total expenditure
 * @returns {Promise<number>}
 */
expenditureSchema.statics.calculateTotalExpenditure = async function () {
    const result = await this.aggregate([
        { $group: { _id: null, totalExpenditure: { $sum: '$amount' } } }
    ]);
    return result.length > 0 ? result[0].totalExpenditure : 0;
};

/**
 * Get expenditure summary by category
 * @returns {Promise<Array>}
 */
expenditureSchema.statics.getSummaryByCategory = async function () {
    return await this.aggregate([
        {
            $group: {
                _id: '$category',
                totalAmount: { $sum: '$amount' },
                count: { $sum: 1 }
            }
        },
        { $sort: { totalAmount: -1 } }
    ]);
};

/**
 * Get expenditure summary by department
 * @returns {Promise<Array>}
 */
expenditureSchema.statics.getSummaryByDepartment = async function () {
    return await this.aggregate([
        {
            $group: {
                _id: '$department',
                totalAmount: { $sum: '$amount' },
                count: { $sum: 1 }
            }
        },
        { $sort: { totalAmount: -1 } }
    ]);
};

/**
 * Get monthly expenditure summary
 * @returns {Promise<Array>}
 */
expenditureSchema.statics.getMonthlySummary = async function () {
    return await this.aggregate([
        {
            $group: {
                _id: {
                    year: { $year: '$date' },
                    month: { $month: '$date' }
                },
                totalAmount: { $sum: '$amount' },
                count: { $sum: 1 }
            }
        },
        { $sort: { '_id.year': -1, '_id.month': -1 } }
    ]);
};

// Create and export the model
const Expenditure = mongoose.model('Expenditure', expenditureSchema);

module.exports = Expenditure;
