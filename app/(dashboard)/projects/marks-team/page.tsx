"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem } from "@/components/ui/simple-select";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
  DropdownMenuSeparator, DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import {
  Plus, Users, BarChart, Kanban, Target, CheckCircle, Clock,
  ArrowLeft, TrendingUp, ArrowRight, Trash2, GripVertical, User,
  Building2, Globe, RefreshCw
} from "lucide-react";

const TEAM_API = "https://mark.bluprintcreations.com/team-api/api";

// Real agent team
const teamMembers = [
  {
    id: 1, name: "Mark", role: "PMO Director", avatar: "M",
    skills: ["Strategic Planning", "Team Coordination", "Sprint Management", "Compliance Oversight", "Analytics & Metrics", "Task Delegation"],
    department: "PMO", color: "#DC2626", status: "online", botId: "main",
  },
  {
    id: 2, name: "Innocent", role: "Engineering Lead", avatar: "I",
    skills: ["CI/CD", "Vercel Deploy", "GitHub Deploy", "E2E Testing", "Security", "Observability", "Terminal Access", "Coolify"],
    department: "Engineering", color: "#3B82F6", status: "online", botId: "engineering_lead_bot",
  },
  {
    id: 3, name: "Deb", role: "Growth & Revenue Lead", avatar: "D",
    skills: ["Social Media", "Email Outreach", "SEO", "Content Marketing", "Video Content", "Reddit", "Instagram", "Document Generation"],
    department: "Growth & Revenue", color: "#10B981", status: "online", botId: "growth_revenue_bot",
  },
  {
    id: 4, name: "Akan", role: "Lead Generation Specialist", avatar: "A",
    skills: ["Enterprise Scraping", "Web Crawling", "Email Discovery", "LinkedIn Prospecting", "Deep Research", "Social Intelligence", "NER Extraction"],
    department: "Lead Generation", color: "#F59E0B", status: "online", botId: "akan",
  },
];

const companies = [
  { id: "guardiancryo", name: "Guardian Cryo", url: "https://guardiancryo.com", color: "#0D9488" },
  { id: "cdlschoolsusa", name: "CDL Schools USA", url: "https://cdlschoolsusa.com", color: "#1E40AF" },
  { id: "schoolregistry", name: "School Registry", url: "https://schoolregistry.ng", color: "#059669" },
  { id: "truststayng", name: "TrustStay NG", url: "https://truststayng.com", color: "#7C3AED" },
];

interface Task {
  id: string; title: string; description: string; assignee: string;
  priority: string; status: string; product: string; stage: string;
  type: string; owner_clawbot: string;
}

const STATUS_COLUMNS = ["Backlog", "To Do", "In Progress", "Review", "Done"];
const PRIORITY_COLORS: Record<string, string> = {
  P0: "bg-red-100 text-red-700", P1: "bg-orange-100 text-orange-700",
  P2: "bg-yellow-100 text-yellow-700", P3: "bg-green-100 text-green-700",
};

function TaskCard({ task, onMove, onDelete }: { task: Task; onMove: (id: string, status: string) => void; onDelete: (id: string) => void }) {
  const company = companies.find(c => c.id === task.product);
  return (
    <Card className="cursor-default hover:shadow-md transition-shadow group mb-2" data-testid={`task-card-${task.id}`}>
      <CardContent className="p-3 space-y-2">
        <div className="flex justify-between items-start">
          <p className="text-sm font-medium leading-tight">{task.title}</p>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 shrink-0" data-testid={`task-actions-${task.id}`}>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel className="text-xs">Move to</DropdownMenuLabel>
              {STATUS_COLUMNS.filter(s => s !== task.status).map(s => (
                <DropdownMenuItem key={s} onClick={() => onMove(task.id, s)} data-testid={`move-${task.id}-${s}`}>
                  <ArrowRight className="mr-2 h-3 w-3" />{s}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onDelete(task.id)} className="text-destructive" data-testid={`delete-${task.id}`}>
                <Trash2 className="mr-2 h-3 w-3" />Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <p className="text-xs text-muted-foreground line-clamp-2">{task.description}</p>
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1.5">
            <div className="h-5 w-5 rounded-full flex items-center justify-center text-[10px] text-white font-bold"
              style={{ backgroundColor: teamMembers.find(m => m.name === task.assignee)?.color || "#666" }}>
              {task.assignee?.[0] || "?"}
            </div>
            <span className="text-[11px] text-muted-foreground">{task.assignee}</span>
          </div>
          <div className="flex items-center gap-1.5">
            {company && <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium text-white" style={{ backgroundColor: company.color }}>{company.name.split(" ")[0]}</span>}
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${PRIORITY_COLORS[task.priority] || "bg-gray-100 text-gray-700"}`}>{task.priority}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function MarksTeamPage() {
  const [activeTab, setActiveTab] = useState("board");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterProduct, setFilterProduct] = useState("all");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", description: "", assignee: "Mark", priority: "P1", product: "guardiancryo", status: "Backlog", type: "Feature" });

  const fetchTasks = useCallback(async () => {
    try {
      const url = filterProduct === "all" ? `${TEAM_API}/tasks` : `${TEAM_API}/tasks?product=${filterProduct}`;
      const res = await fetch(url);
      const data = await res.json();
      setTasks(data.tasks || []);
    } catch (e) { console.error("Failed to fetch tasks:", e); }
    setLoading(false);
  }, [filterProduct]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const moveTask = async (id: string, newStatus: string) => {
    try {
      await fetch(`${TEAM_API}/tasks/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: newStatus }) });
      setTasks(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
    } catch (e) { console.error("Move failed:", e); }
  };

  const deleteTask = async (id: string) => {
    try {
      await fetch(`${TEAM_API}/tasks/${id}`, { method: "DELETE" });
      setTasks(prev => prev.filter(t => t.id !== id));
    } catch (e) { console.error("Delete failed:", e); }
  };

  const createTask = async () => {
    try {
      const res = await fetch(`${TEAM_API}/tasks`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...newTask, owner_clawbot: "PMO", stage: "Ideation" }) });
      const data = await res.json();
      if (data.task) { setTasks(prev => [data.task, ...prev]); setAddDialogOpen(false); setNewTask({ title: "", description: "", assignee: "Mark", priority: "P1", product: "guardiancryo", status: "Backlog", type: "Feature" }); }
    } catch (e) { console.error("Create failed:", e); }
  };

  const tasksByStatus = STATUS_COLUMNS.reduce((acc, s) => { acc[s] = tasks.filter(t => t.status === s); return acc; }, {} as Record<string, Task[]>);
  const stats = { total: tasks.length, backlog: tasksByStatus["Backlog"].length, todo: tasksByStatus["To Do"].length, inProgress: tasksByStatus["In Progress"].length, review: tasksByStatus["Review"].length, done: tasksByStatus["Done"].length };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => window.location.href = "/projects"} className="gap-2" data-testid="back-btn">
            <ArrowLeft className="h-4 w-4" />Back
          </Button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight" data-testid="page-title">Blueprint Creations — Command Center</h1>
            <p className="text-sm text-muted-foreground">4 agents, 4 companies, real-time task tracking</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchTasks} data-testid="refresh-btn"><RefreshCw className="h-4 w-4 mr-1" />Refresh</Button>
          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger asChild><Button size="sm" data-testid="add-task-btn"><Plus className="h-4 w-4 mr-1" />Add Task</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>New Task</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <div><Label>Title</Label><Input value={newTask.title} onChange={e => setNewTask(p => ({ ...p, title: e.target.value }))} data-testid="new-task-title" /></div>
                <div><Label>Description</Label><Textarea value={newTask.description} onChange={e => setNewTask(p => ({ ...p, description: e.target.value }))} data-testid="new-task-desc" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Assignee</Label>
                    <Select value={newTask.assignee} onValueChange={v => setNewTask(p => ({ ...p, assignee: v }))} data-testid="new-task-assignee">
                      <SelectContent>{teamMembers.map(m => <SelectItem key={m.name} value={m.name}>{m.name}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div><Label>Company</Label>
                    <Select value={newTask.product} onValueChange={v => setNewTask(p => ({ ...p, product: v }))} data-testid="new-task-product">
                      <SelectContent>{companies.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div><Label>Priority</Label>
                    <Select value={newTask.priority} onValueChange={v => setNewTask(p => ({ ...p, priority: v }))} data-testid="new-task-priority">
                      <SelectContent>
                        <SelectItem value="P0">P0 - Critical</SelectItem>
                        <SelectItem value="P1">P1 - High</SelectItem>
                        <SelectItem value="P2">P2 - Medium</SelectItem>
                        <SelectItem value="P3">P3 - Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div><Label>Status</Label>
                    <Select value={newTask.status} onValueChange={v => setNewTask(p => ({ ...p, status: v }))} data-testid="new-task-status">
                      <SelectContent>{STATUS_COLUMNS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>
                <Button onClick={createTask} className="w-full" disabled={!newTask.title} data-testid="submit-task-btn">Create Task</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Company filter */}
      <div className="flex gap-2 flex-wrap">
        <Button variant={filterProduct === "all" ? "default" : "outline"} size="sm" onClick={() => setFilterProduct("all")} data-testid="filter-all">All ({tasks.length})</Button>
        {companies.map(c => {
          const count = tasks.filter(t => t.product === c.id).length;
          return <Button key={c.id} variant={filterProduct === c.id ? "default" : "outline"} size="sm" onClick={() => setFilterProduct(c.id)} style={filterProduct === c.id ? { backgroundColor: c.color } : {}} data-testid={`filter-${c.id}`}>
            {c.name} ({count})
          </Button>;
        })}
      </div>

      {/* Stats */}
      <div className="grid gap-3 grid-cols-3 md:grid-cols-6">
        {[
          { label: "Total", value: stats.total, icon: Target, color: "bg-blue-100 text-blue-600" },
          { label: "Backlog", value: stats.backlog, icon: Clock, color: "bg-gray-100 text-gray-600" },
          { label: "To Do", value: stats.todo, icon: Target, color: "bg-yellow-100 text-yellow-600" },
          { label: "In Progress", value: stats.inProgress, icon: TrendingUp, color: "bg-purple-100 text-purple-600" },
          { label: "Review", value: stats.review, icon: CheckCircle, color: "bg-orange-100 text-orange-600" },
          { label: "Done", value: stats.done, icon: CheckCircle, color: "bg-green-100 text-green-600" },
        ].map(s => (
          <Card key={s.label}>
            <CardContent className="pt-4 pb-3 px-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <p className="text-xl font-bold">{s.value}</p>
                </div>
                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${s.color}`}>
                  <s.icon className="h-4 w-4" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="board" data-testid="tab-board"><Kanban className="h-4 w-4 mr-1" />Board</TabsTrigger>
          <TabsTrigger value="team" data-testid="tab-team"><Users className="h-4 w-4 mr-1" />Team</TabsTrigger>
          <TabsTrigger value="companies" data-testid="tab-companies"><Building2 className="h-4 w-4 mr-1" />Companies</TabsTrigger>
        </TabsList>

        {/* BOARD TAB */}
        <TabsContent value="board">
          {loading ? <p className="text-center py-10 text-muted-foreground">Loading tasks...</p> : (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {STATUS_COLUMNS.map(status => (
                <div key={status} className="space-y-2">
                  <div className="flex items-center justify-between px-1">
                    <h3 className="font-semibold text-sm">{status}</h3>
                    <span className="text-xs bg-muted px-2 py-0.5 rounded-full">{tasksByStatus[status].length}</span>
                  </div>
                  <div className="min-h-[200px] bg-muted/30 rounded-lg p-2 space-y-2">
                    {tasksByStatus[status].map(task => (
                      <TaskCard key={task.id} task={task} onMove={moveTask} onDelete={deleteTask} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* TEAM TAB */}
        <TabsContent value="team">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {teamMembers.map(member => {
              const memberTasks = tasks.filter(t => t.assignee === member.name);
              const activeTasks = memberTasks.filter(t => t.status === "In Progress").length;
              const todoTasks = memberTasks.filter(t => t.status === "To Do").length;
              const doneTasks = memberTasks.filter(t => t.status === "Done").length;
              return (
                <Card key={member.id} data-testid={`team-member-${member.name}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full flex items-center justify-center text-white font-bold text-lg" style={{ backgroundColor: member.color }}>
                        {member.avatar}
                      </div>
                      <div>
                        <CardTitle className="text-base">{member.name}</CardTitle>
                        <CardDescription className="text-xs">{member.role}</CardDescription>
                      </div>
                      <div className="ml-auto h-2.5 w-2.5 rounded-full bg-green-500" title="Online" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="bg-yellow-50 rounded p-1.5"><p className="text-lg font-bold text-yellow-700">{todoTasks}</p><p className="text-[10px] text-muted-foreground">To Do</p></div>
                      <div className="bg-purple-50 rounded p-1.5"><p className="text-lg font-bold text-purple-700">{activeTasks}</p><p className="text-[10px] text-muted-foreground">Active</p></div>
                      <div className="bg-green-50 rounded p-1.5"><p className="text-lg font-bold text-green-700">{doneTasks}</p><p className="text-[10px] text-muted-foreground">Done</p></div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {member.skills.slice(0, 4).map(s => (
                        <span key={s} className="text-[10px] bg-muted px-1.5 py-0.5 rounded-full">{s}</span>
                      ))}
                      {member.skills.length > 4 && <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded-full">+{member.skills.length - 4}</span>}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* COMPANIES TAB */}
        <TabsContent value="companies">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {companies.map(company => {
              const companyTasks = tasks.filter(t => t.product === company.id);
              const byStatus = STATUS_COLUMNS.reduce((a, s) => { a[s] = companyTasks.filter(t => t.status === s).length; return a; }, {} as Record<string, number>);
              return (
                <Card key={company.id} data-testid={`company-${company.id}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg flex items-center justify-center text-white font-bold" style={{ backgroundColor: company.color }}>
                          {company.name[0]}
                        </div>
                        <div>
                          <CardTitle className="text-base">{company.name}</CardTitle>
                          <a href={company.url} target="_blank" rel="noopener" className="text-xs text-blue-500 hover:underline flex items-center gap-1">
                            <Globe className="h-3 w-3" />{company.url.replace("https://", "")}
                          </a>
                        </div>
                      </div>
                      <span className="text-2xl font-bold">{companyTasks.length}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-5 gap-1 text-center mb-3">
                      {STATUS_COLUMNS.map(s => (
                        <div key={s} className="bg-muted/50 rounded p-1">
                          <p className="text-sm font-bold">{byStatus[s]}</p>
                          <p className="text-[9px] text-muted-foreground">{s}</p>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-1">
                      {companyTasks.filter(t => ["To Do", "In Progress"].includes(t.status)).slice(0, 3).map(t => (
                        <div key={t.id} className="flex items-center justify-between text-xs p-1.5 rounded bg-muted/30">
                          <span className="truncate flex-1">{t.title}</span>
                          <span className={`ml-2 px-1.5 py-0.5 rounded-full text-[10px] ${PRIORITY_COLORS[t.priority]}`}>{t.priority}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
