"use client";
import { EnhancedKanbanBoard } from "@/components/kanban/enhanced-kanban-board";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Save, Plus, FileText, MessageSquare, AlertTriangle,
  CheckCircle, Clock, Users, Brain, BarChart, ArrowLeft
} from "lucide-react";

export default function ChatAutomatePage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => window.location.href = "/projects"} className="gap-2" data-testid="back-to-dashboard-btn">
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </Button>
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">ChatAutomate</h1>
            <p className="text-muted-foreground">chatautomate.ng - AI-powered chat automation platform</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline"><BarChart className="mr-2 h-4 w-4" />Analytics Dashboard</Button>
          <Button data-testid="add-task-header-btn"><Plus className="mr-2 h-4 w-4" />Add Task</Button>
        </div>
      </div>

      <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
        {[
          { label: "Active Users", value: "0", icon: Users, color: "text-blue-500" },
          { label: "Chat Sessions", value: "0", icon: Brain, color: "text-purple-500" },
          { label: "Pending Tasks", value: "0", icon: Clock, color: "text-yellow-500" },
          { label: "Response Rate", value: "0%", icon: CheckCircle, color: "text-green-500" },
        ].map(stat => (
          <Card key={stat.label}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div><p className="text-sm font-medium">{stat.label}</p><p className="text-lg sm:text-2xl font-bold">{stat.value}</p></div>
                <stat.icon className={`h-6 w-6 sm:h-8 sm:w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="kanban" className="space-y-4">
        <TabsList>
          <TabsTrigger value="kanban"><FileText className="mr-2 h-4 w-4" />Kanban Board</TabsTrigger>
          <TabsTrigger value="notes"><MessageSquare className="mr-2 h-4 w-4" />Notes</TabsTrigger>
          <TabsTrigger value="parking-lot"><AlertTriangle className="mr-2 h-4 w-4" />Parking Lot</TabsTrigger>
        </TabsList>
        <TabsContent value="kanban">
          <EnhancedKanbanBoard storageKey="chatautomate-kanban" />
        </TabsContent>
        <TabsContent value="notes">
          <Card>
            <CardHeader><CardTitle>Project Notes</CardTitle><CardDescription>Document action items, decisions, and important information</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              <Input placeholder="Note title" />
              <Textarea placeholder="Document important information..." className="min-h-[200px]" />
              <div className="flex justify-end"><Button><Save className="mr-2 h-4 w-4" />Save Note</Button></div>
              <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">No notes yet. Add your first note to get started.</p></CardContent></Card>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="parking-lot">
          <Card>
            <CardHeader><CardTitle>Parking Lot Issues</CardTitle><CardDescription>Issues that need attention but aren&apos;t blocking current work</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              <Input placeholder="Issue title" />
              <Textarea placeholder="Describe the issue..." className="min-h-[150px]" />
              <div className="flex justify-end"><Button variant="outline"><Plus className="mr-2 h-4 w-4" />Add to Parking Lot</Button></div>
              <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">No parking lot items. Add items that need attention.</p></CardContent></Card>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
