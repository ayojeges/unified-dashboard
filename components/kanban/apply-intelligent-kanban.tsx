"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, MoreVertical, User, Brain, Cpu, Database, LineChart, MessageSquare } from "lucide-react";

interface Task {
  id: string;
  title: string;
  description: string;
  assignee: string;
  priority: "low" | "medium" | "high";
}

interface Column {
  id: string;
  title: string;
  tasks: Task[];
}

export function ApplyIntelligentKanban() {
  const columns: Column[] = [
    {
      id: "backlog",
      title: "Backlog",
      tasks: [
        {
          id: "1",
          title: "AI Model Fine-tuning",
          description: "Fine-tune GPT-4 model on college admission essays",
          assignee: "AI Research",
          priority: "medium",
        },
        {
          id: "2",
          title: "University API Integration",
          description: "Research APIs for 50+ university applications",
          assignee: "Engineering",
          priority: "low",
        },
        {
          id: "3",
          title: "Essay Analysis Dashboard",
          description: "Design dashboard for essay feedback analytics",
          assignee: "Product Team",
          priority: "medium",
        },
        {
          id: "4",
          title: "Scholarship Matching Engine",
          description: "Plan algorithm for matching students with scholarships",
          assignee: "Data Science",
          priority: "low",
        },
      ],
    },
    {
      id: "todo",
      title: "To Do",
      tasks: [
        {
          id: "5",
          title: "College Counselor Portal",
          description: "Design portal for counselor collaboration",
          assignee: "Design Team",
          priority: "high",
        },
        {
          id: "6",
          title: "Data Privacy Compliance",
          description: "Update GDPR and FERPA compliance documentation",
          assignee: "Legal Team",
          priority: "medium",
        },
      ],
    },
    {
      id: "in-progress",
      title: "In Progress",
      tasks: [
        {
          id: "7",
          title: "Application Form Parser",
          description: "Build AI to parse complex application forms",
          assignee: "Engineering",
          priority: "high",
        },
      ],
    },
    {
      id: "review",
      title: "Review",
      tasks: [
        {
          id: "8",
          title: "Essay Scoring Algorithm",
          description: "Review and validate essay scoring metrics",
          assignee: "Quality Assurance",
          priority: "medium",
        },
      ],
    },
    {
      id: "done",
      title: "Done",
      tasks: [
        {
          id: "9",
          title: "User Authentication System",
          description: "Implemented secure login with 2FA",
          assignee: "Security Team",
          priority: "low",
        },
        {
          id: "10",
          title: "Beta Testing Program",
          description: "Launched beta program with 500 students",
          assignee: "Product",
          priority: "medium",
        },
      ],
    },
  ];

  const getPriorityColor = (priority: Task["priority"]) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
    }
  };

  const getTaskIcon = (title: string) => {
    if (title.includes("AI") || title.includes("Model")) return <Cpu className="h-3 w-3" />;
    if (title.includes("Data") || title.includes("Database")) return <Database className="h-3 w-3" />;
    if (title.includes("Dashboard") || title.includes("Analytics")) return <LineChart className="h-3 w-3" />;
    if (title.includes("Portal") || title.includes("Counselor")) return <MessageSquare className="h-3 w-3" />;
    return <Brain className="h-3 w-3" />;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Apply Intelligent Tasks</h2>
          <p className="text-sm text-muted-foreground">College application AI workflow</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add AI Task
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {columns.map((column) => (
          <div key={column.id} className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <h3 className="font-medium">{column.title}</h3>
                <span className="text-xs bg-muted px-2 py-1 rounded-full">
                  {column.tasks.length}
                </span>
              </div>
              <Button variant="ghost" size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-3">
              {column.tasks.map((task) => (
                <Card key={task.id} className="cursor-move hover:shadow-md transition-shadow">
                  <CardHeader className="p-4 pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-sm font-medium">
                        {task.title}
                      </CardTitle>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-2 space-y-3">
                    <p className="text-sm text-muted-foreground">
                      {task.description}
                    </p>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-purple-100 flex items-center justify-center">
                          {getTaskIcon(task.title)}
                        </div>
                        <span className="text-xs">{task.assignee}</span>
                      </div>
                      
                      <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {column.tasks.length === 0 && (
              <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
                <p className="text-sm text-muted-foreground">Drop tasks here</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}