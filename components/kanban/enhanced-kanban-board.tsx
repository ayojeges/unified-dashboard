"use client";

import { useState, useEffect } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/simple-select";
import { Plus, MoreVertical, User, GripVertical, Edit, Trash2, Save, X } from "lucide-react";
import { SortableTask } from "./sortable-task";

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

const defaultColumns: Column[] = [
  {
    id: "backlog",
    title: "Backlog",
    tasks: [
      {
        id: "1",
        title: "User Research",
        description: "Conduct interviews with target users",
        assignee: "Research Team",
        priority: "medium",
      },
      {
        id: "2",
        title: "Market Analysis",
        description: "Analyze competitor features and pricing",
        assignee: "Marketing",
        priority: "medium",
      },
      {
        id: "3",
        title: "Technical Debt",
        description: "Refactor legacy authentication code",
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
        id: "4",
        title: "Design Review",
        description: "Review new dashboard designs",
        assignee: "Alex Chen",
        priority: "high",
      },
      {
        id: "5",
        title: "Documentation",
        description: "Update API documentation",
        assignee: "Sam Rivera",
        priority: "medium",
      },
    ],
  },
  {
    id: "inprogress",
    title: "In Progress",
    tasks: [
      {
        id: "6",
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
        id: "7",
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
        id: "8",
        title: "Mobile Responsive",
        description: "Fix mobile layout issues",
        assignee: "Casey Morgan",
        priority: "low",
      },
    ],
  },
];

export function EnhancedKanbanBoard() {
  const [columns, setColumns] = useState<Column[]>([]);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [editingColumn, setEditingColumn] = useState<string | null>(null);
  const [newColumnTitle, setNewColumnTitle] = useState("");
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assignee: "",
    priority: "medium" as "low" | "medium" | "high",
  });
  const [addTaskDialogOpen, setAddTaskDialogOpen] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState<string>("backlog");
  const [isClient, setIsClient] = useState(false);

  // Initialize on client side only
  useEffect(() => {
    setIsClient(true);
    const loadColumns = (): Column[] => {
      try {
        const saved = localStorage.getItem('kanban-board-data');
        if (saved) {
          return JSON.parse(saved);
        }
      } catch (error) {
        console.error('Failed to load kanban data:', error);
      }
      return defaultColumns;
    };
    
    setColumns(loadColumns());
  }, []);

  // Save columns to localStorage (functional update)
  const updateColumns = (updater: (prevColumns: Column[]) => Column[]) => {
    setColumns(prevColumns => {
      const newColumns = updater(prevColumns);
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('kanban-board-data', JSON.stringify(newColumns));
        } catch (error) {
          console.error('Failed to save kanban data:', error);
        }
      }
      return newColumns;
    });
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const taskId = active.id as string;
    
    // Find the task
    for (const column of columns) {
      const task = column.tasks.find(t => t.id === taskId);
      if (task) {
        setActiveTask(task);
        break;
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // If dragging over a column
    if (overId.toString().startsWith('column-')) {
      const columnId = overId.toString().replace('column-', '');
      
      updateColumns(prevColumns => {
        const newColumns = [...prevColumns];
        
        // Find source column and task
        let sourceColumnIndex = -1;
        let taskIndex = -1;
        let task: Task | null = null;
        
        for (let i = 0; i < newColumns.length; i++) {
          const column = newColumns[i];
          const foundIndex = column.tasks.findIndex(t => t.id === activeId);
          if (foundIndex !== -1) {
            sourceColumnIndex = i;
            taskIndex = foundIndex;
            task = column.tasks[foundIndex];
            break;
          }
        }
        
        if (!task || sourceColumnIndex === -1) return prevColumns;
        
        // Remove from source column
        newColumns[sourceColumnIndex].tasks.splice(taskIndex, 1);
        
        // Find target column
        const targetColumnIndex = newColumns.findIndex(c => c.id === columnId);
        if (targetColumnIndex === -1) return prevColumns;
        
        // Add to target column
        newColumns[targetColumnIndex].tasks.push(task);
        
        return newColumns;
      });
    }
  };

  const handleAddTask = () => {
    if (!newTask.title.trim()) return;
    
    const newTaskObj: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      assignee: newTask.assignee,
      priority: newTask.priority,
    };
    
    updateColumns(prevColumns => {
      const newColumns = [...prevColumns];
      const columnIndex = newColumns.findIndex(c => c.id === selectedColumn);
      if (columnIndex !== -1) {
        newColumns[columnIndex].tasks.push(newTaskObj);
      }
      return newColumns;
    });
    
    setNewTask({
      title: "",
      description: "",
      assignee: "",
      priority: "medium",
    });
    setAddTaskDialogOpen(false);
  };

  const handleDeleteTask = (taskId: string) => {
    updateColumns(prevColumns => {
      const newColumns = [...prevColumns];
      for (const column of newColumns) {
        const taskIndex = column.tasks.findIndex(t => t.id === taskId);
        if (taskIndex !== -1) {
          column.tasks.splice(taskIndex, 1);
          break;
        }
      }
      return newColumns;
    });
  };

  const handleEditColumn = (columnId: string) => {
    const column = columns.find(c => c.id === columnId);
    if (column) {
      setNewColumnTitle(column.title);
      setEditingColumn(columnId);
    }
  };

  const handleSaveColumn = () => {
    if (!editingColumn || !newColumnTitle.trim()) return;
    
    updateColumns(prevColumns => {
      const newColumns = [...prevColumns];
      const columnIndex = newColumns.findIndex(c => c.id === editingColumn);
      if (columnIndex !== -1) {
        newColumns[columnIndex].title = newColumnTitle;
      }
      return newColumns;
    });
    
    setEditingColumn(null);
    setNewColumnTitle("");
  };

  const getPriorityColor = (priority: Task["priority"]) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // Don't render anything during SSR
  if (!isClient) {
    return (
      <div className="p-4">
        <div className="text-center text-muted-foreground">
          Loading Kanban board...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Project Tasks</h2>
          <p className="text-sm text-muted-foreground">
            Drag and drop tasks between columns
          </p>
        </div>
        
        <Dialog open={addTaskDialogOpen} onOpenChange={setAddTaskDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Task</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  placeholder="Task title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  placeholder="Task description"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="assignee">Assignee</Label>
                <Input
                  id="assignee"
                  value={newTask.assignee}
                  onChange={(e) => setNewTask({...newTask, assignee: e.target.value})}
                  placeholder="Assignee name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={newTask.priority}
                  onValueChange={(value: "low" | "medium" | "high") => 
                    setNewTask({...newTask, priority: value})
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="column">Column</Label>
                <Select
                  value={selectedColumn}
                  onValueChange={setSelectedColumn}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select column" />
                  </SelectTrigger>
                  {columns.map((column) => (
                    <SelectItem key={column.id} value={column.id}>
                      {column.title}
                    </SelectItem>
                  ))}
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setAddTaskDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddTask}>
                  Add Task
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-4">
          {columns.map((column) => (
            <div key={column.id} className="min-w-[300px]">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      {editingColumn === column.id ? (
                        <div className="flex items-center gap-2">
                          <Input
                            value={newColumnTitle}
                            onChange={(e) => setNewColumnTitle(e.target.value)}
                            className="h-8 w-32"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleSaveColumn();
                              if (e.key === "Escape") {
                                setEditingColumn(null);
                                setNewColumnTitle("");
                              }
                            }}
                          />
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6"
                            onClick={handleSaveColumn}
                          >
                            <Save className="h-3 w-3" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6"
                            onClick={() => {
                              setEditingColumn(null);
                              setNewColumnTitle("");
                            }}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <>
                          <CardTitle className="cursor-pointer hover:text-blue-600" onClick={() => handleEditColumn(column.id)}>
                            {column.title}
                          </CardTitle>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => handleEditColumn(column.id)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                        </>
                      )}
                      <span className="text-xs bg-muted px-2 py-1 rounded-full">
                        {column.tasks.length}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedColumn(column.id);
                        setAddTaskDialogOpen(true);
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <SortableContext
                    items={column.tasks.map(t => t.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-2 min-h-[200px]" id={`column-${column.id}`}>
                      {column.tasks.map((task) => (
                        <SortableTask
                          key={task.id}
                          task={task}
                          onDelete={() => handleDeleteTask(task.id)}
                          getPriorityColor={getPriorityColor}
                        />
                      ))}
                    </div>
                  </SortableContext>
                  
                  {column.tasks.length === 0 && (
                    <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
                      <p className="text-sm text-muted-foreground">Drop tasks here</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        or click + to add a task
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        <DragOverlay>
          {activeTask && (
            <div className="bg-white p-3 rounded-lg shadow-lg border min-w-[250px]">
              <div className="font-medium">{activeTask.title}</div>
              <div className="text-sm text-muted-foreground">{activeTask.description}</div>
              <div className="flex justify-between items-center mt-2">
                <div className="text-xs">Assignee: {activeTask.assignee}</div>
                <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(activeTask.priority)}`}>
                  {activeTask.priority}
                </span>
              </div>
            </div>
          )}
        </DragOverlay>
      </DndContext>

      <div className="text-xs text-muted-foreground text-center">
        Tip: Drag tasks between columns to update their status • Click column titles to edit • Use + buttons to add tasks
      </div>
    </div>
  );
}