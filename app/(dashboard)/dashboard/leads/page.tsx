"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Search, Plus, Download, Filter, Phone, MapPin, TrendingUp, CheckCircle } from "lucide-react";

const leadStats = [
  { label: "Total Leads", value: "5,595", icon: Users, color: "text-blue-500" },
  { label: "Hot Leads", value: "847", icon: TrendingUp, color: "text-red-500" },
  { label: "Contacted", value: "2,341", icon: Phone, color: "text-green-500" },
  { label: "Converted", value: "156", icon: CheckCircle, color: "text-purple-500" },
];

const recentLeads = [
  { id: 1, name: "Thompson Trucking LLC", contact: "Mike Thompson", email: "mike@thompsontrucking.com", phone: "(555) 123-4567", source: "CDL Schools USA", status: "Hot", location: "Houston, TX" },
  { id: 2, name: "Lagos Short Stays", contact: "Adebayo Ogunlesi", email: "ade@lagosshortstays.ng", phone: "+234 801 234 5678", source: "TrustStayNG", status: "Warm", location: "Lekki, Lagos" },
  { id: 3, name: "Abuja Wellness Center", contact: "Dr. Nnamdi Okafor", email: "nnamdi@abujawellness.ng", phone: "+234 802 345 6789", source: "Guardian Cryo", status: "Hot", location: "Wuse 2, Abuja" },
  { id: 4, name: "Swift Logistics Inc", contact: "James Rivera", email: "jrivera@swiftlogistics.com", phone: "(555) 987-6543", source: "CDL Schools USA", status: "Cold", location: "Dallas, TX" },
  { id: 5, name: "Victoria Island Suites", contact: "Chioma Eze", email: "chioma@visuites.ng", phone: "+234 803 456 7890", source: "TrustStayNG", status: "Warm", location: "VI, Lagos" },
];

const statusColors: Record<string, string> = {
  Hot: "bg-red-100 text-red-800",
  Warm: "bg-yellow-100 text-yellow-800",
  Cold: "bg-blue-100 text-blue-800",
};

export default function LeadsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Leads</h1>
          <p className="text-muted-foreground">Manage and track leads across all projects</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm"><Filter className="h-4 w-4 mr-2" />Filter</Button>
          <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-2" />Export</Button>
          <Button size="sm"><Plus className="h-4 w-4 mr-2" />Add Lead</Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {leadStats.map((stat) => (
          <Card key={stat.label}><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">{stat.label}</p><p className="text-2xl font-bold">{stat.value}</p></div><stat.icon className={`h-8 w-8 ${stat.color}`} /></div></CardContent></Card>
        ))}
      </div>
      <Card>
        <CardHeader><div className="flex items-center justify-between"><CardTitle>Recent Leads</CardTitle><div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search leads..." className="pl-9 w-64" /></div></div></CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList><TabsTrigger value="all">All Leads</TabsTrigger><TabsTrigger value="hot">Hot</TabsTrigger><TabsTrigger value="warm">Warm</TabsTrigger><TabsTrigger value="cold">Cold</TabsTrigger></TabsList>
            <TabsContent value="all" className="mt-4">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead><tr className="border-b text-left"><th className="pb-3 font-medium text-muted-foreground">Company</th><th className="pb-3 font-medium text-muted-foreground">Contact</th><th className="pb-3 font-medium text-muted-foreground">Source</th><th className="pb-3 font-medium text-muted-foreground">Status</th><th className="pb-3 font-medium text-muted-foreground">Location</th></tr></thead>
                  <tbody className="divide-y">
                    {recentLeads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-muted/50">
                        <td className="py-3 font-medium">{lead.name}</td>
                        <td className="py-3"><div><p className="text-sm">{lead.contact}</p><p className="text-xs text-muted-foreground">{lead.email}</p><p className="text-xs text-muted-foreground">{lead.phone}</p></div></td>
                        <td className="py-3 text-sm">{lead.source}</td>
                        <td className="py-3"><Badge className={statusColors[lead.status]}>{lead.status}</Badge></td>
                        <td className="py-3 text-sm flex items-center gap-1"><MapPin className="h-3 w-3" />{lead.location}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
            <TabsContent value="hot"><p className="text-muted-foreground text-center py-8">Filter: Hot leads</p></TabsContent>
            <TabsContent value="warm"><p className="text-muted-foreground text-center py-8">Filter: Warm leads</p></TabsContent>
            <TabsContent value="cold"><p className="text-muted-foreground text-center py-8">Filter: Cold leads</p></TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
