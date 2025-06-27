const express = require('express');
const { body, validationResult } = require('express-validator');
const Task = require('../models/Task');
const User = require('../models/User');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();


router.get('/', auth, async (req, res) => {
    try {
        const { page = 1, limit = 10, status, priority, assignedTo } = req.query;
        let query = {};


        if (req.user.role === 'employee') {
            query.assignedTo = req.user._id;
        } else if (assignedTo) {
            query.assignedTo = assignedTo;
        }

        if (status) query.status = status;
        if (priority) query.priority = priority;

        const tasks = await Task.find(query)
            .populate('assignedTo', 'firstName lastName username email')
            .populate('createdBy', 'firstName lastName username email')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 });

        const total = await Task.countDocuments(query);

        res.json({
            tasks,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalTasks: total
        });
    } catch (error) {
        console.error('Get tasks error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});


router.get('/:id', auth, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)
            .populate('assignedTo', 'firstName lastName username email')
            .populate('createdBy', 'firstName lastName username email');

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }


        if (req.user.role === 'employee' && task.assignedTo._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Access denied' });
        }

        res.json({ task });
    } catch (error) {
        console.error('Get task error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});


router.post('/', auth, [
    body('title').isLength({ min: 5, max: 100 }).trim(),
    body('description').isLength({ max: 300 }).trim(),
    body('priority').optional().isIn(['Low', 'Medium', 'High']),
    body('dueDate').isISO8601(),
    body('assignedTo').optional().isMongoId()
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { title, description, priority, dueDate, assignedTo } = req.body;


        let taskAssignedTo = assignedTo;

        if (req.user.role === 'employee') {

            taskAssignedTo = req.user._id;
        } else if (!assignedTo) {

            taskAssignedTo = req.user._id;
        } else {

            const assignedUser = await User.findById(assignedTo);
            if (!assignedUser) {
                return res.status(400).json({ error: 'Assigned user not found' });
            }
        }

        const task = new Task({
            title,
            description,
            priority: priority || 'Medium',
            dueDate,
            assignedTo: taskAssignedTo,
            createdBy: req.user._id
        });

        await task.save();
        await task.populate('assignedTo', 'firstName lastName username email');
        await task.populate('createdBy', 'firstName lastName username email');

        res.status(201).json({ message: 'Task created successfully', task });
    } catch (error) {
        console.error('Create task error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});


router.put('/:id', auth, [
    body('title').optional().isLength({ min: 5, max: 100 }).trim(),
    body('description').optional().isLength({ max: 300 }).trim(),
    body('priority').optional().isIn(['Low', 'Medium', 'High']),
    body('status').optional().isIn(['Pending', 'In Progress', 'Completed']),
    body('dueDate').optional().isISO8601(),
    body('assignedTo').optional().isMongoId()
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }


        if (req.user.role === 'employee') {

            if (task.assignedTo.toString() !== req.user._id.toString()) {
                return res.status(403).json({ error: 'Access denied' });
            }

            const allowedUpdates = ['status'];
            const updates = Object.keys(req.body);
            const isValidUpdate = updates.every(update => allowedUpdates.includes(update));

            if (!isValidUpdate) {
                return res.status(403).json({ error: 'Employees can only update task status' });
            }
        }


        Object.assign(task, req.body);
        await task.save();
        await task.populate('assignedTo', 'firstName lastName username email');
        await task.populate('createdBy', 'firstName lastName username email');

        res.json({ message: 'Task updated successfully', task });
    } catch (error) {
        console.error('Update task error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});


router.delete('/:id', auth, authorize('manager', 'admin'), async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error('Delete task error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;