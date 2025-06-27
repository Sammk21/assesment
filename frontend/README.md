# Task Management System

A comprehensive task management system built with Next.js 15, featuring role-based authentication, time tracking, and advanced reporting capabilities.

## Features

### Core Functionality
- **Role-Based Authentication** - Employee, Manager, and Admin roles with different permissions
- **Task Management** - Create, assign, update, and track tasks with priorities and due dates
- **Time Tracking** - Built-in timer, manual time entry, and comprehensive reporting
- **User Management** - Admin and manager controls for user administration
- **Dashboard Analytics** - Role-specific dashboards with key metrics and insights
- **Responsive Design** - Works seamlessly on desktop and mobile devices

### Advanced Features
- **Protected Routes** - Secure access based on user roles
- **Toast Notifications** - User-friendly feedback for all actions

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Theme**: next-themes for dark mode support

## Prerequisites

Before running this application, make sure you have:

- **Node.js** (version 18.0 or higher)
- **npm** or **yarn** package manager
- **Backend API** running (see Backend Setup section)

## Quick Start

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
NEXT_PUBLIC_API_URL=http://localhost:3001/api

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


