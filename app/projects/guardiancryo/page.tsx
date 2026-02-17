import { KanbanBoard } from "@/components/kanban/kanban-board";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Save, 
  Plus, 
  FileText, 
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  Package
} from "lucide-react";

export default function GuardianCryoPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">GuardianCryo</h1>
          <p className="text-muted-foreground">
            Cryogenic shipping and storage solutions for fertility clinics
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Package className="mr-2 h-4 w-4" />
            Shipping Requests
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Task
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Active Shipments</p>
                <p className="text-2xl font-bold">12</p>
              </div>
              <Package className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Partner Clinics</p>
                <p className="text-2xl font-bold">8</p>
              </div>
              <Users className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Pending Tasks</p>
                <p className="text-2xl font-bold">24</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Completion Rate</p>
                <p className="text-2xl font-bold">85%</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
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
          <KanbanBoard />
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
                <div className="flex items-center justify-between">
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
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm">Shipping Protocol Update</CardTitle>
                      <Badge variant="secondary">Completed</Badge>
                    </div>
                    <CardDescription>Updated on Feb 15, 2026</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      Updated shipping protocols for international shipments. Added dry ice 
                      quantity requirements and extended monitoring period to 72 hours.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm">New Clinic Onboarding</CardTitle>
                      <Badge variant="outline">In Progress</Badge>
                    </div>
                    <CardDescription>Updated on Feb 16, 2026</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      Miami Fertility Center onboarding scheduled for Feb 20. Need to prepare 
                      training materials and shipping kits. Contact: Dr. Rodriguez.
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
                <div className="flex items-center justify-between">
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
                <Card className="border-yellow-200">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium">Website Performance</h4>
                        <p className="text-sm text-muted-foreground">
                          Homepage load time is 4.2s - needs optimization but not critical
                        </p>
                      </div>
                      <Badge variant="outline">Needs Review</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-blue-200">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium">Mobile App Feature</h4>
                        <p className="text-sm text-muted-foreground">
                          Consider adding shipment tracking to mobile app - nice to have
                        </p>
                      </div>
                      <Badge variant="outline">Future Consideration</Badge>
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