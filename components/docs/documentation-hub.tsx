"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  BookOpen, 
  Folder, 
  Search, 
  Plus, 
  Download, 
  Share2, 
  Edit,
  Clock,
  User,
  Tag,
  Eye,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  Code,
  Settings,
  Users
} from "lucide-react";

interface DocumentationHubProps {
  projectId: string;
}

interface Document {
  id: string;
  title: string;
  description: string;
  category: string;
  author: string;
  lastUpdated: string;
  views: number;
  status: "draft" | "published" | "archived";
  tags: string[];
}

interface Category {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  documentCount: number;
}

export function DocumentationHub({ projectId }: DocumentationHubProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  // Mock documents data
  const documents: Document[] = [
    {
      id: "1",
      title: "Project Overview & Vision",
      description: "Complete overview of Mark's Team project including vision, goals, and success metrics.",
      category: "project",
      author: "Mark",
      lastUpdated: "2026-02-24",
      views: 142,
      status: "published",
      tags: ["vision", "strategy", "goals"]
    },
    {
      id: "2",
      title: "Team Structure & Roles",
      description: "Detailed breakdown of team hierarchy, roles, responsibilities, and reporting structure.",
      category: "team",
      author: "Sarah Chen",
      lastUpdated: "2026-02-23",
      views: 98,
      status: "published",
      tags: ["roles", "structure", "responsibilities"]
    },
    {
      id: "3",
      title: "Development Workflow",
      description: "Step-by-step guide to our development process from ideation to deployment.",
      category: "development",
      author: "Alex Rodriguez",
      lastUpdated: "2026-02-22",
      views: 156,
      status: "published",
      tags: ["workflow", "development", "process"]
    },
    {
      id: "4",
      title: "Design System Guidelines",
      description: "Comprehensive design system including components, colors, typography, and spacing.",
      category: "design",
      author: "Alex Rodriguez",
      lastUpdated: "2026-02-21",
      views: 87,
      status: "published",
      tags: ["design", "ui", "components"]
    },
    {
      id: "5",
      title: "Marketing Strategy",
      description: "Complete marketing plan including channels, messaging, and performance tracking.",
      category: "marketing",
      author: "Jamie Wilson",
      lastUpdated: "2026-02-20",
      views: 73,
      status: "published",
      tags: ["marketing", "strategy", "campaigns"]
    },
    {
      id: "6",
      title: "Sales Process Documentation",
      description: "Detailed sales process from lead generation to closing and onboarding.",
      category: "sales",
      author: "Taylor Kim",
      lastUpdated: "2026-02-19",
      views: 65,
      status: "published",
      tags: ["sales", "process", "leads"]
    },
    {
      id: "7",
      title: "Content Creation Guidelines",
      description: "Standards and best practices for content creation across all platforms.",
      category: "content",
      author: "Morgan Lee",
      lastUpdated: "2026-02-18",
      views: 54,
      status: "published",
      tags: ["content", "guidelines", "creation"]
    },
    {
      id: "8",
      title: "QA Testing Procedures",
      description: "Comprehensive testing procedures and quality assurance standards.",
      category: "qa",
      author: "Jordan Patel",
      lastUpdated: "2026-02-17",
      views: 48,
      status: "published",
      tags: ["testing", "qa", "procedures"]
    },
    {
      id: "9",
      title: "DevOps & Deployment Guide",
      description: "Infrastructure, deployment pipelines, and monitoring procedures.",
      category: "devops",
      author: "Casey Brooks",
      lastUpdated: "2026-02-16",
      views: 42,
      status: "published",
      tags: ["devops", "deployment", "infrastructure"]
    },
    {
      id: "10",
      title: "Team Communication Protocol",
      description: "Guidelines for team communication, meetings, and collaboration tools.",
      category: "communication",
      author: "Mark",
      lastUpdated: "2026-02-15",
      views: 89,
      status: "published",
      tags: ["communication", "collaboration", "meetings"]
    }
  ];

  const categories: Category[] = [
    { id: "all", name: "All Documents", description: "Browse all documentation", icon: <Folder className="h-5 w-5" />, documentCount: documents.length },
    { id: "project", name: "Project Docs", description: "Project overview and vision", icon: <FileText className="h-5 w-5" />, documentCount: 1 },
    { id: "team", name: "Team Docs", description: "Team structure and roles", icon: <Users className="h-5 w-5" />, documentCount: 1 },
    { id: "development", name: "Development", description: "Code and workflow docs", icon: <Code className="h-5 w-5" />, documentCount: 1 },
    { id: "design", name: "Design", description: "Design system and guidelines", icon: <Edit className="h-5 w-5" />, documentCount: 1 },
    { id: "marketing", name: "Marketing", description: "Marketing strategy docs", icon: <Share2 className="h-5 w-5" />, documentCount: 1 },
    { id: "sales", name: "Sales", description: "Sales process docs", icon: <MessageSquare className="h-5 w-5" />, documentCount: 1 },
    { id: "content", name: "Content", description: "Content creation docs", icon: <Edit className="h-5 w-5" />, documentCount: 1 },
    { id: "qa", name: "QA", description: "Testing procedures", icon: <CheckCircle className="h-5 w-5" />, documentCount: 1 },
    { id: "devops", name: "DevOps", description: "Deployment guides", icon: <Settings className="h-5 w-5" />, documentCount: 1 },
    { id: "communication", name: "Communication", description: "Team communication", icon: <MessageSquare className="h-5 w-5" />, documentCount: 1 }
  ];

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = searchQuery === "" || 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = activeCategory === "all" || doc.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  const getStatusBadge = (status: Document["status"]) => {
    switch (status) {
      case "published":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Published</Badge>;
      case "draft":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Draft</Badge>;
      case "archived":
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Archived</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Documentation Hub</h2>
          <p className="text-muted-foreground">
            Central repository for all project documentation, guidelines, and resources
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export All
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Document
          </Button>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search documentation by title, description, or tags..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            <Badge variant="outline" className="cursor-pointer hover:bg-muted">
              <Tag className="mr-1 h-3 w-3" />
              All Tags
            </Badge>
            {Array.from(new Set(documents.flatMap(doc => doc.tags))).slice(0, 8).map(tag => (
              <Badge key={tag} variant="outline" className="cursor-pointer hover:bg-muted">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Categories */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map(category => (
          <Card 
            key={category.id}
            className={`cursor-pointer transition-all hover:shadow-md ${activeCategory === category.id ? 'border-blue-500 border-2' : ''}`}
            onClick={() => setActiveCategory(category.id)}
          >
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className={`h-12 w-12 rounded-full flex items-center justify-center mb-3 ${activeCategory === category.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>
                  {category.icon}
                </div>
                <div className="font-medium">{category.name}</div>
                <div className="text-sm text-muted-foreground mt-1">{category.documentCount} docs</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDocuments.map(doc => (
          <Card key={doc.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{doc.title}</CardTitle>
                    <CardDescription className="line-clamp-1">{doc.description}</CardDescription>
                  </div>
                </div>
                {getStatusBadge(doc.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-2">{doc.description}</p>
                
                <div className="flex flex-wrap gap-1">
                  {doc.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      <span>{doc.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{doc.lastUpdated}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    <span>{doc.views}</span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <BookOpen className="mr-2 h-3 w-3" />
                    Read
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Documentation Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Documentation Statistics</CardTitle>
          <CardDescription>
            Overview of documentation health and usage
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex flex-col items-center p-4 rounded-lg border">
              <div className="text-2xl font-bold">{documents.length}</div>
              <div className="text-sm text-muted-foreground">Total Documents</div>
            </div>
            <div className="flex flex-col items-center p-4 rounded-lg border">
              <div className="text-2xl font-bold">{documents.filter(d => d.status === "published").length}</div>
              <div className="text-sm text-muted-foreground">Published</div>
            </div>
            <div className="flex flex-col items-center p-4 rounded-lg border">
              <div className="text-2xl font-bold">{documents.reduce((sum, doc) => sum + doc.views, 0)}</div>
              <div className="text-sm text-muted-foreground">Total Views</div>
            </div>
            <div className="flex flex-col items-center p-4 rounded-lg border">
              <div className="text-2xl font-bold">{categories.length - 1}</div>
              <div className="text-sm text-muted-foreground">Categories</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common documentation tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="flex flex-col items-center justify-center h-24">
              <Plus className="h-6 w-6 mb-2" />
              <span>New Document</span>
            </Button>
            <Button variant="outline" className="flex flex-col items-center justify-center h-24">
              <Edit className="h-6 w-6 mb-2" />
              <span>Edit Templates</span>
            </Button>
            <Button variant="outline" className="flex flex-col items-center justify-center h-24">
              <Share2 className="h-6 w-6 mb-2" />
              <span>Share Library</span>
            </Button>
            <Button variant="outline" className="flex flex-col items-center justify-center h-24">
              <HelpCircle className="h-6 w-6 mb-2" />
              <span>Get Help</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}