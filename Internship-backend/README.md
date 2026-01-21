# College Fine Management System - Backend API

A comprehensive backend system for managing college student fines, department expenditures, and financial records. Built with Node.js, Express.js, and MongoDB.

## 📁 Folder Structure

```
college-fine-management-backend/
├── config/
│   └── db.js                 # MongoDB connection configuration
├── controllers/
│   ├── authController.js     # Authentication logic
│   ├── studentController.js  # Student & fine management logic
│   └── expenditureController.js  # Expenditure management logic
├── middleware/
│   ├── authMiddleware.js     # JWT authentication middleware
│   ├── errorMiddleware.js    # Error handling middleware
│   └── uploadMiddleware.js   # Multer file upload configuration
├── models/
│   ├── Admin.js              # Admin user schema
│   ├── Student.js            # Student schema with fines
│   └── Expenditure.js        # Expenditure schema
├── routes/
│   ├── authRoutes.js         # Authentication routes
│   ├── studentRoutes.js      # Student routes
│   └── expenditureRoutes.js  # Expenditure routes
├── sample-data/
│   └── students-sample.csv   # Sample CSV for testing
├── uploads/                  # Uploaded files (auto-created)
├── .env.example              # Environment variables template
├── .gitignore                # Git ignore file
├── package.json              # Dependencies and scripts
├── seeder.js                 # Database seeder script
├── server.js                 # Main server entry point
└── README.md                 # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone/navigate to the project directory**

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   # Copy the example file
   cp .env.example .env
   
   # Edit .env with your configuration
   ```

4. **Setup MongoDB**

   **Option A: Local MongoDB**
   - Install MongoDB Community Server
   - Start MongoDB service
   - Use connection string: `mongodb://localhost:27017/college_fine_db`

   **Option B: MongoDB Atlas (Cloud)**
   - Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create a new cluster
   - Get connection string and update `.env`
   - Whitelist your IP address

5. **Seed the database (creates admin user)**
   ```bash
   npm run seed
   ```

6. **Start the server**
   ```bash
   # Development mode (with auto-reload)
   npm run dev
   
   # Production mode
   npm start
   ```

## 🔐 Default Admin Credentials

After seeding, use these credentials to login:
- **Email:** admin@college.edu
- **Password:** Admin@123

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

### 🔑 Auth Routes

#### Login
```http
POST /api/auth/login
```
Request Body:
```json
{
  "email": "admin@college.edu",
  "password": "Admin@123"
}
```

#### Register Admin
```http
POST /api/auth/register
```
Request Body:
```json
{
  "email": "newadmin@college.edu",
  "password": "password123",
  "name": "Admin Name"
}
```

#### Get Profile
```http
GET /api/auth/profile
```
*Requires authentication*

#### Change Password
```http
PUT /api/auth/change-password
```
Request Body:
```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword"
}
```

---

### 👨‍🎓 Student Routes

#### Upload Students CSV
```http
POST /api/students/upload-csv
```
Form Data:
- `file`: CSV file

#### Get All Students
```http
GET /api/students?page=1&limit=10&department=Computer Science
```

#### Search Student by PRN
```http
GET /api/students/search/:prn
```

#### Get Student by PRN
```http
GET /api/students/:prn
```

#### Get Student Fines
```http
GET /api/students/:prn/fines
```

#### Add Fine to Student
```http
POST /api/students/add-fine/:prn
```
Request Body:
```json
{
  "amount": 100,
  "reason": "Library book late return",
  "date": "2024-01-21"
}
```

#### Mark Fine as Paid
```http
PUT /api/students/:prn/fines/:fineId/pay
```

#### Delete Student
```http
DELETE /api/students/:prn
```

---

### 💰 Expenditure Routes

#### Add Expenditure
```http
POST /api/expenditure/add
```
Request Body:
```json
{
  "amount": 5000,
  "description": "New lab equipment",
  "category": "equipment",
  "department": "Computer Science",
  "date": "2024-01-21",
  "receiptNumber": "REC-001",
  "notes": "For AI lab"
}
```

Categories: `infrastructure`, `equipment`, `stationery`, `events`, `maintenance`, `other`

#### Get Financial Summary
```http
GET /api/expenditure/summary
```
Returns:
- Total income (sum of all fines)
- Total expenditure
- Balance (income - expenditure)
- Statistics

#### Get All Expenditures
```http
GET /api/expenditure?page=1&limit=10&category=equipment
```

#### Get Monthly Report
```http
GET /api/expenditure/report/monthly?year=2024
```

#### Get Expenditure by ID
```http
GET /api/expenditure/:id
```

#### Update Expenditure
```http
PUT /api/expenditure/:id
```

#### Delete Expenditure
```http
DELETE /api/expenditure/:id
```

---

## 📄 CSV File Format

The CSV file for student upload should have the following format:

```csv
prn,name,department,email,phone
PRN2024001,John Doe,Computer Science,john@example.com,1234567890
PRN2024002,Jane Smith,Electronics,jane@example.com,0987654321
```

**Required columns:** prn, name, department  
**Optional columns:** email, phone

A sample CSV file is provided in `sample-data/students-sample.csv`

---

## 🔧 Available Scripts

```bash
# Start production server
npm start

# Start development server with nodemon
npm run dev

# Seed database with sample data
npm run seed

# Clear all data from database
npm run seed:clear

# Seed only admin user
npm run seed:admin
```

---

## 📊 Database Models

### Admin
```javascript
{
  email: String (unique, required),
  password: String (hashed, required),
  name: String,
  createdAt: Date,
  lastLogin: Date
}
```

### Student
```javascript
{
  prn: String (unique, required),
  name: String (required),
  department: String (required),
  email: String,
  phone: String,
  fines: [{
    amount: Number (required),
    reason: String (required),
    date: Date,
    isPaid: Boolean,
    paidDate: Date
  }],
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Expenditure
```javascript
{
  amount: Number (required),
  description: String (required),
  category: String (enum),
  department: String,
  date: Date,
  addedBy: ObjectId (ref: Admin),
  receiptNumber: String,
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔒 Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Protected routes middleware
- Input validation
- Error handling middleware

---

## 📝 Environment Variables

```env
# MongoDB Connection
MONGO_URI=mongodb://localhost:27017/college_fine_db

# JWT Configuration
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d

# Server
PORT=5000
NODE_ENV=development

# Default Admin (for seeding)
ADMIN_EMAIL=admin@college.edu
ADMIN_PASSWORD=Admin@123
```

---

## 🐛 Error Handling

All errors return a consistent JSON response:
```json
{
  "success": false,
  "message": "Error description",
  "stack": "..." // Only in development mode
}
```

---

## 📦 Dependencies

| Package | Purpose |
|---------|---------|
| express | Web framework |
| mongoose | MongoDB ODM |
| bcryptjs | Password hashing |
| jsonwebtoken | JWT authentication |
| multer | File uploads |
| csv-parser | CSV parsing |
| cors | Cross-origin requests |
| dotenv | Environment variables |
| nodemon | Development auto-reload |

---

## 📄 License

ISC

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request
