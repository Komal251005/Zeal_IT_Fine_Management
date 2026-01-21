/**
 * ===========================================
 * File Upload Middleware (Multer Configuration)
 * ===========================================
 * Configures Multer for handling CSV file uploads
 */

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// ===========================================
// Storage Configuration
// ===========================================

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure disk storage
const storage = multer.diskStorage({
    // Set destination folder for uploads
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },

    // Set filename - add timestamp to prevent overwrites
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, 'students-' + uniqueSuffix + ext);
    }
});

// ===========================================
// File Filter - Accept only CSV files
// ===========================================
const fileFilter = (req, file, cb) => {
    // Check file extension
    const ext = path.extname(file.originalname).toLowerCase();

    // Check MIME type and extension
    if (ext === '.csv' || file.mimetype === 'text/csv' || file.mimetype === 'application/csv') {
        cb(null, true);
    } else {
        cb(new Error('Only CSV files are allowed!'), false);
    }
};

// ===========================================
// Multer Upload Configuration
// ===========================================
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB max file size
        files: 1 // Allow only 1 file per request
    }
});

// ===========================================
// Error Handler for Multer
// ===========================================
const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        // Handle Multer-specific errors
        switch (err.code) {
            case 'LIMIT_FILE_SIZE':
                return res.status(400).json({
                    success: false,
                    message: 'File too large. Maximum size is 5MB.'
                });
            case 'LIMIT_FILE_COUNT':
                return res.status(400).json({
                    success: false,
                    message: 'Too many files. Only one file is allowed.'
                });
            case 'LIMIT_UNEXPECTED_FILE':
                return res.status(400).json({
                    success: false,
                    message: 'Unexpected field name for file upload.'
                });
            default:
                return res.status(400).json({
                    success: false,
                    message: `Upload error: ${err.message}`
                });
        }
    } else if (err) {
        // Handle other errors (like file type validation)
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }
    next();
};

module.exports = {
    upload,
    handleMulterError
};
