"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, MoreVertical, User } from "lucide-react";

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

export function KanbanBoard() {
  const columns: Column[] = [
    {
      id: "todo",
      title: "To Do",
      tasks: [
        {
          id: "1",
          title: "Design Review",
          description: "Review new dashboard designs",
          assignee: "Alex Chen",
          priority: "high",
        },
        {
          id: "2",
          title: "Documentation",
          description: "Update API documentation",
          assignee: "Sam Rivera",
          priority: "medium",
        },
      ],
    },
    {
      id: "in-progress",
      title: "In Progress",
      tasks: [
        {
          id: "3",
          title: "Authentication Flow",
          description: "Implement new auth system",
          assignee: "Jordan Lee",
          priority: "high",
        },
      ],
    },
    {
      id: "review",
      title: "Review",
      tasks: [
        {
          id: "4",
          title: "Performance Testing",
          description: "Run load tests on new features",
          assignee: "Taylor Kim",
          priority: "medium",
        },
      ],
    },
    {
      id: "done",
      title: "Done",
      tasks: [
        {
          id: "5",
          title: "Mobile Responsive",
          description: "Fix mobile layout issues",
          assignee: "Casey Morgan",
          priority: "low",
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

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Project Tasks</h2>
          <p className="text-sm text-muted-foreground">Drag and drop tasks between columns</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                        <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center">
                          <User className="h-3 w-3" />
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