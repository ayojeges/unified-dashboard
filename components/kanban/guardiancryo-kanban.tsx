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
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/simple-select";
import { Plus, MoreVertical, User, Package, Thermometer, Truck, Shield, GripVertical, Edit, Trash2, Save, X } from "lucide-react";

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

export function GuardianCryoKanban() {
  // Load from localStorage or use default
  const loadColumns = (): Column[] => {
    if (typeof window === 'undefined') return [];
    
    try {
      const saved = localStorage.getItem('guardiancryo-kanban-data');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Failed to load kanban data:', error);
    }
    
    // Default empty columns
    return [
      {
        id: "backlog",
        title: "Backlog",
        tasks: [],
      },
      {
        id: "todo",
        title: "To Do",
        tasks: [],
      },
      {
        id: "in-progress",
        title: "In Progress",
        tasks: [],
      },
      {
        id: "review",
        title: "Review",
        tasks: [],
      },
      {
        id: "done",
        title: "Done",
        tasks: [],
      },
    ];
  };

  const [columns, setColumns] = useState<Column[]>([]);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assignee: "",
    priority: "medium" as "low" | "medium" | "high",
  });
  const [addTaskDialogOpen, setAddTaskDialogOpen] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState<string>("backlog");

  useEffect(() => {
    setIsClient(true);
    setColumns(loadColumns());
  }, []);

  // Save columns to localStorage
  const updateColumns = (updater: (prevColumns: Column[]) => Column[]) => {
    setColumns(prevColumns => {
      const newColumns = updater(prevColumns);
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('guardiancryo-kanban-data', JSON.stringify(newColumns));
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
      id: `task-${Date.now()}`,
      title: newTask.title,
      description: newTask.description,
      assignee: newTask.assignee || "Unassigned",
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

    // Reset form
    setNewTask({
      title: "",
      description: "",
      assignee: "",
      priority: "medium",
    });
    setAddTaskDialogOpen(false);
  };

  const handleDeleteTask = (columnId: string, taskId: string) => {
    updateColumns(prevColumns => {
      const newColumns = [...prevColumns];
      const columnIndex = newColumns.findIndex(c => c.id === columnId);
      if (columnIndex !== -1) {
        newColumns[columnIndex].tasks = newColumns[columnIndex].tasks.filter(
          task => task.id !== taskId
        );
      }
      return newColumns;
    });
  };

  const getPriorityColor = (priority: Task["priority"]) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
    }
  };

  const getTaskIcon = (title: string) => {
    if (title.includes("Shipping") || title.includes("Container")) return <Truck className="h-3 w-3" />;
    if (title.includes("Temperature") || title.includes("Ice")) return <Thermometer className="h-3 w-3" />;
    if (title.includes("Security") || title.includes("Insurance")) return <Shield className="h-3 w-3" />;
    return <Package className="h-3 w-3" />;
  };

  // Show skeleton loading during SSR/hydration
  if (!isClient) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="h-8 w-40 bg-muted animate-pulse rounded" />
          <div className="h-4 w-60 bg-muted animate-pulse rounded" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="space-y-4">
              <div className="h-6 w-24 bg-muted animate-pulse rounded" />
              <div className="space-y-2 min-h-[200px]">
                <div className="h-20 bg-muted animate-pulse rounded" />
                <div className="h-20 bg-muted animate-pulse rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">GuardianCryo Tasks</h2>
          <p className="text-sm text-muted-foreground">Cryogenic shipping workflow management</p>
        </div>
        
        <Dialog open={addTaskDialogOpen} onOpenChange={setAddTaskDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Shipping Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Shipping Task</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Task Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Schedule Cryo Container Pickup"
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="e.g., Coordinate with clinic for temperature-sensitive shipment"
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="assignee">Assignee</Label>
                <Input
                  id="assignee"
                  placeholder="e.g., Logistics Team"
                  value={newTask.assignee}
                  onChange={(e) => setNewTask({...newTask, assignee: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={newTask.priority}
                  onValueChange={(value) => 
                    setNewTask({...newTask, priority: value as "low" | "medium" | "high"})
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
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
                  <SelectContent>
                    {columns.map(column => (
                      <SelectItem key={column.id} value={column.id}>
                        {column.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Button onClick={handleAddTask} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
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

              <div className="space-y-3" id={`column-${column.id}`}>
                {column.tasks.map((task) => (
                  <Card key={task.id} className="cursor-move hover:shadow-md transition-shadow">
                    <CardHeader className="p-4 pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-sm font-medium">
                          {task.title}
                        </CardTitle>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6"
                          onClick={() => handleDeleteTask(column.id, task.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-2 space-y-3">
                      <p className="text-sm text-muted-foreground">
                        {task.description}
                      </p>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
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
                  <p className="text-sm text-muted-foreground">No tasks yet. Click + to add one.</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <DragOverlay>
          {activeTask && (
            <div className="bg-white p-3 rounded-lg shadow-lg border max-w-[260px]">
              <div className="font-medium text-sm">{activeTask.title}</div>
              <div className="text-xs text-muted-foreground line-clamp-2">{activeTask.description}</div>
              <div className="text-xs mt-1">Assignee: {activeTask.assignee}</div>
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
}