"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Plus, 
  Search, 
  Filter, 
  Users, 
  Calendar, 
  FileText,
  MoreVertical,
  ArrowUpRight,
  User,
  LogOut
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const projects = [
  { 
    id: 1, 
    name: "GuardianCryo", 
    description: "Cryogenic shipping and storage solutions for fertility clinics",
    status: "active", 
    progress: 0,
    team: 0,
    dueDate: "No deadline set",
    tasks: 0,
    completed: 0,
    features: ["Kanban Board", "Notes", "Parking Lot", "Shipping Requests"],
    color: {
      primary: "#0D9488", // Teal
      secondary: "#14B8A6",
      light: "#F0FDFA",
      dark: "#0F766E"
    }
  },
  { 
    id: 2, 
    name: "CDL Schools", 
    description: "Commercial Driver's License training and certification platform",
    status: "active", 
    progress: 0,
    team: 0,
    dueDate: "No deadline set",
    tasks: 0,
    completed: 0,
    features: ["Kanban Board", "Notes", "Parking Lot", "Partner Management"],
    color: {
      primary: "#1E40AF", // Deep blue
      secondary: "#3B82F6",
      light: "#EFF6FF",
      dark: "#1E3A8A"
    }
  },
  { 
    id: 3, 
    name: "Apply Intelligent", 
    description: "AI-powered college application platform with predictive analytics",
    status: "active", 
    progress: 0,
    team: 0,
    dueDate: "No deadline set",
    tasks: 0,
    completed: 0,
    features: ["Kanban Board", "Notes", "Parking Lot", "AI Analytics"],
    color: {
      primary: "#7C3AED", // Purple
      secondary: "#8B5CF6",
      light: "#F5F3FF",
      dark: "#6D28D9"
    }
  },
  { 
    id: 4, 
    name: "SchoolRegistry", 
    description: "Nigerian school registry and accreditation platform",
    status: "active", 
    progress: 0,
    team: 0,
    dueDate: "No deadline set",
    tasks: 0,
    completed: 0,
    features: ["Kanban Board", "Notes", "Parking Lot", "School Management"],
    color: {
      primary: "#059669", // Emerald green
      secondary: "#10B981",
      light: "#ECFDF5",
      dark: "#047857"
    }
  },
];

export default function ProjectsPage() {
  const [isDemoUser, setIsDemoUser] = useState(false);
  const [demoEmail, setDemoEmail] = useState("");

  useEffect(() => {
    // Check if user is logged in via demo auth
    const demoAuth = localStorage.getItem('demo_auth');
    const demoUser = localStorage.getItem('demo_user');
    
    if (demoAuth === 'true' && demoUser) {
      setIsDemoUser(true);
      setDemoEmail(demoUser);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('demo_auth');
    localStorage.removeItem('demo_user');
    setIsDemoUser(false);
    setDemoEmail("");
    window.location.href = '/auth/login';
  };

  return (
    <div className="space-y-6">
      {/* Demo Auth Banner */}
      {isDemoUser && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 p-2 rounded-full">
                <User className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-green-800">Demo Account Active</p>
                <p className="text-sm text-green-600">Logged in as: {demoEmail}</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleLogout}
              className="border-green-300 text-green-700 hover:bg-green-100"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">
            Manage and track all your projects in one place
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline">Sort by: Newest</Button>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Card key={project.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {project.name}
                    <Badge 
                      className="text-xs border-0"
                      style={{ 
                        backgroundColor: project.color.light,
                        color: project.color.dark,
                        borderColor: project.color.primary
                      }}
                    >
                      {project.status}
                    </Badge>
                  </CardTitle>
                  <CardDescription className="mt-2 line-clamp-2">
                    {project.description}
                  </CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Edit Project</DropdownMenuItem>
                    <DropdownMenuItem>Duplicate</DropdownMenuItem>
                    <DropdownMenuItem>Archive</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span className="font-medium">{project.progress}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div 
                    className="h-full transition-all duration-300"
                    style={{ 
                      width: `${project.progress}%`,
                      backgroundColor: project.color.primary
                    }}
                  />
                </div>
              </div>

              {/* Project Stats */}
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{project.team}</p>
                    <p className="text-xs text-muted-foreground">Team</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">
                      {project.completed}/{project.tasks}
                    </p>
                    <p className="text-xs text-muted-foreground">Tasks</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{project.dueDate}</p>
                    <p className="text-xs text-muted-foreground">Due Date</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div 
                    className="h-4 w-4 rounded-full flex items-center justify-center"
                    style={{ 
                      backgroundColor: `${project.color.primary}20`
                    }}
                  >
                    <ArrowUpRight 
                      className="h-3 w-3"
                      style={{ color: project.color.primary }}
                    />
                  </div>
                  <div>
                    <p 
                      className="text-sm font-medium"
                      style={{ color: project.color.primary }}
                    >
                      {Math.round((project.completed / project.tasks) * 100)}%
                    </p>
                    <p className="text-xs text-muted-foreground">Complete</p>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="mt-4">
                <p className="text-sm font-medium mb-2">Features:</p>
                <div className="flex flex-wrap gap-1">
                  {project.features?.map((feature, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1" 
                  size="sm"
                  onClick={() => {
                    const projectPath = project.name.toLowerCase().replace(/\s+/g, '-');
                    window.location.href = `/projects/${projectPath}`;
                  }}
                >
                  View Details
                </Button>
                <Button 
                  className="flex-1" 
                  size="sm"
                  style={{ 
                    backgroundColor: project.color.primary,
                    borderColor: project.color.primary
                  }}
                  onClick={() => {
                    const projectPath = project.name.toLowerCase().replace(/\s+/g, '-');
                    window.location.href = `/projects/${projectPath}`;
                  }}
                >
                  Open Board
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State for more projects */}
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="rounded-full border p-3 mb-4">
            <Plus className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Create New Project</h3>
          <p className="text-sm text-muted-foreground text-center mb-4 max-w-md">
            Start a new project to organize tasks, assign team members, and track progress.
          </p>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Project
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}