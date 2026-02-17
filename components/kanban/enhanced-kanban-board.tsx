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
    ],
  },
  {
    id: "todo",
    title: "To Do",
    tasks: [
      {
        id: "3",
        title: "Design Review",
        description: "Review new dashboard designs",
        assignee: "Alex Chen",
        priority: "high",
      },
      {
        id: "4",
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
        id: "5",
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
        id: "6",
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
        id: "7",
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
      
      setColumns(prevColumns => {
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
        
        // Save to localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('kanban-board-data', JSON.stringify(newColumns));
        }
        
        return newColumns;
      });
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
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Project Tasks</h2>
        <p className="text-sm text-muted-foreground">
          Drag and drop tasks between columns
        </p>
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
                  <CardTitle className="flex justify-between items-center">
                    <span>{column.title}</span>
                    <span className="text-sm font-normal text-muted-foreground">
                      {column.tasks.length}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <SortableContext
                    items={column.tasks.map(t => t.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-2 min-h-[200px]" id={`column-${column.id}`}>
                      {column.tasks.map((task) => (
                        <SortableTask key={task.id} task={task} />
                      ))}
                    </div>
                  </SortableContext>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        <DragOverlay>
          {activeTask && (
            <div className="bg-white p-3 rounded-lg shadow-lg border">
              <div className="font-medium">{activeTask.title}</div>
              <div className="text-sm text-muted-foreground">{activeTask.description}</div>
              <div className="text-xs mt-1">Assignee: {activeTask.assignee}</div>
            </div>
          )}
        </DragOverlay>
      </DndContext>

      <div className="text-xs text-muted-foreground text-center">
        Tip: Drag tasks between columns to update their status
      </div>
    </div>
  );
}