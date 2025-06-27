"use client"

import { useEffect, useState } from "react"
import { apiClient } from "@/lib/api-client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckSquare, Users, Clock, TrendingUp } from "lucide-react"

interface ManagerDashboardData {
  totalTasks: number
  completedTasks: number
  pendingTasks: number
  inProgressTasks: number
  totalUsers: number
  activeUsers: number
  tasksByPriority: {
    high: number
    medium: number
    low: number
  }
  recentTasks: Array<{
    _id: string
    title: string
    status: string
    priority: string
    dueDate: string
    assignedTo: {
      firstName: string
      lastName: string
    }
  }>
}

export default function ManagerDashboard() {
  const [data, setData] = useState<ManagerDashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await apiClient.get("/dashboard/manager")
      setData(response.data)
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (!data) {
    return <div>Failed to load dashboard data</div>
  }

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
      default:
        return "default"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "in progress":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Manager Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">Overview of team tasks and performance metrics</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.totalTasks}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.totalUsers}</div>
            <p className="text-xs text-muted-foreground">{data?.activeUsers} active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{data?.completedTasks}</div>
            <p className="text-xs text-muted-foreground">
              {data?.totalTasks > 0 ? Math.round((data?.completedTasks / data?.totalTasks) * 100) : 0}% completion rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{data?.inProgressTasks}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Tasks by Priority</CardTitle>
            <CardDescription>Distribution of tasks by priority level</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge variant="destructive">High</Badge>
                  <span className="text-sm">Priority</span>
                </div>
                <span className="font-bold">{data?.tasksByPriority?.high}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge variant="default">Medium</Badge>
                  <span className="text-sm">Priority</span>
                </div>
                <span className="font-bold">{data?.tasksByPriority?.medium}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">Low</Badge>
                  <span className="text-sm">Priority</span>
                </div>
                <span className="font-bold">{data?.tasksByPriority?.low}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Task Status Overview</CardTitle>
            <CardDescription>Current status distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Pending</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-500 h-2 rounded-full"
                      style={{ width: `${data?.totalTasks > 0 ? (data?.pendingTasks / data?.totalTasks) * 100 : 0}%` }}
                    ></div>
                  </div>
                  <span className="font-bold">{data?.pendingTasks}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">In Progress</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${data?.totalTasks > 0 ? (data?.inProgressTasks / data?.totalTasks) * 100 : 0}%` }}
                    ></div>
                  </div>
                  <span className="font-bold">{data?.inProgressTasks}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Completed</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${data?.totalTasks > 0 ? (data?.completedTasks / data?.totalTasks) * 100 : 0}%` }}
                    ></div>
                  </div>
                  <span className="font-bold">{data?.completedTasks}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Team Tasks</CardTitle>
          <CardDescription>Latest tasks assigned to team members</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data?.recentTasks?.map((task) => (
              <div key={task._id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <h4 className="font-medium">{task.title}</h4>
                  <div className="flex items-center space-x-2">
                    <Badge variant={getPriorityColor(task.priority)}>{task.priority}</Badge>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                    <span className="text-sm text-gray-500">
                      Assigned to: {task.assignedTo.firstName} {task.assignedTo.lastName}
                    </span>
                  </div>
                </div>
                <div className="text-sm text-gray-500">Due: {new Date(task.dueDate).toLocaleDateString()}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
