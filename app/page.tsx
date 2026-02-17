"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Users, 
  Package, 
  GraduationCap, 
  Brain,
  Calendar,
  MessageSquare,
  BarChart3,
  ArrowUpRight,
  Clock,
  CheckCircle
} from "lucide-react";

export default function DashboardPage() {
  const projects = [
    { 
      name: "GuardianCryo", 
      description: "Cryogenic shipping solutions",
      progress: 65,
      tasks: 42,
      completed: 27,
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    { 
      name: "CDL Schools", 
      description: "Driver training platform",
      progress: 80,
      tasks: 56,
      completed: 45,
      icon: GraduationCap,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    { 
      name: "Apply Intelligent", 
      description: "College application AI",
      progress: 40,
      tasks: 78,
      completed: 31,
      icon: Brain,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    },
  ];

  const stats = [
    { label: "Total Projects", value: "3", icon: Package, change: "+0%", trend: "neutral", color: "text-blue-600", bgColor: "bg-blue-100" },
    { label: "Active Tasks", value: "176", icon: Clock, change: "+12%", trend: "up", color: "text-yellow-600", bgColor: "bg-yellow-100" },
    { label: "Completion Rate", value: "92%", icon: CheckCircle, change: "+5%", trend: "up", color: "text-green-600", bgColor: "bg-green-100" },
    { label: "Team Members", value: "12", icon: Users, change: "+2", trend: "up", color: "text-purple-600", bgColor: "bg-purple-100" },
  ];

  const recentActivity = [
    { project: "GuardianCryo", action: "Shipping protocol updated", time: "2 hours ago", user: "Ayo" },
    { project: "CDL Schools", action: "New partner onboarded", time: "4 hours ago", user: "Debby" },
    { project: "Apply Intelligent", action: "AI model deployed", time: "1 day ago", user: "Akan" },
    { project: "GuardianCryo", action: "Client meeting scheduled", time: "1 day ago", user: "Ayo" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
          <p className="text-muted-foreground">
            Welcome back! Here&apos;s what&apos;s happening with your projects.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Schedule
          </Button>
          <Button>
            <MessageSquare className="mr-2 h-4 w-4" />
            New Message
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold mt-2">{stat.value}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className={`text-xs font-medium ${
                      stat.trend === "up" ? "text-green-600" : 
                      stat.trend === "down" ? "text-red-600" : "text-gray-600"
                    }`}>
                      {stat.change}
                    </span>
                    {stat.trend === "up" && <ArrowUpRight className="h-3 w-3 text-green-600" />}
                  </div>
                </div>
                <div className={`h-12 w-12 rounded-lg ${stat.bgColor || "bg-gray-100"} flex items-center justify-center`}>
                  <stat.icon className={`h-6 w-6 ${stat.color || "text-gray-600"}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Projects Overview */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Projects Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Project Progress</CardTitle>
            <CardDescription>
              Current status across all projects
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {projects.map((project) => (
              <div key={project.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-lg ${project.bgColor} flex items-center justify-center`}>
                      <project.icon className={`h-5 w-5 ${project.color}`} />
                    </div>
                    <div>
                      <h3 className="font-medium">{project.name}</h3>
                      <p className="text-sm text-muted-foreground">{project.description}</p>
                    </div>
                  </div>
                  <Badge variant="outline">{project.progress}%</Badge>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span className="font-medium">{project.completed}/{project.tasks} tasks</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${project.color.replace("text-", "bg-")}`}
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest updates across all projects
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center mt-1">
                    <span className="text-xs font-medium">
                      {activity.user.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{activity.action}</p>
                      <span className="text-xs text-muted-foreground">{activity.time}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {activity.project}
                      </Badge>
                      <span className="text-xs text-muted-foreground">by {activity.user}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common tasks and shortcuts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="h-auto py-4 flex-col gap-2">
              <Package className="h-6 w-6" />
              <span>New Shipment</span>
              <span className="text-xs text-muted-foreground">GuardianCryo</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2">
              <GraduationCap className="h-6 w-6" />
              <span>Add Partner</span>
              <span className="text-xs text-muted-foreground">CDL Schools</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2">
              <Brain className="h-6 w-6" />
              <span>Run Analysis</span>
              <span className="text-xs text-muted-foreground">Apply Intelligent</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2">
              <BarChart3 className="h-6 w-6" />
              <span>View Reports</span>
              <span className="text-xs text-muted-foreground">Analytics</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}