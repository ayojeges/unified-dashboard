"use client";

import { useDroppable } from "@dnd-kit/core";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Edit, Save, X } from "lucide-react";

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

interface SortableColumnProps {
  id: string;
  column: Column;
  children: React.ReactNode;
  editingColumn: string | null;
  newColumnTitle: string;
  onEditStart: (columnId: string) => void;
  onEditCancel: () => void;
  onEditSave: () => void;
  onNewColumnTitleChange: (title: string) => void;
  onAddTask: () => void;
}

export function SortableColumn({
  id,
  column,
  children,
  editingColumn,
  newColumnTitle,
  onEditStart,
  onEditCancel,
  onEditSave,
  onNewColumnTitleChange,
  onAddTask,
}: SortableColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id,
    data: {
      type: "column",
      columnId: column.id,
    },
  });

  const isEditing = editingColumn === column.id;

  return (
    <div
      ref={setNodeRef}
      className={`space-y-4 ${isOver ? "bg-blue-50 rounded-lg p-2" : ""}`}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          {isEditing ? (
            <div className="flex items-center gap-2">
              <Input
                value={newColumnTitle}
                onChange={(e) => onNewColumnTitleChange(e.target.value)}
                className="h-8 w-32"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") onEditSave();
                  if (e.key === "Escape") onEditCancel();
                }}
              />
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6"
                onClick={onEditSave}
              >
                <Save className="h-3 w-3" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6"
                onClick={onEditCancel}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ) : (
            <>
              <h3
                className="font-medium cursor-pointer hover:text-blue-600"
                onClick={() => onEditStart(column.id)}
              >
                {column.title}
              </h3>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => onEditStart(column.id)}
              >
                <Edit className="h-3 w-3" />
              </Button>
            </>
          )}
          <span className="text-xs bg-muted px-2 py-1 rounded-full">
            {column.tasks.length}
          </span>
        </div>
        <Button variant="ghost" size="icon" onClick={onAddTask}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-3">
        {children}
      </div>

      {column.tasks.length === 0 && (
        <Card className="border-2 border-dashed border-muted">
          <CardContent className="p-8 text-center">
            <p className="text-sm text-muted-foreground">Drop tasks here</p>
            <p className="text-xs text-muted-foreground mt-1">
              or click + to add a task
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}