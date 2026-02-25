"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Target, 
  Clock, 
  CheckCircle, 
  BarChart3,
  Calendar,
  Activity,
  Award,
  Zap,
  PieChart
} from "lucide-react";

interface PerformanceMetricsProps {
  teamId: string;
}

export function PerformanceMetrics({ teamId }: PerformanceMetricsProps) {
  // Mock performance data
  const performanceData = {
    overallScore: 92,
    velocity: 8.2,
    accuracy: 94,
    efficiency: 88,
    collaboration: 96,
    deadlines: 90,
    quality: 95,
    innovation: 85
  };

  const trends = [
    { metric: "Velocity", current: 8.2, previous: 7.8, change: "+5.1%", positive: true },
    { metric: "Accuracy", current: 94, previous: 92, change: "+2.2%", positive: true },
    { metric: "Efficiency", current: 88, previous: 85, change: "+3.5%", positive: true },
    { metric: "Collaboration", current: 96, previous: 94, change: "+2.1%", positive: true },
    { metric: "Deadlines", current: 90, previous: 88, change: "+2.3%", positive: true },
    { metric: "Quality", current: 95, previous: 93, change: "+2.2%", positive: true }
  ];

  const teamMetrics = [
    { name: "Mark", role: "Project Manager", score: 95, tasksCompleted: 24, efficiency: 92 },
    { name: "Sarah Chen", role: "Lead Developer", score: 96, tasksCompleted: 18, efficiency: 94 },
    { name: "Alex Rodriguez", role: "UI/UX Designer", score: 93, tasksCompleted: 15, efficiency: 89 },
    { name: "Jamie Wilson", role: "Marketing Strategist", score: 91, tasksCompleted: 20, efficiency: 87 },
    { name: "Taylor Kim", role: "Sales Lead", score: 94, tasksCompleted: 12, efficiency: 90 },
    { name: "Morgan Lee", role: "Content Creator", score: 90, tasksCompleted: 16, efficiency: 85 },
    { name: "Jordan Patel", role: "QA Engineer", score: 92, tasksCompleted: 14, efficiency: 88 },
    { name: "Casey Brooks", role: "DevOps Engineer", score: 93, tasksCompleted: 10, efficiency: 91 }
  ];

  const recentAchievements = [
    { title: "Project Alpha Launch", date: "2026-02-24", impact: "High" },
    { title: "Client Satisfaction 98%", date: "2026-02-22", impact: "High" },
    { title: "Team Velocity +12%", date: "2026-02-20", impact: "Medium" },
    { title: "Bug Rate Reduced 40%", date: "2026-02-18", impact: "High" },
    { title: "New Client Acquisition", date: "2026-02-15", impact: "Medium" }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Performance Analytics</h2>
          <p className="text-muted-foreground">
            Comprehensive metrics and insights for Mark's Team
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Last 30 Days
          </Button>
          <Button>
            <BarChart3 className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Overall Score */}
      <Card>
        <CardHeader>
          <CardTitle>Overall Performance Score</CardTitle>
          <CardDescription>
            Composite score based on velocity, accuracy, efficiency, collaboration, deadlines, and quality
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex flex-col items-center">
              <div className="relative h-48 w-48">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-5xl font-bold">{performanceData.overallScore}</div>
                    <div className="text-sm text-muted-foreground">out of 100</div>
                  </div>
                </div>
                <svg className="h-48 w-48" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="8"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="8"
                    strokeDasharray={`${(performanceData.overallScore / 100) * 283} 283`}
                    strokeLinecap="round"
                    transform="rotate(-90 50 50)"
                  />
                </svg>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-600">+3.2% from last month</span>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 flex-1">
              {Object.entries(performanceData).filter(([key]) => key !== "overallScore").map(([key, value]) => (
                <Card key={key}>
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center">
                      <div className="text-2xl font-bold">{value}{key === "velocity" ? "" : "%"}</div>
                      <div className="text-sm font-medium capitalize mt-1">{key}</div>
                      <div className="mt-2">
                        {value >= 90 ? (
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Excellent</Badge>
                        ) : value >= 80 ? (
                          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Good</Badge>
                        ) : (
                          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Needs Improvement</Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Performance Trends</CardTitle>
            <CardDescription>
              Month-over-month changes in key metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {trends.map((trend) => (
                <div key={trend.metric} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${trend.positive ? 'bg-green-100' : 'bg-red-100'}`}>
                      {trend.positive ? (
                        <TrendingUp className="h-5 w-5 text-green-600" />
                      ) : (
                        <TrendingDown className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium">{trend.metric}</div>
                      <div className="text-sm text-muted-foreground">
                        Current: {trend.current}{trend.metric === "Velocity" ? "" : "%"}
                      </div>
                    </div>
                  </div>
                  <div className={`text-sm font-medium ${trend.positive ? 'text-green-600' : 'text-red-600'}`}>
                    {trend.change}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Team Member Performance</CardTitle>
            <CardDescription>
              Individual scores and efficiency ratings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {teamMetrics.map((member) => (
                <div key={member.name} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium">{member.name}</div>
                      <div className="text-sm text-muted-foreground">{member.role}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-bold">{member.score}%</div>
                      <div className="text-xs text-muted-foreground">Score</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{member.tasksCompleted}</div>
                      <div className="text-xs text-muted-foreground">Tasks</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{member.efficiency}%</div>
                      <div className="text-xs text-muted-foreground">Efficiency</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Achievements */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Achievements</CardTitle>
          <CardDescription>
            Team accomplishments and milestones
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentAchievements.map((achievement, index) => (
              <Card key={index} className="border-l-4 border-l-green-500">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-bold">{achievement.title}</div>
                      <div className="text-sm text-muted-foreground mt-1">{achievement.date}</div>
                    </div>
                    <Badge className={
                      achievement.impact === "High" ? "bg-green-100 text-green-800" :
                      achievement.impact === "Medium" ? "bg-yellow-100 text-yellow-800" :
                      "bg-blue-100 text-blue-800"
                    }>
                      {achievement.impact} Impact
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    <Award className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm">Team Achievement</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Recommendations</CardTitle>
          <CardDescription>
            Actionable insights to improve team performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-50">
              <Zap className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <div className="font-medium">Increase Innovation Focus</div>
                <div className="text-sm text-muted-foreground mt-1">
                  Innovation score (85%) is the lowest metric. Consider allocating dedicated time for creative brainstorming sessions.
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-lg bg-green-50">
              <Activity className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <div className="font-medium">Maintain Collaboration Excellence</div>
                <div className="text-sm text-muted-foreground mt-1">
                  Collaboration score (96%) is outstanding. Continue regular team syncs and cross-functional meetings.
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-lg bg-yellow-50">
              <Target className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <div className="font-medium">Improve Efficiency Consistency</div>
                <div className="text-sm text-muted-foreground mt-1">
                  Efficiency varies across team members. Consider implementing standardized workflows and tools.
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}