"use client"

import { useEffect, useState } from "react"
import { apiClient } from "@/lib/api-client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckSquare, Users, TrendingUp, BarChart3, Shield, Activity } from "lucide-react"

interface User {
  completedTasks: number;
  name: string;
  _id: string;
}

interface AdminDashboardData {
  systemOverview: {
    totalTasks: number;
    totalUsers: number;
    recentTask: number;
    recentUser: number;
  };
  taskStats: {
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
  };
  topPerformers:User[]
  userRoles: {
    admins: number;
    managers: number;
    employees: number;
  };
  
}

export default function AdminDashboard() {
  const [data, setData] = useState<AdminDashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  console.log(data)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await apiClient.get("/dashboard/admin")
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">System overview and analytics</p>
      </div>

      {/* Main Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.systemOverview.totalUsers}</div>
            <p className="text-xs text-muted-foreground">{data?.systemOverview.recentUser} active users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.systemOverview.totalTasks}</div>
          </CardContent>
        </Card>


      </div>

      {/* Detailed Analytics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Users by Role</CardTitle>
            <CardDescription>Distribution of user roles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-red-500" />
                  <span className="text-sm">Admins</span>
                </div>
                <span className="font-bold">{data?.userRoles?.admins}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">Managers</span>
                </div>
                <span className="font-bold">{data?.userRoles.managers}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Employees</span>
                </div>
                <span className="font-bold">{data?.userRoles?.employees}</span>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>

  

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Top performers</CardTitle>
          <CardDescription>Latest actions across the system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data?.topPerformers?.map((activity) => (
              <div key={activity._id} className="flex items-center space-x-4 p-3 border rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.name}</p>
                  <p className="text-xs text-gray-500">
                    Completed Tasks {activity.completedTasks}  •{" "}xw
                  </p>
                </div>
          
              </div>
            )) || <p className="text-center text-gray-500 py-4">No recent activity</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
