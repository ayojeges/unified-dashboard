"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  FolderKanban, 
  BarChart3, 
  Calendar, 
  MessageSquare, 
  Mic, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Building,
  GraduationCap,
  Brain,
  Package,
  Home
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const mainNavItems = [
  { href: "/", icon: Home, label: "Dashboard" },
  { href: "/projects", icon: FolderKanban, label: "Projects" },
  { href: "/analytics", icon: BarChart3, label: "Analytics" },
  { href: "/calendar", icon: Calendar, label: "Calendar" },
  { href: "/chat", icon: MessageSquare, label: "Chat" },
  { href: "/audio", icon: Mic, label: "Audio" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

const projectNavItems = [
  { href: "/projects/guardiancryo", icon: Package, label: "GuardianCryo" },
  { href: "/projects/cdl-schools", icon: GraduationCap, label: "CDL Schools" },
  { href: "/projects/apply-intelligent", icon: Brain, label: "Apply Intelligent" },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={cn(
      "flex flex-col border-r bg-background transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <LayoutDashboard className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg">Unified Dashboard</h1>
              <p className="text-xs text-muted-foreground">cdlschoolsusa.com</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto">
            <LayoutDashboard className="h-5 w-5 text-white" />
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Main Navigation */}
        <div>
          {!collapsed && (
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Navigation
            </h2>
          )}
          <ul className="space-y-1">
            {mainNavItems.map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== "/" && pathname?.startsWith(item.href));
              
              return (
                <li key={item.href}>
                  <Link href={item.href}>
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      className={cn(
                        "w-full justify-start gap-3",
                        collapsed && "justify-center px-2"
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.label}</span>}
                    </Button>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Projects Section */}
        <div>
          {!collapsed && (
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Projects
            </h2>
          )}
          <ul className="space-y-1">
            {projectNavItems.map((item) => {
              const isActive = pathname === item.href;
              
              return (
                <li key={item.href}>
                  <Link href={item.href}>
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      className={cn(
                        "w-full justify-start gap-3",
                        collapsed && "justify-center px-2"
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.label}</span>}
                    </Button>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* User Profile */}
      <div className={cn(
        "border-t p-4",
        collapsed && "p-2"
      )}>
        {!collapsed ? (
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
              <span className="text-xs font-semibold text-white">A</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Ayo Jegede</p>
              <p className="text-xs text-muted-foreground truncate">admin@cdlschoolsusa.com</p>
            </div>
          </div>
        ) : (
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center mx-auto">
            <span className="text-xs font-semibold text-white">A</span>
          </div>
        )}
      </div>
    </aside>
  );
}