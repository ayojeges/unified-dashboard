"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Mail, 
  Phone, 
  Briefcase, 
  Star, 
  TrendingUp,
  Clock,
  CheckCircle,
  User,
  MoreVertical
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TeamMember {
  id: number;
  name: string;
  role: string;
  email: string;
  avatar: string;
  skills: string[];
  responsibilities: string[];
  activeTasks: number;
  completedTasks: number;
  status: "online" | "away" | "offline";
  color: string;
}

interface TeamProfilesProps {
  teamMembers: TeamMember[];
}

export function TeamProfiles({ teamMembers }: TeamProfilesProps) {
  const getStatusColor = (status: TeamMember["status"]) => {
    switch (status) {
      case "online": return "bg-green-500";
      case "away": return "bg-yellow-500";
      case "offline": return "bg-gray-400";
      default: return "bg-gray-400";
    }
  };

  const getStatusText = (status: TeamMember["status"]) => {
    switch (status) {
      case "online": return "Online";
      case "away": return "Away";
      case "offline": return "Offline";
      default: return "Offline";
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {teamMembers.map((member) => (
          <Card key={member.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div 
                      className="h-12 w-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
                      style={{ backgroundColor: member.color }}
                    >
                      {member.avatar}
                    </div>
                    <div className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${getStatusColor(member.status)}`} />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{member.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                    <Badge 
                      variant="outline" 
                      className="mt-1 text-xs"
                      style={{ 
                        borderColor: member.color,
                        color: member.color
                      }}
                    >
                      {getStatusText(member.status)}
                    </Badge>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View Profile</DropdownMenuItem>
                    <DropdownMenuItem>Send Message</DropdownMenuItem>
                    <DropdownMenuItem>Edit Profile</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      Remove from Team
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Contact Info */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{member.email}</span>
                </div>
              </div>

              {/* Performance Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-muted rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Active Tasks</p>
                      <p className="text-lg font-bold">{member.activeTasks}</p>
                    </div>
                    <Clock className="h-4 w-4 text-blue-500" />
                  </div>
                </div>
                <div className="bg-muted rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Completed</p>
                      <p className="text-lg font-bold">{member.completedTasks}</p>
                    </div>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div>
                <p className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  Skills
                </p>
                <div className="flex flex-wrap gap-1">
                  {member.skills.slice(0, 4).map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {member.skills.length > 4 && (
                    <Badge variant="outline" className="text-xs">
                      +{member.skills.length - 4} more
                    </Badge>
                  )}
                </div>
              </div>

              {/* Responsibilities */}
              <div>
                <p className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  Key Responsibilities
                </p>
                <ul className="space-y-1">
                  {member.responsibilities.slice(0, 3).map((responsibility, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground mt-1.5 flex-shrink-0" />
                      {responsibility}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Mail className="h-4 w-4 mr-2" />
                  Message
                </Button>
                <Button size="sm" className="flex-1" style={{ backgroundColor: member.color }}>
                  <TrendingUp className="h-4 w-4 mr-2" />
                  View Stats
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Team Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Team Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-2xl font-bold">{teamMembers.length}</p>
              <p className="text-sm text-muted-foreground">Total Members</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-2xl font-bold">
                {teamMembers.filter(m => m.status === "online").length}
              </p>
              <p className="text-sm text-muted-foreground">Online Now</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-2xl font-bold">
                {teamMembers.reduce((sum, m) => sum + m.activeTasks, 0)}
              </p>
              <p className="text-sm text-muted-foreground">Active Tasks</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-2xl font-bold">
                {teamMembers.reduce((sum, m) => sum + m.completedTasks, 0)}
              </p>
              <p className="text-sm text-muted-foreground">Tasks Completed</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}