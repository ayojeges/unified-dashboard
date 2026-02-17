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
  ArrowUpRight
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
    name: "Website Redesign", 
    description: "Complete overhaul of company website with modern design",
    status: "active", 
    progress: 75,
    team: 4,
    dueDate: "2024-04-15",
    tasks: 24,
    completed: 18
  },
  { 
    id: 2, 
    name: "Mobile App Development", 
    description: "Native iOS and Android application for customer engagement",
    status: "active", 
    progress: 45,
    team: 6,
    dueDate: "2024-05-30",
    tasks: 48,
    completed: 22
  },
  { 
    id: 3, 
    name: "Marketing Campaign", 
    description: "Q2 digital marketing campaign across social media platforms",
    status: "completed", 
    progress: 100,
    team: 3,
    dueDate: "2024-03-01",
    tasks: 32,
    completed: 32
  },
  { 
    id: 4, 
    name: "API Integration", 
    description: "Third-party API integration for payment processing",
    status: "active", 
    progress: 60,
    team: 2,
    dueDate: "2024-04-30",
    tasks: 18,
    completed: 11
  },
  { 
    id: 5, 
    name: "Data Migration", 
    description: "Migration from legacy database to cloud infrastructure",
    status: "on-hold", 
    progress: 30,
    team: 5,
    dueDate: "2024-06-15",
    tasks: 42,
    completed: 13
  },
  { 
    id: 6, 
    name: "User Research", 
    description: "Comprehensive user research for product improvement",
    status: "planning", 
    progress: 15,
    team: 3,
    dueDate: "2024-05-01",
    tasks: 28,
    completed: 4
  },
];

export default function ProjectsPage() {
  return (
    <div className="space-y-6">
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
                      variant={
                        project.status === "active" ? "default" :
                        project.status === "completed" ? "secondary" :
                        project.status === "on-hold" ? "outline" : "secondary"
                      }
                      className="text-xs"
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
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${project.progress}%` }}
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
                  <div className="h-4 w-4 rounded-full bg-primary/20 flex items-center justify-center">
                    <ArrowUpRight className="h-3 w-3 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {Math.round((project.completed / project.tasks) * 100)}%
                    </p>
                    <p className="text-xs text-muted-foreground">Complete</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex gap-2">
                <Button variant="outline" className="flex-1" size="sm">
                  View Details
                </Button>
                <Button className="flex-1" size="sm">
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