"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GripVertical, User } from "lucide-react";

interface Task {
  id: string;
  title: string;
  description: string;
  assignee: string;
  priority: "low" | "medium" | "high";
}

interface SortableTaskProps {
  task: Task;
}

export function SortableTask({ task }: SortableTaskProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getPriorityColor = (priority: Task["priority"]) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative ${isDragging ? "opacity-50" : ""}`}
    >
      <Card className="cursor-move hover:shadow-md transition-shadow mb-2">
        <CardContent className="p-3">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="font-medium text-sm">{task.title}</div>
              <div className="text-xs text-muted-foreground mt-1">{task.description}</div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 cursor-grab active:cursor-grabbing ml-1"
              {...attributes}
              {...listeners}
            >
              <GripVertical className="h-3 w-3" />
            </Button>
          </div>
          
          <div className="flex justify-between items-center mt-2">
            <div className="flex items-center gap-1">
              <User className="h-3 w-3" />
              <span className="text-xs">{task.assignee}</span>
            </div>
            
            <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
              {task.priority}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}