"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar as CalendarIcon,
  Plus, 
  Filter, 
  Users, 
  Clock, 
  Video,
  MapPin,
  MoreVertical
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const events = [
  { 
    id: 1, 
    title: "No events scheduled", 
    description: "Add your first event to get started",
    date: "No date", 
    time: "No time",
    type: "info",
    participants: 0,
    location: "No location"
  },
];

const days = [
  { date: "No date", day: "No", events: [] },
  { date: "No date", day: "events", events: [] },
  { date: "No date", day: "scheduled", events: [] },
  { date: "No date", day: "Add", events: [] },
  { date: "No date", day: "your", events: [] },
  { date: "No date", day: "first", events: [] },
  { date: "No date", day: "event", events: [] },
];

export default function CalendarPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
          <p className="text-muted-foreground">
            Schedule and manage your meetings and events
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Event
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Calendar View */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>March 2024</CardTitle>
                  <CardDescription>
                    Upcoming events and meetings
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    Today
                  </Button>
                  <Button variant="outline" size="sm">
                    &lt;
                  </Button>
                  <Button variant="outline" size="sm">
                    &gt;
                  </Button>
                  <Button variant="outline" size="sm">
                    Month
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Week Header */}
              <div className="grid grid-cols-7 gap-2 mb-4">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="text-center font-medium text-sm">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-2">
                {days.map((day) => (
                  <div
                    key={day.date}
                    className={`min-h-32 rounded-lg border p-3 ${
                      day.date === "2024-03-15" 
                        ? "bg-primary/10 border-primary" 
                        : "bg-background"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-semibold">{day.day}</div>
                        <div className="text-lg font-bold">
                          {new Date(day.date).getDate()}
                        </div>
                      </div>
                      {day.events.length > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          {day.events.length}
                        </Badge>
                      )}
                    </div>
                    
                    {/* Events for the day */}
                    <div className="space-y-1">
                      {day.events.slice(0, 2).map((event) => (
                        <div
                          key={event.id}
                          className="text-xs p-1 rounded bg-blue-100 dark:bg-blue-900 truncate"
                          title={event.title}
                        >
                          {event.time.split(' ')[0]} {event.title}
                        </div>
                      ))}
                      {day.events.length > 2 && (
                        <div className="text-xs text-muted-foreground text-center">
                          +{day.events.length - 2} more
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Events */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>
                Next 7 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {events.slice(0, 4).map((event) => (
                  <div key={event.id} className="space-y-2 border-b pb-4 last:border-0 last:pb-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold">{event.title}</h4>
                        <p className="text-sm text-muted-foreground">{event.description}</p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Edit Event</DropdownMenuItem>
                          <DropdownMenuItem>Duplicate</DropdownMenuItem>
                          <DropdownMenuItem>Share</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="h-3 w-3" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{event.time}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          <span className="text-xs">{event.participants}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {event.location.includes("Zoom") || event.location.includes("Slack") ? (
                            <Video className="h-3 w-3" />
                          ) : (
                            <MapPin className="h-3 w-3" />
                          )}
                          <span className="text-xs">{event.location}</span>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {event.type}
                      </Badge>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        Join
                      </Button>
                      <Button size="sm" className="flex-1">
                        Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Schedule</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Input placeholder="Event title" />
                <Input placeholder="Date and time" type="datetime-local" />
                <Input placeholder="Location or meeting link" />
                <Button className="w-full">Create Event</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}