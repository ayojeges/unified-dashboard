import { ApplyIntelligentKanban } from "@/components/kanban/apply-intelligent-kanban";
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
  Brain,
  BarChart,
  ArrowLeft
} from "lucide-react";

export default function ApplyIntelligentPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
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
            <h1 className="text-3xl font-bold tracking-tight">Apply Intelligent</h1>
            <p className="text-muted-foreground">
              AI-powered college application platform with predictive analytics
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <BarChart className="mr-2 h-4 w-4" />
            Analytics Dashboard
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
                <p className="text-sm font-medium">Active Users</p>
                <p className="text-2xl font-bold">1,248</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">AI Predictions</p>
                <p className="text-2xl font-bold">8,942</p>
              </div>
              <Brain className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Pending Tasks</p>
                <p className="text-2xl font-bold">32</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Accuracy Rate</p>
                <p className="text-2xl font-bold">94%</p>
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
          <ApplyIntelligentKanban />
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
                      <CardTitle className="text-sm">AI Model Update</CardTitle>
                      <Badge variant="secondary">Completed</Badge>
                    </div>
                    <CardDescription>Updated on Feb 13, 2026</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      Deployed updated GPT-4 model for essay analysis. Accuracy improved from 
                      89% to 94% on test dataset. Monitoring performance in production.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm">College Database Sync</CardTitle>
                      <Badge variant="outline">In Progress</Badge>
                    </div>
                    <CardDescription>Updated on Feb 16, 2026</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      Syncing with Common App API to get real-time application deadlines and 
                      requirements. Estimated completion: Feb 20.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm">User Feedback Analysis</CardTitle>
                      <Badge variant="outline">Analysis</Badge>
                    </div>
                    <CardDescription>Updated on Feb 17, 2026</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      Collected 247 user feedback responses. Top request: Scholarship matching 
                      feature. Planning phase for Q2 development.
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
                          Native mobile app for iOS/Android - user requested but web app works fine
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
                          Research college application systems in UK, Canada, Australia
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
                        <h4 className="font-medium">Advanced Analytics Dashboard</h4>
                        <p className="text-sm text-muted-foreground">
                          Real-time analytics with predictive trends - nice to have feature
                        </p>
                      </div>
                      <Badge variant="outline">Enhancement</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-red-200">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium">API Rate Limiting</h4>
                        <p className="text-sm text-muted-foreground">
                          Implement stricter rate limiting on prediction API endpoints
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