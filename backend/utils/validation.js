const { body } = require('express-validator');

const taskValidation = {
    create: [
        body('title')
            .isLength({ min: 5, max: 100 })
            .withMessage('Title must be between 5 and 100 characters')
            .trim(),
        body('description')
            .isLength({ max: 300 })
            .withMessage('Description must not exceed 300 characters')
            .trim(),
        body('priority')
            .optional()
            .isIn(['Low', 'Medium', 'High'])
            .withMessage('Priority must be Low, Medium, or High'),
        body('dueDate')
            .isISO8601()
            .withMessage('Due date must be a valid date')
            .custom((value) => {
                if (new Date(value) <= new Date()) {
                    throw new Error('Due date must be in the future');
                }
                return true;
            }),
        body('assignedTo')
            .optional()
            .isMongoId()
            .withMessage('Assigned to must be a valid user ID')
    ],

    update: [
        body('title')
            .optional()
            .isLength({ min: 5, max: 100 })
            .withMessage('Title must be between 5 and 100 characters')
            .trim(),
        body('description')
            .optional()
            .isLength({ max: 300 })
            .withMessage('Description must not exceed 300 characters')
            .trim(),
        body('priority')
            .optional()
            .isIn(['Low', 'Medium', 'High'])
            .withMessage('Priority must be Low, Medium, or High'),
        body('status')
            .optional()
            .isIn(['Pending', 'In Progress', 'Completed'])
            .withMessage('Status must be Pending, In Progress, or Completed'),
        body('dueDate')
            .optional()
            .isISO8601()
            .withMessage('Due date must be a valid date'),
        body('assignedTo')
            .optional()
            .isMongoId()
            .withMessage('Assigned to must be a valid user ID')
    ]
};

const userValidation = {
    register: [
        body('username')
            .isLength({ min: 3, max: 30 })
            .withMessage('Username must be between 3 and 30 characters')
            .trim()
            .matches(/^[a-zA-Z0-9_]+$/)
            .withMessage('Username can only contain letters, numbers, and underscores'),
        body('email')
            .isEmail()
            .withMessage('Please provide a valid email')
            .normalizeEmail(),
        body('password')
            .isLength({ min: 6 })
            .withMessage('Password must be at least 6 characters long')
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
            .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
        body('firstName')
            .notEmpty()
            .withMessage('First name is required')
            .trim()
            .isLength({ max: 50 })
            .withMessage('First name must not exceed 50 characters'),
        body('lastName')
            .notEmpty()
            .withMessage('Last name is required')
            .trim()
            .isLength({ max: 50 })
            .withMessage('Last name must not exceed 50 characters'),
        body('role')
            .optional()
            .isIn(['employee', 'manager', 'admin'])
            .withMessage('Role must be employee, manager, or admin')
    ],

    login: [
        body('email')
            .isEmail()
            .withMessage('Please provide a valid email')
            .normalizeEmail(),
        body('password')
            .notEmpty()
            .withMessage('Password is required')
    ]
};

module.exports = {
    taskValidation,
    userValidation
};