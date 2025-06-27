# Task Management System

A comprehensive task management system built with Next.js 15, featuring role-based authentication, time tracking, and advanced reporting capabilities.

## 🚀 Features

### Core Functionality
- **Role-Based Authentication** - Employee, Manager, and Admin roles with different permissions
- **Task Management** - Create, assign, update, and track tasks with priorities and due dates
- **Time Tracking** - Built-in timer, manual time entry, and comprehensive reporting
- **User Management** - Admin and manager controls for user administration
- **Dashboard Analytics** - Role-specific dashboards with key metrics and insights
- **Responsive Design** - Works seamlessly on desktop and mobile devices

### Advanced Features
- **Real-time Time Tracking** - Start/stop timers with live updates
- **Time Reports** - Generate detailed reports with CSV export
- **Task Estimation** - Set estimated hours and track progress
- **Dark Mode Support** - Toggle between light and dark themes
- **Protected Routes** - Secure access based on user roles
- **Toast Notifications** - User-friendly feedback for all actions

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Theme**: next-themes for dark mode support

## 📋 Prerequisites

Before running this application, make sure you have:

- **Node.js** (version 18.0 or higher)
- **npm** or **yarn** package manager
- **Backend API** running (see Backend Setup section)

## 🚀 Quick Start

### 1. Clone the Repository

\`\`\`bash
git clone <repository-url>
cd task-management-frontend
\`\`\`

### 2. Install Dependencies

\`\`\`bash
npm install
# or
yarn install
\`\`\`

### 3. Environment Setup

Create a `.env.local` file in the root directory:

\`\`\`env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Optional: For production deployment
# NEXT_PUBLIC_API_URL=https://your-backend-api.com/api
\`\`\`

### 4. Run the Development Server

\`\`\`bash
npm run dev
# or
yarn dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔧 Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:5000/api` |

### Optional Variables

| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `NODE_ENV` | Environment mode | `development` | `production` |
| `PORT` | Frontend port | `3000` | `3000` |

## 🗄️ Backend Setup

This frontend requires a compatible backend API. The backend should provide the following endpoints:

### Authentication Endpoints
\`\`\`
POST /api/auth/login
POST /api/auth/register
GET  /api/auth/me
PUT  /api/auth/change-password
\`\`\`

### Task Management Endpoints
\`\`\`
GET    /api/tasks
POST   /api/tasks
PUT    /api/tasks/:id
DELETE /api/tasks/:id
\`\`\`

### Time Tracking Endpoints
\`\`\`
POST   /api/tasks/:id/time/start
POST   /api/tasks/:id/time/stop
POST   /api/tasks/:id/time/manual
PUT    /api/tasks/:id/time/:entryId
DELETE /api/tasks/:id/time/:entryId
\`\`\`

### User Management Endpoints
\`\`\`
GET    /api/users
PUT    /api/users/:id
PUT    /api/users/:id/role
DELETE /api/users/:id
\`\`\`

### Dashboard & Reports Endpoints
\`\`\`
GET /api/dashboard/employee
GET /api/dashboard/manager
GET /api/dashboard/admin
GET /api/reports/time
GET /api/reports/time/export
\`\`\`

### Expected Data Models

#### User Model
\`\`\`typescript
interface User {
  _id: string
  username: string
  email: string
  firstName: string
  lastName: string
  role: "employee" | "manager" | "admin"
  isActive: boolean
  createdAt: string
}
\`\`\`

#### Task Model
\`\`\`typescript
interface Task {
  _id: string
  title: string
  description: string
  status: "Pending" | "In Progress" | "Completed"
  priority: "Low" | "Medium" | "High"
  dueDate: string
  estimatedHours?: number
  totalTimeSpent: number
  assignedTo: User
  createdBy: User
  timeEntries: TimeEntry[]
}
\`\`\`

#### Time Entry Model
\`\`\`typescript
interface TimeEntry {
  _id: string
  taskId: string
  userId: string
  description: string
  startTime: string
  endTime?: string
  duration: number // in minutes
  isActive: boolean
  createdAt: string
  user: User
}
\`\`\`

## 🏗️ Project Structure

\`\`\`
task-management-frontend/
├── app/                          # Next.js App Router pages
│   ├── admin/                    # Admin-only pages
│   │   ├── dashboard/
│   │   ├── tasks/
│   │   └── users/
│   ├── employee/                 # Employee pages
│   │   ├── dashboard/
│   │   └── tasks/
│   ├── manager/                  # Manager pages
│   │   ├── dashboard/
│   │   ├── tasks/
│   │   └── users/
│   ├── login/
│   ├── register/
│   ├── profile/
│   ├── reports/
│   ├── unauthorized/
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Home page (redirects to login)
│   └── globals.css              # Global styles
├── components/                   # Reusable components
│   ├── layout/                  # Layout components
│   │   ├── header.tsx
│   │   └── sidebar.tsx
│   ├── time-tracking/           # Time tracking components
│   │   ├── time-tracker.tsx
│   │   └── time-reports.tsx
│   ├── ui/                      # shadcn/ui components
│   ├── mode-toggle.tsx          # Dark mode toggle
│   ├── protected-route.tsx      # Route protection
│   └── theme-provider.tsx       # Theme provider
├── contexts/                     # React contexts
│   └── auth-context.tsx         # Authentication context
├── hooks/                        # Custom hooks
│   └── use-toast.ts             # Toast notifications
├── lib/                          # Utility libraries
│   ├── api-client.ts            # Axios configuration
│   └── utils.ts                 # Utility functions
├── types/                        # TypeScript type definitions
│   └── time-tracking.ts         # Time tracking types
├── .env.local                   # Environment variables
├── next.config.mjs              # Next.js configuration
├── package.json                 # Dependencies
├── tailwind.config.ts           # Tailwind configuration
└── tsconfig.json                # TypeScript configuration
\`\`\`

## 👥 User Roles & Permissions

### Employee
- View personal dashboard with task metrics
- Manage assigned tasks (view, update status)
- Track time on tasks (start/stop timer, manual entries)
- View personal time reports
- Update profile information

### Manager
- All employee permissions
- View team dashboard with team metrics
- Assign tasks to team members
- Manage team member accounts (activate/deactivate)
- View team time reports and analytics
- Export time reports

### Admin
- All manager permissions
- View system-wide dashboard with all metrics
- Manage all users across the organization
- Create tasks and assign to any user
- Change user roles and permissions
- Access comprehensive system analytics
- Full user management capabilities

## 🎨 UI Components

The application uses [shadcn/ui](https://ui.shadcn.com/) components for a consistent and accessible design:

- **Forms**: Input, Textarea, Select, Button
- **Layout**: Card, Dialog, Sheet, Tabs
- **Feedback**: Toast, Alert, Badge
- **Data Display**: Table, Avatar, Separator
- **Navigation**: Breadcrumb, Dropdown Menu

## 🔒 Security Features

- **JWT Token Authentication** - Secure token-based authentication
- **Role-Based Access Control** - Route protection based on user roles
- **Automatic Token Refresh** - Handles token expiration gracefully
- **Protected API Calls** - All API requests include authentication headers
- **Input Validation** - Client-side validation for all forms
- **XSS Protection** - Sanitized user inputs and outputs

## 📱 Responsive Design

The application is fully responsive and works on:
- **Desktop** (1024px and above)
- **Tablet** (768px - 1023px)
- **Mobile** (320px - 767px)

Key responsive features:
- Collapsible sidebar on mobile
- Responsive grid layouts
- Touch-friendly controls
- Optimized typography scaling

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically on push

### Docker

\`\`\`dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
\`\`\`

### Manual Deployment

\`\`\`bash
# Build the application
npm run build

# Start the production server
npm start
\`\`\`

## 🧪 Development

### Available Scripts

\`\`\`bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type checking
npm run type-check

# Linting
npm run lint

# Format code
npm run format
\`\`\`

### Code Quality

The project includes:
- **TypeScript** for type safety
- **ESLint** for code linting
- **Prettier** for code formatting
- **Husky** for git hooks (if configured)

## 🐛 Troubleshooting

### Common Issues

1. **API Connection Failed**
   - Check if backend server is running
   - Verify `NEXT_PUBLIC_API_URL` in `.env.local`
   - Check network connectivity

2. **Authentication Issues**
   - Clear browser localStorage
   - Check token expiration
   - Verify backend authentication endpoints

3. **Build Errors**
   - Clear `.next` folder: `rm -rf .next`
   - Reinstall dependencies: `rm -rf node_modules && npm install`
   - Check TypeScript errors: `npm run type-check`

4. **Styling Issues**
   - Clear Tailwind cache
   - Check for conflicting CSS classes
   - Verify component imports

### Debug Mode

Enable debug logging by setting:
\`\`\`env
NODE_ENV=development
\`\`\`

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review the documentation

## 🔄 Version History

- **v1.0.0** - Initial release with basic task management
- **v1.1.0** - Added time tracking functionality
- **v1.2.0** - Enhanced reporting and analytics
- **v1.3.0** - Improved user management and permissions

---

**Built with ❤️ using Next.js 15 and shadcn/ui**
