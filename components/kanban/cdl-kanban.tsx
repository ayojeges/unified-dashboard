"use client";

import { EnhancedKanbanBoard } from "./enhanced-kanban-board";

export function CDLKanban() {
  return <EnhancedKanbanBoard />;
}
          assignee: "Product Team",
          priority: "medium",
        },
        {
          id: "2",
          title: "State Certification Updates",
          description: "Track upcoming changes to state CDL requirements",
          assignee: "Compliance",
          priority: "low",
        },
        {
          id: "3",
          title: "Partner School Expansion",
          description: "Identify potential partner schools in Midwest",
          assignee: "Business Development",
          priority: "medium",
        },
        {
          id: "4",
          title: "Mobile App Development",
          description: "Plan CDL practice test mobile app",
          assignee: "Engineering",
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
          title: "Texas DMV Partnership",
          description: "Schedule meeting with Texas DMV officials",
          assignee: "Partnerships",
          priority: "high",
        },
        {
          id: "6",
          title: "Curriculum Update",
          description: "Update hazmat training materials",
          assignee: "Curriculum Team",
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
          title: "Website Redesign",
          description: "Implement new homepage and course pages",
          assignee: "Design Team",
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
          title: "Financial Aid Documentation",
          description: "Review updated financial aid application forms",
          assignee: "Finance",
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
          title: "Instructor Certification",
          description: "Completed certification for 5 new instructors",
          assignee: "HR",
          priority: "low",
        },
        {
          id: "10",
          title: "Truck Fleet Maintenance",
          description: "Completed quarterly maintenance on training trucks",
          assignee: "Operations",
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
    if (title.includes("Course") || title.includes("Curriculum")) return <BookOpen className="h-3 w-3" />;
    if (title.includes("Truck") || title.includes("Fleet")) return <Car className="h-3 w-3" />;
    if (title.includes("Instructor") || title.includes("Partner")) return <Users className="h-3 w-3" />;
    if (title.includes("Financial") || title.includes("DMV")) return <DollarSign className="h-3 w-3" />;
    return <GraduationCap className="h-3 w-3" />;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">CDL Schools Tasks</h2>
          <p className="text-sm text-muted-foreground">Driver training and certification workflow</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Training Task
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
                        <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
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