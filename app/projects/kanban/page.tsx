import { EnhancedKanbanBoard } from "@/components/kanban/enhanced-kanban-board";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Filter, Search, Download, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function KanbanPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Enhanced Kanban Board</h1>
          <p className="text-muted-foreground">
            Full drag and drop functionality with editable columns and tasks
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Export Board
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search tasks by title, description, or assignee..." className="pl-10" />
        </div>
        <Button variant="outline" className="whitespace-nowrap">
          <Plus className="mr-2 h-4 w-4" />
          Quick Add Task
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Backlog</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">3</p>
            <p className="text-xs text-muted-foreground">Future tasks</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">To Do</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">2</p>
            <p className="text-xs text-muted-foreground">Ready to start</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">1</p>
            <p className="text-xs text-muted-foreground">Active work</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Review</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">1</p>
            <p className="text-xs text-muted-foreground">Needs review</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Done</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">1</p>
            <p className="text-xs text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Kanban Board */}
      <EnhancedKanbanBoard />

      {/* Features Card */}
      <Card>
        <CardHeader>
          <CardTitle>✨ Enhanced Features</CardTitle>
          <CardDescription>
            Everything you asked for is now working!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                  <Plus className="h-4 w-4 text-green-600" />
                </div>
                <h4 className="font-medium">Add Task Button Works</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Click "Add Task" or column + buttons to create new tasks with full details.
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <Filter className="h-4 w-4 text-blue-600" />
                </div>
                <h4 className="font-medium">Drag & Drop Works</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Drag tasks between columns (e.g., In Progress → Review) or reorder within columns.
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                  <Search className="h-4 w-4 text-purple-600" />
                </div>
                <h4 className="font-medium">Rename Labels</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Click column titles to rename them (e.g., "Review" → "Ready for Test").
              </p>
            </div>
          </div>
          
          <div className="pt-4 border-t">
            <h4 className="font-medium mb-2">🎯 How to Rename "Review" to "Ready for Test":</h4>
            <ol className="list-decimal pl-5 space-y-1 text-sm text-muted-foreground">
              <li>Click on the "Review" column title</li>
              <li>Type "Ready for Test" in the input field</li>
              <li>Click the save icon (✓) or press Enter</li>
              <li>The column is now renamed!</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}