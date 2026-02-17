"use client";

import { useState } from "react";
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
import { SortableColumn } from "./sortable-column";

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

export function EnhancedKanbanBoard() {
  // Load from localStorage or use default
  const loadColumns = (): Column[] => {
    if (typeof window === 'undefined') return [];
    
    try {
      const saved = localStorage.getItem('kanban-board-data');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Failed to load kanban data:', error);
    }
    
    // Default columns
    return [
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
      id: "in-progress",
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
  };

  const [columns, setColumns] = useState<Column[]>(loadColumns());
  const [activeTask, setActiveTask] = useState<Task | null>(null);

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
    
    if (!over) {
      setActiveTask(null);
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;

    // If dragging over a column
    if (overId.startsWith("column-")) {
      const columnId = overId.replace("column-", "");
      
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

        if (task && sourceColumnIndex !== -1) {
          // Remove from source column
          newColumns[sourceColumnIndex].tasks.splice(taskIndex, 1);
          
          // Add to target column
          const targetColumnIndex = newColumns.findIndex(c => c.id === columnId);
          if (targetColumnIndex !== -1) {
            newColumns[targetColumnIndex].tasks.push(task);
          }
        }

        return newColumns;
      });
    }
    // If dragging within same column (reordering)
    else if (activeId !== overId) {
      updateColumns(prevColumns => {
        const newColumns = [...prevColumns];
        
        for (const column of newColumns) {
          const taskIds = column.tasks.map(task => task.id);
          const oldIndex = taskIds.indexOf(activeId);
          const newIndex = taskIds.indexOf(overId);

          if (oldIndex !== -1 && newIndex !== -1) {
            column.tasks = arrayMove(column.tasks, oldIndex, newIndex);
            break;
          }
        }

        return newColumns;
      });
    }

    setActiveTask(null);
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

  const handleUpdateColumnTitle = (columnId: string) => {
    if (!newColumnTitle.trim()) {
      setEditingColumn(null);
      return;
    }

    updateColumns(prevColumns => {
      const newColumns = [...prevColumns];
      const columnIndex = newColumns.findIndex(c => c.id === columnId);
      if (columnIndex !== -1) {
        newColumns[columnIndex].title = newColumnTitle;
      }
      return newColumns;
    });

    setEditingColumn(null);
    setNewColumnTitle("");
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Enhanced Kanban Board</h2>
          <p className="text-sm text-muted-foreground">
            Drag and drop tasks between columns. Click column titles to rename.
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
                <Label htmlFor="title">Task Title</Label>
                <Input
                  id="title"
                  placeholder="Enter task title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="Enter task description"
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="assignee">Assignee</Label>
                <Input
                  id="assignee"
                  placeholder="Enter assignee name"
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
                  {columns.map(column => (
                    <SelectItem key={column.id} value={column.id}>
                      {column.title}
                    </SelectItem>
                  ))}
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
            <SortableColumn
              key={column.id}
              id={`column-${column.id}`}
              column={column}
              editingColumn={editingColumn}
              newColumnTitle={newColumnTitle}
              onEditStart={(colId) => {
                setEditingColumn(colId);
                setNewColumnTitle(column.title);
              }}
              onEditCancel={() => {
                setEditingColumn(null);
                setNewColumnTitle("");
              }}
              onEditSave={() => handleUpdateColumnTitle(column.id)}
              onNewColumnTitleChange={setNewColumnTitle}
              onAddTask={() => {
                setSelectedColumn(column.id);
                setAddTaskDialogOpen(true);
              }}
            >
              <SortableContext
                items={column.tasks.map(task => task.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-3">
                  {column.tasks.map((task) => (
                    <SortableTask
                      key={task.id}
                      id={task.id}
                      task={task}
                      columnId={column.id}
                      getPriorityColor={getPriorityColor}
                      onDelete={() => handleDeleteTask(column.id, task.id)}
                    />
                  ))}
                </div>
              </SortableContext>
            </SortableColumn>
          ))}
        </div>

        <DragOverlay>
          {activeTask && (
            <Card className="cursor-grabbing shadow-lg">
              <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-sm font-medium">
                    {activeTask.title}
                  </CardTitle>
                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-2 space-y-3">
                <p className="text-sm text-muted-foreground">
                  {activeTask.description}
                </p>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
                      <User className="h-3 w-3" />
                    </div>
                    <span className="text-xs">{activeTask.assignee}</span>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(activeTask.priority)}`}>
                    {activeTask.priority}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}
        </DragOverlay>
      </DndContext>

      <div className="text-sm text-muted-foreground">
        <p>💡 <strong>How to use:</strong></p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>Drag tasks between columns to move them</li>
          <li>Drag tasks within a column to reorder them</li>
          <li>Click column titles to rename them (e.g., "Review" → "Ready for Test")</li>
          <li>Use the "Add Task" button to create new tasks</li>
          <li>Click the trash icon on tasks to delete them</li>
        </ul>
      </div>
    </div>
  );
}