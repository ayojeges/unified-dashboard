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
    tasks: [],
  },
  {
    id: "todo",
    title: "To Do",
    tasks: [],
  },
  {
    id: "inprogress",
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

  // Show skeleton loading during SSR/hydration
  if (!isClient) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="h-8 w-40 bg-muted animate-pulse rounded" />
          <div className="h-4 w-60 bg-muted animate-pulse rounded" />
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="min-w-[280px] md:min-w-[300px]">
              <div className="border rounded-lg p-4 space-y-3">
                <div className="h-6 w-24 bg-muted animate-pulse rounded" />
                <div className="space-y-2 min-h-[200px]">
                  <div className="h-20 bg-muted animate-pulse rounded" />
                  <div className="h-20 bg-muted animate-pulse rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <h2 className="text-xl md:text-2xl font-bold">Project Tasks</h2>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Drag and drop tasks between columns
        </p>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-3 md:gap-4 overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0">
          {columns.map((column) => (
            <div key={column.id} className="min-w-[260px] md:min-w-[300px] flex-shrink-0">
              <Card>
                <CardHeader className="pb-2 md:pb-3 px-3 md:px-4">
                  <CardTitle className="flex justify-between items-center text-sm md:text-base">
                    <span>{column.title}</span>
                    <span className="text-xs md:text-sm font-normal text-muted-foreground">
                      {column.tasks.length}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-3 md:px-4">
                  <SortableContext
                    items={column.tasks.map(t => t.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-2 min-h-[150px] md:min-h-[200px]" id={`column-${column.id}`}>
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
            <div className="bg-white p-3 rounded-lg shadow-lg border max-w-[260px]">
              <div className="font-medium text-sm">{activeTask.title}</div>
              <div className="text-xs text-muted-foreground line-clamp-2">{activeTask.description}</div>
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