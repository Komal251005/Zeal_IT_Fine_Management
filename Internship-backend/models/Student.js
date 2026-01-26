/**
 * ===========================================
 * Student Model
 * ===========================================
 * Schema for student records with fine history
 */

const mongoose = require('mongoose');

// ===========================================
// Fine Subdocument Schema
// ===========================================
const fineSchema = new mongoose.Schema({
    // Fine amount in currency units
    amount: {
        type: Number,
        required: [true, 'Payment amount is required'],
        min: [0, 'Payment amount cannot be negative']
    },

    // Reason for the fine/fee (optional)
    reason: {
        type: String,
        trim: true,
        maxlength: [500, 'Reason cannot exceed 500 characters'],
        default: ''
    },

    // Payment type (fine or fee)
    type: {
        type: String,
        enum: ['fine', 'fee'],
        default: 'fine'
    },

    // Category (e.g., "Late Fine", "ITSA Committee Fees", "Others")
    category: {
        type: String,
        trim: true,
        default: 'Others'
    },

    // Receipt number for this payment
    receiptNumber: {
        type: String,
        unique: true,
        sparse: true
    },

    // Date when fine was issued
    date: {
        type: Date,
        default: Date.now
    },

    // Payment status - default to true (paid)
    isPaid: {
        type: Boolean,
        default: true
    },

    // Date when fine was paid (if applicable)
    paidDate: {
        type: Date,
        default: Date.now
    }
}, {
    // Add timestamps for fine creation/update
    timestamps: true
});

// ===========================================
// Student Schema
// ===========================================
const studentSchema = new mongoose.Schema({
    // PRN (Permanent Registration Number) - Unique identifier
    prn: {
        type: String,
        required: [true, 'PRN is required'],
        unique: true,
        trim: true,
        uppercase: true, // Store PRN in uppercase for consistency
        index: true // Index for faster searches
    },

    // Student's full name
    name: {
        type: String,
        required: [true, 'Student name is required'],
        trim: true,
        maxlength: [100, 'Name cannot exceed 100 characters']
    },

    // Department/Branch (derived from Division or set manually)
    department: {
        type: String,
        trim: true,
        maxlength: [100, 'Department name cannot exceed 100 characters']
    },

    // Academic Year (e.g., "2024-25")
    academicYear: {
        type: String,
        trim: true
    },

    // Semester (e.g., 1, 2, 3...)
    semester: {
        type: String,
        trim: true
    },

    // Year of study (e.g., FE, SE, TE, BE or 1, 2, 3, 4)
    year: {
        type: String,
        trim: true
    },

    // Division (e.g., A, B, C)
    division: {
        type: String,
        trim: true
    },

    // Roll Number
    rollNo: {
        type: String,
        trim: true
    },

    // Email (optional)
    email: {
        type: String,
        trim: true,
        lowercase: true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            'Please provide a valid email address'
        ]
    },

    // Phone number (optional)
    phone: {
        type: String,
        trim: true
    },

    // Array of fines associated with the student
    fines: [fineSchema],

    // Indicates if student record is active
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    // Add createdAt and updatedAt timestamps
    timestamps: true
});

// ===========================================
// Virtual Fields
// ===========================================

/**
 * Calculate total fines amount for the student
 */
studentSchema.virtual('totalFines').get(function () {
    if (!this.fines) return 0;
    return this.fines.reduce((total, fine) => total + fine.amount, 0);
});

/**
 * Calculate total unpaid fines
 */
studentSchema.virtual('unpaidFines').get(function () {
    if (!this.fines) return 0;
    return this.fines
        .filter(fine => !fine.isPaid)
        .reduce((total, fine) => total + fine.amount, 0);
});

/**
 * Get count of fines
 */
studentSchema.virtual('fineCount').get(function () {
    if (!this.fines) return 0;
    return this.fines.length;
});

// Ensure virtuals are included in JSON output
studentSchema.set('toJSON', { virtuals: true });
studentSchema.set('toObject', { virtuals: true });

// ===========================================
// Static Methods
// ===========================================

/**
 * Find student by PRN
 * @param {string} prn - Student PRN
 * @returns {Promise<Student>}
 */
studentSchema.statics.findByPRN = function (prn) {
    return this.findOne({ prn: prn.toUpperCase() });
};

/**
 * Calculate total income from all student fines
 * @returns {Promise<number>}
 */
studentSchema.statics.calculateTotalIncome = async function () {
    const result = await this.aggregate([
        { $unwind: '$fines' },
        { $group: { _id: null, totalIncome: { $sum: '$fines.amount' } } }
    ]);
    return result.length > 0 ? result[0].totalIncome : 0;
};

// ===========================================
// Instance Methods
// ===========================================

/**
 * Add a new fine to the student
 * @param {Object} fineData - Fine details (amount, reason, date)
 * @returns {Promise<Student>}
 */
studentSchema.methods.addFine = async function (fineData) {
    this.fines.push({
        amount: fineData.amount,
        reason: fineData.reason,
        date: fineData.date || new Date()
    });
    return await this.save();
};

// Create and export the model
const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
