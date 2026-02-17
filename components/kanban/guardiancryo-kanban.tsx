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
import { Plus, MoreVertical, User, Package, Thermometer, Truck, Shield, GripVertical, Edit, Trash2, Save, X } from "lucide-react";
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

export function GuardianCryoKanban() {
  const columns: Column[] = [
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

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">GuardianCryo Tasks</h2>
          <p className="text-sm text-muted-foreground">Cryogenic shipping workflow management</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Shipping Task
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
                <p className="text-sm text-muted-foreground">Drop tasks here</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}