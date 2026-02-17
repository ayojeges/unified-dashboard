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
  GraduationCap,
  Building
} from "lucide-react";

export default function CDLSchoolsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">CDL Schools</h1>
          <p className="text-muted-foreground">
            Commercial Driver&apos;s License training and certification platform
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Building className="mr-2 h-4 w-4" />
            Partner Management
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
                <p className="text-sm font-medium">Active Partners</p>
                <p className="text-2xl font-bold">10</p>
              </div>
              <Building className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Students Enrolled</p>
                <p className="text-2xl font-bold">247</p>
              </div>
              <GraduationCap className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Pending Tasks</p>
                <p className="text-2xl font-bold">18</p>
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
                <p className="text-2xl font-bold">92%</p>
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
                      <CardTitle className="text-sm">New Partner Onboarding</CardTitle>
                      <Badge variant="secondary">Completed</Badge>
                    </div>
                    <CardDescription>Updated on Feb 14, 2026</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      Successfully onboarded &quot;Texas Trucking Academy&quot; as white-label partner. 
                      Training materials delivered, portal access configured.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm">Course Content Update</CardTitle>
                      <Badge variant="outline">In Progress</Badge>
                    </div>
                    <CardDescription>Updated on Feb 16, 2026</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      Updating hazardous materials training module to meet new DOT regulations.
                      Deadline: Feb 25. Assigned to: Course Creation Team.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm">Marketing Campaign</CardTitle>
                      <Badge variant="outline">Planning</Badge>
                    </div>
                    <CardDescription>Updated on Feb 17, 2026</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      Q2 marketing campaign targeting independent trucking schools in Midwest.
                      Budget: $5,000. Launch date: March 1.
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
                        <h4 className="font-medium">Mobile App Development</h4>
                        <p className="text-sm text-muted-foreground">
                          Consider native mobile app for student progress tracking - market research needed
                        </p>
                      </div>
                      <Badge variant="outline">Future Consideration</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-blue-200">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium">International Expansion</h4>
                        <p className="text-sm text-muted-foreground">
                          Research CDL training requirements in Canada and Mexico for potential expansion
                        </p>
                      </div>
                      <Badge variant="outline">Research Needed</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-purple-200">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium">API Rate Limiting</h4>
                        <p className="text-sm text-muted-foreground">
                          Implement rate limiting on public API endpoints - security enhancement
                        </p>
                      </div>
                      <Badge variant="outline">Security</Badge>
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