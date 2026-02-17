"use client";
import { CDLKanban } from "@/components/kanban/cdl-kanban";
import { ProjectBoard } from "@/components/project-board";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  CheckCircle,
  Clock,
  GraduationCap,
  Building,
  ArrowLeft
} from "lucide-react";

export default function CDLSchoolsPage() {
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
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">CDL Schools</h1>
            <p className="text-muted-foreground">
              Commercial Driver&apos;s License training and certification platform
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline">
            <Building className="mr-2 h-4 w-4" />
            Partner Management
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium">Active Partners</p>
                <p className="text-lg sm:text-2xl font-bold">0</p>
              </div>
              <Building className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium">Students Enrolled</p>
                <p className="text-lg sm:text-2xl font-bold">0</p>
              </div>
              <GraduationCap className="h-6 w-6 sm:h-8 sm:w-8 text-green-500" />
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

      {/* Project Board with Kanban, Notes, and Parking Lot */}
      <ProjectBoard 
        projectKey="cdl-schools"
        kanbanComponent={<CDLKanban />}
      />
    </div>
  );
}
