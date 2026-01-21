/**
 * ===========================================
 * Student Routes
 * ===========================================
 * Routes for student management including
 * CSV upload, search, and fine operations
 */

const express = require('express');
const router = express.Router();
const {
    uploadStudentsCSV,
    searchStudentByPRN,
    getStudentByPRN,
    addFineToStudent,
    getAllStudents,
    getStudentFines,
    markFineAsPaid,
    deleteStudent
} = require('../controllers/studentController');
const { protect } = require('../middleware/authMiddleware');
const { upload, handleMulterError } = require('../middleware/uploadMiddleware');

// ===========================================
// All student routes require authentication
// ===========================================
router.use(protect);

/**
 * @route   POST /api/students/upload-csv
 * @desc    Upload students from CSV file
 * @access  Private
 * 
 * Form Data:
 * - file: CSV file with headers (prn, name, department, email, phone)
 * 
 * CSV Format:
 * prn,name,department,email,phone
 * PRN001,John Doe,Computer Science,john@example.com,1234567890
 */
router.post('/upload-csv',
    upload.single('file'),
    handleMulterError,
    uploadStudentsCSV
);

/**
 * @route   GET /api/students
 * @desc    Get all students with pagination
 * @access  Private
 * 
 * Query Parameters:
 * - page: Page number (default: 1)
 * - limit: Results per page (default: 10)
 * - department: Filter by department
 * - hasFines: Filter students with fines (true/false)
 */
router.get('/', getAllStudents);

/**
 * @route   GET /api/students/search/:prn
 * @desc    Search student by PRN
 * @access  Private
 * 
 * Returns full student details including fine history
 */
router.get('/search/:prn', searchStudentByPRN);

/**
 * @route   POST /api/students/add-fine/:prn
 * @desc    Add fine to a student
 * @access  Private
 * 
 * Request Body:
 * {
 *   "amount": 100,
 *   "reason": "Late library book return",
 *   "date": "2024-01-21" (optional, defaults to now)
 * }
 */
router.post('/add-fine/:prn', addFineToStudent);

/**
 * @route   GET /api/students/:prn
 * @desc    Get student by PRN
 * @access  Private
 */
router.get('/:prn', getStudentByPRN);

/**
 * @route   GET /api/students/:prn/fines
 * @desc    Get student's fine history
 * @access  Private
 */
router.get('/:prn/fines', getStudentFines);

/**
 * @route   PUT /api/students/:prn/fines/:fineId/pay
 * @desc    Mark a fine as paid
 * @access  Private
 */
router.put('/:prn/fines/:fineId/pay', markFineAsPaid);

/**
 * @route   DELETE /api/students/:prn
 * @desc    Delete a student
 * @access  Private
 */
router.delete('/:prn', deleteStudent);

module.exports = router;
