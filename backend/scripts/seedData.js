const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./backend/models/User');
const Task = require('./backend/models/Task');
require('dotenv').config();

const seedData = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/taskmanagement");
        console.log('Connected to MongoDB');

        // Clear existing data
        await User.deleteMany({});
        await Task.deleteMany({});
        console.log('Cleared existing data');

        // Create users
        const users = [
            {
                username: 'admin',
                email: 'admin@example.com',
                password: await bcrypt.hash('admin123', 10),
                firstName: 'Admin',
                lastName: 'User',
                role: 'admin'
            },
            {
                username: 'manager1',
                email: 'manager1@example.com',
                password: await bcrypt.hash('manager123', 10),
                firstName: 'John',
                lastName: 'Manager',
                role: 'manager'
            },
            {
                username: 'employee1',
                email: 'employee1@example.com',
                password: await bcrypt.hash('employee123', 10),
                firstName: 'Alice',
                lastName: 'Smith',
                role: 'employee'
            },
            {
                username: 'employee2',
                email: 'employee2@example.com',
                password: await bcrypt.hash('employee123', 10),
                firstName: 'Bob',
                lastName: 'Johnson',
                role: 'employee'
            }
        ];

        const createdUsers = await User.insertMany(users);
        console.log('Created users:', createdUsers.length);

        // Create tasks
        const tasks = [
            {
                title: 'Complete project documentation',
                description: 'Write comprehensive documentation for the new project including API specs and user guides.',
                priority: 'High',
                status: 'Pending',
                dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
                assignedTo: createdUsers[2]._id, // employee1
                createdBy: createdUsers[1]._id  // manager1
            },
            {
                title: 'Review code changes',
                description: 'Review and approve the recent code changes in the main branch.',
                priority: 'Medium',
                status: 'In Progress',
                dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
                assignedTo: createdUsers[3]._id, // employee2
                createdBy: createdUsers[1]._id  // manager1
            },
            {
                title: 'Update database schema',
                description: 'Update the database schema to include new fields for user preferences.',
                priority: 'High',
                status: 'Completed',
                dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
                assignedTo: createdUsers[2]._id, // employee1
                createdBy: createdUsers[0]._id  // admin
            },
            {
                title: 'Prepare monthly report',
                description: 'Compile and prepare the monthly performance report for the team.',
                priority: 'Low',
                status: 'Pending',
                dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
                assignedTo: createdUsers[1]._id, // manager1
                createdBy: createdUsers[0]._id  // admin
            }
        ];

        const createdTasks = await Task.insertMany(tasks);
        console.log('Created tasks:', createdTasks.length);

        console.log('Seed data created successfully!');
        console.log('\nLogin credentials:');
        console.log('Admin: admin@example.com / admin123');
        console.log('Manager: manager1@example.com / manager123');
        console.log('Employee 1: employee1@example.com / employee123');
        console.log('Employee 2: employee2@example.com / employee123');

        process.exit(0);
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();