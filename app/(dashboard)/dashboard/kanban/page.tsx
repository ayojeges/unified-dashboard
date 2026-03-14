"use client";

import { EnhancedKanbanBoard } from "@/components/kanban/enhanced-kanban-board";

export default function DashboardKanbanPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Kanban Board</h1>
        <p className="text-muted-foreground">
          Manage tasks and track project progress
        </p>
      </div>
      <EnhancedKanbanBoard />
    </div>
  );
}
