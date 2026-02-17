import { KanbanBoard } from "@/components/kanban/kanban-board";

export default function KanbanPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Kanban Board</h1>
        <p className="text-muted-foreground">
          Visualize and manage your workflow with drag and drop
        </p>
      </div>
      <KanbanBoard />
    </div>
  );
}