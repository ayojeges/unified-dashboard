"use client";

import { useState, useEffect } from "react";
import { EnhancedKanbanBoard } from "@/components/kanban/enhanced-kanban-board";
import { TeamProfiles } from "@/components/team/team-profiles";
import { RealTimeChat } from "@/components/chat/real-time-chat";
import { PerformanceMetrics } from "@/components/analytics/performance-metrics";
import { DocumentationHub } from "@/components/docs/documentation-hub";
import { ProjectBoard } from "@/components/project-board";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  Users,
  MessageSquare,
  BarChart,
  FileText,
  Kanban,
  Target,
  Calendar,
  CheckCircle,
  Clock,
  ArrowLeft,
  TrendingUp,
  UserPlus,
  Settings
} from "lucide-react";

// Team members data
const teamMembers = [
  {
    id: 1,
    name: "Mark",
    role: "Project Manager",
    email: "mark@blueprintcreations.com",
    avatar: "M",
    skills: ["Leadership", "Strategy", "Project Management", "Client Relations"],
    responsibilities: ["Team Coordination", "Quality Control", "Client Communication", "Timeline Management"],
    activeTasks: 8,
    completedTasks: 24,
    status: "online",
    color: "#DC2626"
  },
  {
    id: 2,
    name: "Sarah Chen",
    role: "Lead Developer",
    email: "sarah@blueprintcreations.com",
    avatar: "S",
    skills: ["React", "TypeScript", "Next.js", "Node.js", "AWS"],
    responsibilities: ["Technical Architecture", "Code Review", "Team Mentoring", "Deployment"],
    activeTasks: 6,
    completedTasks: 18,
    status: "online",
    color: "#3B82F6"
  },
  {
    id: 3,
    name: "Alex Rodriguez",
    role: "UI/UX Designer",
    email: "alex@blueprintcreations.com",
    avatar: "A",
    skills: ["Figma", "User Research", "Prototyping", "Design Systems"],
    responsibilities: ["User Experience", "Visual Design", "Design System", "User Testing"],
    activeTasks: 5,
    completedTasks: 15,
    status: "online",
    color: "#8B5CF6"
  },
  {
    id: 4,
    name: "Jamie Wilson",
    role: "Marketing Strategist",
    email: "jamie@blueprintcreations.com",
    avatar: "J",
    skills: ["Content Strategy", "SEO", "Social Media", "Analytics"],
    responsibilities: ["Marketing Campaigns", "Content Creation", "Brand Strategy", "Lead Generation"],
    activeTasks: 7,
    completedTasks: 20,
    status: "away",
    color: "#10B981"
  },
  {
    id: 5,
    name: "Taylor Kim",
    role: "Sales Lead",
    email: "taylor@blueprintcreations.com",
    avatar: "T",
    skills: ["Sales Strategy", "CRM", "Negotiation", "Client Onboarding"],
    responsibilities: ["Sales Pipeline", "Client Acquisition", "Revenue Growth", "Partnerships"],
    activeTasks: 4,
    completedTasks: 12,
    status: "online",
    color: "#F59E0B"
  },
  {
    id: 6,
    name: "Morgan Lee",
    role: "Content Creator",
    email: "morgan@blueprintcreations.com",
    avatar: "M",
    skills: ["Copywriting", "Video Production", "Storytelling", "Social Media"],
    responsibilities: ["Content Production", "Blog Management", "Video Content", "Social Engagement"],
    activeTasks: 6,
    completedTasks: 16,
    status: "online",
    color: "#EC4899"
  },
  {
    id: 7,
    name: "Jordan Patel",
    role: "QA Engineer",
    email: "jordan@blueprintcreations.com",
    avatar: "J",
    skills: ["Testing", "Automation", "Bug Tracking", "Performance"],
    responsibilities: ["Quality Assurance", "Testing Strategy", "Bug Reports", "Release Management"],
    activeTasks: 5,
    completedTasks: 14,
    status: "offline",
    color: "#6366F1"
  },
  {
    id: 8,
    name: "Casey Brooks",
    role: "DevOps Engineer",
    email: "casey@blueprintcreations.com",
    avatar: "C",
    skills: ["Docker", "Kubernetes", "CI/CD", "Cloud Infrastructure"],
    responsibilities: ["Infrastructure", "Deployment Pipelines", "Monitoring", "Security"],
    activeTasks: 3,
    completedTasks: 10,
    status: "online",
    color: "#14B8A6"
  }
];

export default function MarksTeamPage() {
  const [activeTab, setActiveTab] = useState("kanban");
  const [teamStats, setTeamStats] = useState({
    totalTasks: 42,
    completedTasks: 12,
    inProgress: 18,
    pending: 12,
    teamVelocity: 8.2,
    satisfactionScore: 92
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => window.location.href = "/projects"}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Projects
          </Button>
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">Mark's Team</h1>
            <p className="text-muted-foreground">
              World-class project team with 5-layer structure: Ideation, Development, Marketing, Sales, Creative
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Add Team Member
          </Button>
          <Button variant="outline">
            <Settings className="mr-2 h-4 w-4" />
            Team Settings
          </Button>
        </div>
      </div>

      {/* Team Stats */}
      <div className="grid gap-3 grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Team Members</p>
                <p className="text-2xl font-bold">{teamMembers.length}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                <Users className="h-5 w-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Tasks</p>
                <p className="text-2xl font-bold">{teamStats.totalTasks}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Target className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">{teamStats.completedTasks}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold">{teamStats.inProgress}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Team Velocity</p>
                <p className="text-2xl font-bold">{teamStats.teamVelocity}</p>
                <p className="text-xs text-muted-foreground">tasks/week</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Satisfaction</p>
                <p className="text-2xl font-bold">{teamStats.satisfactionScore}%</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-pink-100 flex items-center justify-center">
                <Users className="h-5 w-5 text-pink-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-5 lg:grid-cols-8">
          <TabsTrigger value="kanban" className="flex items-center gap-2">
            <Kanban className="h-4 w-4" />
            <span className="hidden sm:inline">Kanban Board</span>
          </TabsTrigger>
          <TabsTrigger value="team" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Team Profiles</span>
          </TabsTrigger>
          <TabsTrigger value="chat" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Real-time Chat</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            <span className="hidden sm:inline">Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="docs" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Documentation</span>
          </TabsTrigger>
        </TabsList>

        {/* Kanban Board Tab */}
        <TabsContent value="kanban" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Enhanced Kanban Board</CardTitle>
              <CardDescription>
                Drag-and-drop task management with team assignment and priority tracking
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EnhancedKanbanBoard storageKey="marks-team-kanban" />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Team Profiles Tab */}
        <TabsContent value="team" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Team Member Profiles</CardTitle>
              <CardDescription>
                Skills, responsibilities, and performance metrics for each team member
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TeamProfiles teamMembers={teamMembers} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Real-time Chat Tab */}
        <TabsContent value="chat" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Real-time Team Chat</CardTitle>
                <CardDescription>
                  Monitor and participate in team conversations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RealTimeChat teamId="marks-team" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Online Team Members</CardTitle>
                <CardDescription>
                  Currently active team members
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {teamMembers.filter(member => member.status === "online").map(member => (
                    <div key={member.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted">
                      <div className="flex items-center gap-3">
                        <div 
                          className="h-8 w-8 rounded-full flex items-center justify-center text-white font-medium"
                          style={{ backgroundColor: member.color }}
                        >
                          {member.avatar}
                        </div>
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-xs text-muted-foreground">{member.role}</p>
                        </div>
                      </div>
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <PerformanceMetrics teamId="marks-team" />
        </TabsContent>

        {/* Documentation Tab */}
        <TabsContent value="docs" className="space-y-4">
          <DocumentationHub projectId="marks-team" />
        </TabsContent>
      </Tabs>
    </div>
  );
}