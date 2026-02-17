"use client";
import { useState } from "react";
import { GuardianCryoKanban } from "@/components/kanban/guardiancryo-kanban";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { SimpleSelect, SimpleSelectContent, SimpleSelectItem, SimpleSelectTrigger, SimpleSelectValue } from "@/components/ui/simple-select";
import { 
  Save, 
  Plus, 
  FileText, 
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  Package,
  ArrowLeft
} from "lucide-react";

export default function GuardianCryoPage() {
  const [addTaskDialogOpen, setAddTaskDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => window.location.href = "/projects"}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">GuardianCryo</h1>
            <p className="text-muted-foreground">
              Cryogenic shipping and storage solutions for fertility clinics
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline">
            <Package className="mr-2 h-4 w-4" />
            Shipping Requests
          </Button>
          <Dialog open={addTaskDialogOpen} onOpenChange={setAddTaskDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Shipping Task</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Task Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Schedule Cryo Container Pickup"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="e.g., Coordinate with clinic for temperature-sensitive shipment"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="assignee">Assignee</Label>
                  <Input
                    id="assignee"
                    placeholder="e.g., Logistics Team"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <SimpleSelect>
                    <SimpleSelectTrigger>
                      <SimpleSelectValue placeholder="Select priority" />
                    </SimpleSelectTrigger>
                    <SimpleSelectContent>
                      <SimpleSelectItem value="low">Low</SimpleSelectItem>
                      <SimpleSelectItem value="medium">Medium</SimpleSelectItem>
                      <SimpleSelectItem value="high">High</SimpleSelectItem>
                    </SimpleSelectContent>
                  </SimpleSelect>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="column">Column</Label>
                  <SimpleSelect>
                    <SimpleSelectTrigger>
                      <SimpleSelectValue placeholder="Select column" />
                    </SimpleSelectTrigger>
                    <SimpleSelectContent>
                      <SimpleSelectItem value="backlog">Backlog</SimpleSelectItem>
                      <SimpleSelectItem value="todo">To Do</SimpleSelectItem>
                      <SimpleSelectItem value="in-progress">In Progress</SimpleSelectItem>
                      <SimpleSelectItem value="review">Review</SimpleSelectItem>
                      <SimpleSelectItem value="done">Done</SimpleSelectItem>
                    </SimpleSelectContent>
                  </SimpleSelect>
                </div>
                
                <Button onClick={() => {
                  // This would need to be connected to the Kanban component
                  // For now, just close the dialog
                  setAddTaskDialogOpen(false);
                }} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Task
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium">Active Shipments</p>
                <p className="text-lg sm:text-2xl font-bold">0</p>
              </div>
              <Package className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium">Partner Clinics</p>
                <p className="text-lg sm:text-2xl font-bold">0</p>
              </div>
              <Users className="h-6 w-6 sm:h-8 sm:w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium">Pending Tasks</p>
                <p className="text-lg sm:text-2xl font-bold">0</p>
              </div>
              <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium">Completion Rate</p>
                <p className="text-lg sm:text-2xl font-bold">0%</p>
              </div>
              <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="kanban" className="space-y-4">
        <TabsList>
          <TabsTrigger value="kanban">
            <FileText className="mr-2 h-4 w-4" />
            Kanban Board
          </TabsTrigger>
          <TabsTrigger value="notes">
            <MessageSquare className="mr-2 h-4 w-4" />
            Notes & Documentation
          </TabsTrigger>
          <TabsTrigger value="parking-lot">
            <AlertTriangle className="mr-2 h-4 w-4" />
            Parking Lot
          </TabsTrigger>
        </TabsList>

        {/* Kanban Board Tab */}
        <TabsContent value="kanban" className="space-y-4">
          <GuardianCryoKanban />
        </TabsContent>

        {/* Notes Tab */}
        <TabsContent value="notes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Notes</CardTitle>
              <CardDescription>
                Document action items, decisions, and important information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <h3 className="font-medium">Add New Note</h3>
                  <Badge variant="outline">Action Item</Badge>
                </div>
                <Input placeholder="Note title" />
                <Textarea 
                  placeholder="Document important information, decisions, or action items..."
                  className="min-h-[200px]"
                />
                <div className="flex justify-end">
                  <Button>
                    <Save className="mr-2 h-4 w-4" />
                    Save Note
                  </Button>
                </div>
              </div>

              {/* Existing Notes */}
              <div className="space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <CardTitle className="text-sm">No notes yet</CardTitle>
                      <Badge variant="secondary">Empty</Badge>
                    </div>
                    <CardDescription>Add your first note to get started</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      This project dashboard is ready for your real data. Add notes, tasks, and track progress.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Parking Lot Tab */}
        <TabsContent value="parking-lot" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Parking Lot Issues</CardTitle>
              <CardDescription>
                Issues that need attention but aren&apos;t blocking current work
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <h3 className="font-medium">Add Parking Lot Item</h3>
                  <Badge variant="outline">Low Priority</Badge>
                </div>
                <Input placeholder="Issue title" />
                <Textarea 
                  placeholder="Describe the issue and why it's in the parking lot..."
                  className="min-h-[150px]"
                />
                <div className="flex justify-end">
                  <Button variant="outline">
                    <Plus className="mr-2 h-4 w-4" />
                    Add to Parking Lot
                  </Button>
                </div>
              </div>

              {/* Parking Lot Items */}
              <div className="space-y-3">
                <Card className="border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium">No parking lot items</h4>
                        <p className="text-sm text-muted-foreground">
                          Add items that need attention but aren't blocking current work
                        </p>
                      </div>
                      <Badge variant="outline">Empty</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}