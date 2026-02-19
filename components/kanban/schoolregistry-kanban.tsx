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
import { Plus, MoreVertical, User, GraduationCap, BookOpen, School, Users, GripVertical, Edit, Trash2, Save, X } from "lucide-react";

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

export function SchoolRegistryKanban() {
  // Load from localStorage or use default
  const loadColumns = (): Column[] => {
    if (typeof window === 'undefined') return [];
    
    try {
      const saved = localStorage.getItem('schoolregistry-kanban-data');
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
          localStorage.setItem('schoolregistry-kanban-data', JSON.stringify(newColumns));
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
        newColumns[columnIndex].tasks = newColumns[columnIndex].tasks.filter(t => t.id !== taskId);
      }
      return newColumns;
    });
  };

  const handleUpdateTask = (columnId: string, taskId: string, updates: Partial<Task>) => {
    updateColumns(prevColumns => {
      const newColumns = [...prevColumns];
      const columnIndex = newColumns.findIndex(c => c.id === columnId);
      if (columnIndex !== -1) {
        const taskIndex = newColumns[columnIndex].tasks.findIndex(t => t.id === taskId);
        if (taskIndex !== -1) {
          newColumns[columnIndex].tasks[taskIndex] = {
            ...newColumns[columnIndex].tasks[taskIndex],
            ...updates,
          };
        }
      }
      return newColumns;
    });
  };

  const getPriorityColor = (priority: "low" | "medium" | "high") => {
    switch (priority) {
      case "low": return "bg-green-100 text-green-800 border-green-200";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "high": return "bg-red-100 text-red-800 border-red-200";
    }
  };

  const getSchoolIcon = () => {
    const icons = [GraduationCap, BookOpen, School, Users];
    return icons[Math.floor(Math.random() * icons.length)];
  };

  if (!isClient) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <GraduationCap className="h-12 w-12 mx-auto text-emerald-500 animate-pulse" />
          <p className="mt-2 text-muted-foreground">Loading School Registry Kanban...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Add Task Dialog */}
      <Dialog open={addTaskDialogOpen} onOpenChange={setAddTaskDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New School Management Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Task Title</Label>
              <Input
                id="title"
                placeholder="e.g., Verify School Accreditation"
                value={newTask.title}
                onChange={(e) => setNewTask({...newTask, title: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="e.g., Review documentation for primary school accreditation"
                value={newTask.description}
                onChange={(e) => setNewTask({...newTask, description: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="assignee">Assignee</Label>
              <Input
                id="assignee"
                placeholder="e.g., Accreditation Team"
                value={newTask.assignee}
                onChange={(e) => setNewTask({...newTask, assignee: e.target.value})}
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
                  <SelectItem value="backlog">Backlog</SelectItem>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
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

      {/* Kanban Board Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">School Registry Kanban Board</h2>
          <p className="text-sm text-muted-foreground">
            Drag and drop tasks between columns to manage school accreditation workflow
          </p>
        </div>
        <Button onClick={() => setAddTaskDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </div>

      {/* Kanban Board */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {columns.map((column) => (
            <div key={column.id} id={`column-${column.id}`} className="space-y-3">
              <Card className="border-emerald-200 bg-emerald-50">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">
                      {column.title}
                    </CardTitle>
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-emerald-100 text-emerald-800">
                      {column.tasks.length}
                    </span>
                  </div>
                </CardHeader>
              </Card>

              <SortableContext
                items={column.tasks.map(t => t.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-3 min-h-[200px]">
                  {column.tasks.map((task) => {
                    const SchoolIcon = getSchoolIcon();
                    return (
                      <Card
                        key={task.id}
                        id={task.id}
                        className="group cursor-move hover:shadow-md transition-shadow"
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3">
                              <SchoolIcon className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                              <div className="space-y-1">
                                <h4 className="font-medium text-sm">{task.title}</h4>
                                <p className="text-xs text-muted-foreground line-clamp-2">
                                  {task.description}
                                </p>
                                <div className="flex items-center gap-2 mt-2">
                                  <span className={`text-xs px-2 py-0.5 rounded-full border ${getPriorityColor(task.priority)}`}>
                                    {task.priority}
                                  </span>
                                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                                    <User className="h-3 w-3" />
                                    {task.assignee}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => handleDeleteTask(column.id, task.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                              <div className="cursor-grab active:cursor-grabbing">
                                <GripVertical className="h-4 w-4 text-muted-foreground" />
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </SortableContext>

              {column.tasks.length === 0 && (
                <div className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-emerald-200 rounded-lg bg-emerald-50/50">
                  <GraduationCap className="h-8 w-8 text-emerald-300 mb-2" />
                  <p className="text-sm text-emerald-600">No tasks yet</p>
                  <p className="text-xs text-emerald-500">Drag tasks here or add new ones</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <DragOverlay>
          {activeTask && (
            <Card className="shadow-lg border-emerald-300">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <GraduationCap className="h-5 w-5 text-emerald-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-sm">{activeTask.title}</h4>
                    <p className="text-xs text-muted-foreground">{activeTask.assignee}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </DragOverlay>
      </DndContext>

      {/* Instructions */}
      <Card className="border-emerald-100 bg-emerald-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <GraduationCap className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <h4 className="font-medium text-sm">How to use this board</h4>
              <ul className="text-xs text-emerald-700 space-y-1">
                <li>• <strong>Drag and drop</strong> tasks between columns to update their status</li>
                <li>• <strong>Click "Add Task"</strong> to create new school management tasks</li>
                <li>• <strong>Hover over tasks</strong> to see delete and drag handles</li>
                <li>• <strong>Data is saved automatically</strong> to your browser's local storage</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}