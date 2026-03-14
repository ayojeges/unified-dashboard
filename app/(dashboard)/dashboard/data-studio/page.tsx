"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart3, PieChart, TrendingUp, Database, Plus, Download, RefreshCw, FileText, Video } from "lucide-react";

const dataProjects = [
  { id: 1, name: "CDL Schools Lead Analysis", type: "chart", status: "active", lastUpdated: "2h ago", records: "5,000" },
  { id: 2, name: "Guardian Cryo Market Research", type: "report", status: "active", lastUpdated: "1d ago", records: "342" },
  { id: 3, name: "TrustStayNG Host Distribution", type: "map", status: "draft", lastUpdated: "3d ago", records: "595" },
  { id: 4, name: "School Registry SEO Data", type: "report", status: "archived", lastUpdated: "1w ago", records: "1,200" },
];

const typeIcons: Record<string, any> = { chart: BarChart3, report: FileText, map: TrendingUp };
const statusColors: Record<string, string> = { active: "bg-green-100 text-green-800", draft: "bg-yellow-100 text-yellow-800", archived: "bg-gray-100 text-gray-800" };

export default function DataStudioPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Data Studio</h1>
          <p className="text-muted-foreground">Data visualization, reports, and analytics pipelines</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm"><RefreshCw className="h-4 w-4 mr-2" />Refresh</Button>
          <Button size="sm"><Plus className="h-4 w-4 mr-2" />New Report</Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Data Sources</p><p className="text-2xl font-bold">12</p></div><Database className="h-8 w-8 text-blue-500" /></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Reports</p><p className="text-2xl font-bold">28</p></div><FileText className="h-8 w-8 text-green-500" /></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Charts</p><p className="text-2xl font-bold">45</p></div><BarChart3 className="h-8 w-8 text-purple-500" /></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Total Records</p><p className="text-2xl font-bold">7,137</p></div><TrendingUp className="h-8 w-8 text-orange-500" /></div></CardContent></Card>
      </div>
      <Card>
        <CardHeader><CardTitle>Data Videos</CardTitle><CardDescription>Generate animated data visualization videos for social media</CardDescription></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4 hover:bg-muted/50 cursor-pointer"><Video className="h-8 w-8 text-blue-500 mb-2" /><h3 className="font-medium">Line Race</h3><p className="text-sm text-muted-foreground">Animated line chart over time</p></div>
            <div className="border rounded-lg p-4 hover:bg-muted/50 cursor-pointer"><BarChart3 className="h-8 w-8 text-green-500 mb-2" /><h3 className="font-medium">Bar Race</h3><p className="text-sm text-muted-foreground">Animated bar chart ranking</p></div>
            <div className="border rounded-lg p-4 hover:bg-muted/50 cursor-pointer"><PieChart className="h-8 w-8 text-purple-500 mb-2" /><h3 className="font-medium">Donut Chart</h3><p className="text-sm text-muted-foreground">Animated pie/donut chart</p></div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Recent Reports</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {dataProjects.map((project) => {
              const Icon = typeIcons[project.type] || FileText;
              return (
                <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                  <div className="flex items-center gap-4">
                    <Icon className="h-8 w-8 text-muted-foreground" />
                    <div><p className="font-medium">{project.name}</p><p className="text-sm text-muted-foreground">{project.records} records • Updated {project.lastUpdated}</p></div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={statusColors[project.status]}>{project.status}</Badge>
                    <Button variant="ghost" size="sm"><Download className="h-4 w-4" /></Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
