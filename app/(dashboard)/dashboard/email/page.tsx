"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Send, Inbox, Archive, Star, Search, Plus, RefreshCw, Users, Clock } from "lucide-react";

const sampleEmails = [
  { id: 1, from: "Sarah Chen", subject: "Sprint 12 Review - Action Items", time: "2h ago", read: false, starred: true },
  { id: 2, from: "Jamie Wilson", subject: "CDL Schools USA - Campaign Results", time: "4h ago", read: false, starred: false },
  { id: 3, from: "Alex Rodriguez", subject: "Guardian Cryo - Product Spec Update", time: "6h ago", read: true, starred: false },
  { id: 4, from: "Jordan Patel", subject: "QA Report - Build v2.3.1", time: "1d ago", read: true, starred: false },
  { id: 5, from: "French Dupont", subject: "Customer Escalation - Ticket #1847", time: "1d ago", read: true, starred: true },
];

export default function EmailHubPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Email Hub</h1>
          <p className="text-muted-foreground">Centralized email management for all projects</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm"><RefreshCw className="h-4 w-4 mr-2" />Sync</Button>
          <Button size="sm"><Plus className="h-4 w-4 mr-2" />Compose</Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Inbox</p><p className="text-2xl font-bold">24</p></div><Inbox className="h-8 w-8 text-blue-500" /></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Sent</p><p className="text-2xl font-bold">156</p></div><Send className="h-8 w-8 text-green-500" /></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Archived</p><p className="text-2xl font-bold">89</p></div><Archive className="h-8 w-8 text-yellow-500" /></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Contacts</p><p className="text-2xl font-bold">342</p></div><Users className="h-8 w-8 text-purple-500" /></div></CardContent></Card>
      </div>
      <Card>
        <CardHeader><div className="flex items-center justify-between"><CardTitle>Recent Emails</CardTitle><div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search emails..." className="pl-9 w-64" /></div></div></CardHeader>
        <CardContent>
          <Tabs defaultValue="inbox">
            <TabsList><TabsTrigger value="inbox">Inbox</TabsTrigger><TabsTrigger value="sent">Sent</TabsTrigger><TabsTrigger value="starred">Starred</TabsTrigger><TabsTrigger value="archived">Archived</TabsTrigger></TabsList>
            <TabsContent value="inbox" className="space-y-2 mt-4">
              {sampleEmails.map((email) => (
                <div key={email.id} className={`flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 cursor-pointer ${!email.read ? 'bg-blue-50/50 border-blue-200' : ''}`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-2 h-2 rounded-full ${!email.read ? 'bg-blue-500' : 'bg-transparent'}`} />
                    <div><p className={`font-medium ${!email.read ? 'font-bold' : ''}`}>{email.from}</p><p className="text-sm text-muted-foreground">{email.subject}</p></div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground"><Clock className="h-3 w-3" />{email.time}</div>
                    {email.starred && <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />}
                  </div>
                </div>
              ))}
            </TabsContent>
            <TabsContent value="sent"><p className="text-muted-foreground text-center py-8">Sent emails will appear here</p></TabsContent>
            <TabsContent value="starred"><p className="text-muted-foreground text-center py-8">Starred emails will appear here</p></TabsContent>
            <TabsContent value="archived"><p className="text-muted-foreground text-center py-8">Archived emails will appear here</p></TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
