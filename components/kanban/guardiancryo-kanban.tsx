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
  useDroppable,
  useDraggable,
} from "@dnd-kit/core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/simple-select";
import { Plus, Package, Thermometer, Truck, Shield, X, GripVertical } from "lucide-react";

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

// Draggable Task Card Component
function DraggableTask({ task, columnId, onDelete, getPriorityColor, getTaskIcon }: { 
  task: Task; 
  columnId: string;
  onDelete: (columnId: string, taskId: string) => void;
  getPriorityColor: (priority: Task["priority"]) => string;
  getTaskIcon: (title: string) => React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
    data: { task, columnId },
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    opacity: isDragging ? 0.5 : 1,
  } : undefined;

  return (
    <div ref={setNodeRef} style={style}>
      <Card className={`cursor-grab hover:shadow-md transition-shadow ${isDragging ? 'shadow-lg ring-2 ring-primary' : ''}`}>
        <CardHeader className="p-4 pb-2">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <div {...listeners} {...attributes} className="cursor-grab hover:bg-muted rounded p-1">
                <GripVertical className="h-4 w-4 text-muted-foreground" />
              </div>
              <CardTitle className="text-sm font-medium">
                {task.title}
              </CardTitle>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6 hover:bg-destructive/10 hover:text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(columnId, task.id);
              }}
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
            
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${getPriorityColor(task.priority)}`}>
              {task.priority}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Droppable Column Component
function DroppableColumn({ column, children }: { column: Column; children: React.ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({
    id: `column-${column.id}`,
    data: { columnId: column.id },
  });

  return (
    <div 
      ref={setNodeRef} 
      className={`space-y-3 min-h-[200px] p-2 rounded-lg transition-colors ${
        isOver ? 'bg-primary/10 ring-2 ring-primary ring-dashed' : 'bg-muted/30'
      }`}
    >
      {children}
    </div>
  );
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
      { id: "backlog", title: "Backlog", tasks: [] },
      { id: "todo", title: "To Do", tasks: [] },
      { id: "in-progress", title: "In Progress", tasks: [] },
      { id: "review", title: "Review", tasks: [] },
      { id: "done", title: "Done", tasks: [] },
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
        distance: 5,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const taskData = active.data.current;
    if (taskData?.task) {
      setActiveTask(taskData.task);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Get the target column ID
    let targetColumnId: string | null = null;
    
    if (overId.startsWith('column-')) {
      targetColumnId = overId.replace('column-', '');
    } else {
      // Dropped on another task - find its column
      const overData = over.data.current;
      if (overData?.columnId) {
        targetColumnId = overData.columnId;
      }
    }

    if (!targetColumnId) return;

    // Get source info
    const sourceData = active.data.current;
    const sourceColumnId = sourceData?.columnId;

    if (!sourceColumnId || sourceColumnId === targetColumnId) {
      // Same column, no move needed (could add reordering here)
      return;
    }

    updateColumns(prevColumns => {
      const newColumns = prevColumns.map(col => ({ ...col, tasks: [...col.tasks] }));
      
      // Find source column and task
      const sourceColIndex = newColumns.findIndex(c => c.id === sourceColumnId);
      const targetColIndex = newColumns.findIndex(c => c.id === targetColumnId);
      
      if (sourceColIndex === -1 || targetColIndex === -1) return prevColumns;

      const taskIndex = newColumns[sourceColIndex].tasks.findIndex(t => t.id === activeId);
      if (taskIndex === -1) return prevColumns;

      // Move task
      const [task] = newColumns[sourceColIndex].tasks.splice(taskIndex, 1);
      newColumns[targetColIndex].tasks.push(task);
      
      return newColumns;
    });
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
      const newColumns = prevColumns.map(col => ({ ...col, tasks: [...col.tasks] }));
      const columnIndex = newColumns.findIndex(c => c.id === selectedColumn);
      if (columnIndex !== -1) {
        newColumns[columnIndex].tasks.push(newTaskObj);
      }
      return newColumns;
    });

    setNewTask({ title: "", description: "", assignee: "", priority: "medium" });
    setAddTaskDialogOpen(false);
  };

  const handleDeleteTask = (columnId: string, taskId: string) => {
    updateColumns(prevColumns => {
      return prevColumns.map(col => {
        if (col.id === columnId) {
          return { ...col, tasks: col.tasks.filter(t => t.id !== taskId) };
        }
        return col;
      });
    });
  };

  const getPriorityColor = (priority: Task["priority"]) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      case "medium": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "low": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
    }
  };

  const getTaskIcon = (title: string) => {
    if (title.toLowerCase().includes("shipping") || title.toLowerCase().includes("container")) return <Truck className="h-3 w-3" />;
    if (title.toLowerCase().includes("temperature") || title.toLowerCase().includes("ice")) return <Thermometer className="h-3 w-3" />;
    if (title.toLowerCase().includes("security") || title.toLowerCase().includes("insurance")) return <Shield className="h-3 w-3" />;
    return <Package className="h-3 w-3" />;
  };

  if (!isClient) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="h-8 w-40 bg-muted animate-pulse rounded" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="space-y-4">
              <div className="h-6 w-24 bg-muted animate-pulse rounded" />
              <div className="space-y-2 min-h-[200px] bg-muted/30 rounded-lg p-2">
                <div className="h-24 bg-muted animate-pulse rounded" />
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
          <p className="text-sm text-muted-foreground">Drag and drop tasks between columns</p>
        </div>
        
        <Dialog open={addTaskDialogOpen} onOpenChange={setAddTaskDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Task</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="title">Task Title *</Label>
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
                  placeholder="Describe the task..."
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
                <Label>Priority</Label>
                <Select
                  value={newTask.priority}
                  onValueChange={(value) => setNewTask({...newTask, priority: value as "low" | "medium" | "high"})}
                >
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Column</Label>
                <Select
                  value={selectedColumn}
                  onValueChange={setSelectedColumn}
                >
                  <SelectContent>
                    {columns.map(column => (
                      <SelectItem key={column.id} value={column.id}>
                        {column.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Button onClick={handleAddTask} className="w-full" disabled={!newTask.title.trim()}>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {columns.map((column) => (
            <div key={column.id} className="space-y-3">
              <div className="flex justify-between items-center px-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">{column.title}</h3>
                  <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
                    {column.tasks.length}
                  </span>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => {
                    setSelectedColumn(column.id);
                    setAddTaskDialogOpen(true);
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <DroppableColumn column={column}>
                {column.tasks.length === 0 ? (
                  <div className="border-2 border-dashed border-muted-foreground/20 rounded-lg p-6 text-center">
                    <p className="text-sm text-muted-foreground">Drop tasks here</p>
                  </div>
                ) : (
                  column.tasks.map((task) => (
                    <DraggableTask
                      key={task.id}
                      task={task}
                      columnId={column.id}
                      onDelete={handleDeleteTask}
                      getPriorityColor={getPriorityColor}
                      getTaskIcon={getTaskIcon}
                    />
                  ))
                )}
              </DroppableColumn>
            </div>
          ))}
        </div>

        <DragOverlay>
          {activeTask && (
            <Card className="shadow-2xl ring-2 ring-primary rotate-3 max-w-[280px]">
              <CardHeader className="p-3 pb-1">
                <CardTitle className="text-sm">{activeTask.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-1">
                <p className="text-xs text-muted-foreground line-clamp-2">{activeTask.description}</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs">{activeTask.assignee}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${getPriorityColor(activeTask.priority)}`}>
                    {activeTask.priority}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
}