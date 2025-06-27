const express = require('express');
const Task = require('../models/Task');
const User = require('../models/User');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();


router.get('/employee', auth, async (req, res) => {
    try {
        const userId = req.user._id;


        const tasks = await Task.find({ assignedTo: userId })
            .populate('createdBy', 'firstName lastName username')
            .sort({ dueDate: 1 });


        const taskStats = await Task.aggregate([
            { $match: { assignedTo: userId } },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        const stats = {
            total: tasks.length,
            pending: 0,
            inProgress: 0,
            completed: 0
        };

        taskStats.forEach(stat => {
            switch (stat._id) {
                case 'Pending':
                    stats.pending = stat.count;
                    break;
                case 'In Progress':
                    stats.inProgress = stat.count;
                    break;
                case 'Completed':
                    stats.completed = stat.count;
                    break;
            }
        });


        const overdueTasks = tasks.filter(task =>
            new Date(task.dueDate) < new Date() && task.status !== 'Completed'
        );

        res.json({
            tasks: tasks.slice(0, 10), 
            stats,
            overdueTasks: overdueTasks.length,
            upcomingTasks: tasks.filter(task =>
                new Date(task.dueDate) > new Date() &&
                new Date(task.dueDate) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            ).length
        });
    } catch (error) {
        console.error('Employee dashboard error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});


router.get('/manager', auth, authorize('manager', 'admin'), async (req, res) => {
    try {

        const tasks = await Task.find({})
            .populate('assignedTo', 'firstName lastName username')
            .populate('createdBy', 'firstName lastName username')
            .sort({ createdAt: -1 })
            .limit(20);


        const taskStats = await Task.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        const priorityStats = await Task.aggregate([
            {
                $group: {
                    _id: '$priority',
                    count: { $sum: 1 }
                }
            }
        ]);

        const stats = {
            total: 0,
            pending: 0,
            inProgress: 0,
            completed: 0,
            highPriority: 0,
            mediumPriority: 0,
            lowPriority: 0
        };

        taskStats.forEach(stat => {
            stats.total += stat.count;
            switch (stat._id) {
                case 'Pending':
                    stats.pending = stat.count;
                    break;
                case 'In Progress':
                    stats.inProgress = stat.count;
                    break;
                case 'Completed':
                    stats.completed = stat.count;
                    break;
            }
        });

        priorityStats.forEach(stat => {
            switch (stat._id) {
                case 'High':
                    stats.highPriority = stat.count;
                    break;
                case 'Medium':
                    stats.mediumPriority = stat.count;
                    break;
                case 'Low':
                    stats.lowPriority = stat.count;
                    break;
            }
        });


        const teamPerformance = await Task.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'assignedTo',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            { $unwind: '$user' },
            {
                $group: {
                    _id: '$assignedTo',
                    name: { $first: { $concat: ['$user.firstName', ' ', '$user.lastName'] } },
                    totalTasks: { $sum: 1 },
                    completedTasks: {
                        $sum: { $cond: [{ $eq: ['$status', 'Completed'] }, 1, 0] }
                    }
                }
            },
            {
                $addFields: {
                    completionRate: {
                        $multiply: [
                            { $divide: ['$completedTasks', '$totalTasks'] },
                            100
                        ]
                    }
                }
            }
        ]);

        res.json({
            tasks,
            stats,
            teamPerformance
        });
    } catch (error) {
        console.error('Manager dashboard error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});


router.get('/admin', auth, authorize('admin'), async (req, res) => {
    try {

        const totalUsers = await User.countDocuments({ isActive: true });
        const totalTasks = await Task.countDocuments({});


        const userRoles = await User.aggregate([
            { $match: { isActive: true } },
            {
                $group: {
                    _id: '$role',
                    count: { $sum: 1 }
                }
            }
        ]);


        const taskStats = await Task.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);


        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const recentTasks = await Task.countDocuments({
            createdAt: { $gte: thirtyDaysAgo }
        });

        const recentUsers = await User.countDocuments({
            createdAt: { $gte: thirtyDaysAgo }
        });


        const topPerformers = await Task.aggregate([
            { $match: { status: 'Completed' } },
            {
                $lookup: {
                    from: 'users',
                    localField: 'assignedTo',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            { $unwind: '$user' },
            {
                $group: {
                    _id: '$assignedTo',
                    name: { $first: { $concat: ['$user.firstName', ' ', '$user.lastName'] } },
                    completedTasks: { $sum: 1 }
                }
            },
            { $sort: { completedTasks: -1 } },
            { $limit: 5 }
        ]);

        const roleStats = {
            employees: 0,
            managers: 0,
            admins: 0
        };

        userRoles.forEach(role => {
            switch (role._id) {
                case 'employee':
                    roleStats.employees = role.count;
                    break;
                case 'manager':
                    roleStats.managers = role.count;
                    break;
                case 'admin':
                    roleStats.admins = role.count;
                    break;
            }
        });

        const stats = {
            total: 0,
            pending: 0,
            inProgress: 0,
            completed: 0
        };

        taskStats.forEach(stat => {
            stats.total += stat.count;
            switch (stat._id) {
                case 'Pending':
                    stats.pending = stat.count;
                    break;
                case 'In Progress':
                    stats.inProgress = stat.count;
                    break;
                case 'Completed':
                    stats.completed = stat.count;
                    break;
            }
        });

        res.json({
            systemOverview: {
                totalUsers,
                totalTasks,
                recentTasks,
                recentUsers
            },
            userRoles: roleStats,
            taskStats: stats,
            topPerformers
        });
    } catch (error) {
        console.error('Admin dashboard error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;