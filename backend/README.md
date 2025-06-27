# Task Management System Backend

A comprehensive task management system backend built with Node.js, Express, and MongoDB, featuring role-based permissions.

## Features

### User Roles & Permissions
- **Employee**: Create and view own tasks, update task status
- **Manager**: All employee permissions + view all tasks, assign tasks, manage priorities, delete tasks, basic user management
- **Admin**: All manager permissions + full user CRUD operations, system analytics

### Core Functionality
- JWT-based authentication
- Role-based access control
- Task CRUD operations with validation
- Dashboard analytics for each role
- User management system

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/taskmanagement
   JWT_SECRET=your_jwt_secret_key_here_make_it_strong
   NODE_ENV=development
   ```

4. Start MongoDB service

5. Seed initial data (optional):
   ```bash
   node scripts/seedData.js
   ```

6. Start the server:
   ```bash
   npm start
   # or for development
   npm run dev
   ```

## Frontend env 
- NEXT_PUBLIC_API_URL=http//:localhost:3001/api

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

### Users (Manager/Admin only)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user (Admin only)
- `PUT /api/users/:id/role` - Update user role (Admin only)
- `DELETE /api/users/:id` - Deactivate user (Admin only)

### Tasks
- `GET /api/tasks` - Get tasks (filtered by role)
- `GET /api/tasks/:id` - Get task by ID
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task (Manager/Admin only)

### Dashboard
- `GET /api/dashboard/employee` - Employee dashboard data
- `GET /api/dashboard/manager` - Manager dashboard data (Manager/Admin only)
- `GET /api/dashboard/admin` - Admin dashboard data (Admin only)

## Request Examples

### Register User
```json
POST /api/auth/register
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "Password123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "employee"
}
```

### Create Task
```json
POST /api/tasks
Authorization: Bearer <token>
{
  "title": "Complete project setup",
  "description": "Set up the initial project structure and dependencies",
  "priority": "High",
  "dueDate": "2024-12-31T23:59:59.000Z",
  "assignedTo": "user_id_here"
}
```

### Update Task Status
```json
PUT /api/tasks/:id
Authorization: Bearer <token>
{
  "status": "In Progress"
}
```

## Validation Rules

### Task Validation
- Title: 5-100 characters
- Description: max 300 characters
- Priority: Low, Medium, High
- Status: Pending, In Progress, Completed
- Due Date: must be in future (for new tasks)

### User Validation
- Username: 3-30 characters, alphanumeric + underscore
- Email: valid email format
- Password: min 6 characters, must contain uppercase, lowercase, and number
- Names: max 50 characters each

## Security Features
- Password hashing with bcrypt
- JWT token authentication
- Role-based access control
- Input validation and sanitization
- Rate limiting (optional middleware included)
- CORS protection

## Error Handling
- Comprehensive error handling middleware
- Validation error responses
- Proper HTTP status codes
- Structured error messages

## Database Schema

### User Schema
- username, email, password (hashed)
- firstName, lastName
- role (employee/manager/admin)
- isActive boolean
- timestamps

### Task Schema
- title, description
- priority, status
- dueDate
- assignedTo (User ref)
- createdBy (User ref)
- timestamps

## Development

### Project Structure
```
├── models/          # Mongoose models
├── routes/          # Express routes
├── middleware/      # Custom middleware
├── config/          # Configuration files
├── utils/           # Utility functions
├── scripts/         # Database scripts
└── server.js        # Main server file
```

### Seeded Test Users
After running the seed script:
- Admin: admin@example.com / admin123
- Manager: manager1@example.com / manager123
- Employee 1: employee1@example.com / employee123
- Employee 2: employee2@example.com / employee123

## Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License
MIT License