"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar as CalendarIcon,
  Plus, 
  Clock, 
  Video,
  MapPin,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  X
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface CalendarEvent {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  type: string;
  location: string;
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [newEvent, setNewEvent] = useState({ title: '', description: '', time: '', location: '' });

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    const days = [];
    // Add empty cells for days before the first of the month
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    // Add the days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  const handleCreateEvent = () => {
    if (!selectedDate || !newEvent.title) return;
    
    const event: CalendarEvent = {
      id: Date.now(),
      title: newEvent.title,
      description: newEvent.description,
      date: selectedDate.toISOString().split('T')[0],
      time: newEvent.time || '09:00',
      type: 'meeting',
      location: newEvent.location || 'Online'
    };
    
    setEvents([...events, event]);
    setNewEvent({ title: '', description: '', time: '', location: '' });
    setShowEventDialog(false);
  };

  const deleteEvent = (eventId: number) => {
    setEvents(events.filter(e => e.id !== eventId));
  };

  const getEventsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return events.filter(e => e.date === dateStr);
  };

  const days = getDaysInMonth(currentDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Calendar</h1>
          <p className="text-muted-foreground text-sm">
            Schedule and manage your meetings and events
          </p>
        </div>
        <Button onClick={() => setShowEventDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Event
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Calendar View */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <CardTitle>{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</CardTitle>
                  <CardDescription>
                    Click on a date to select it, then create events
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={goToToday}>
                    Today
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => navigateMonth('prev')}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => navigateMonth('next')}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Week Header */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="text-center font-medium text-xs sm:text-sm py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {days.map((date, index) => {
                  if (!date) {
                    return <div key={`empty-${index}`} className="min-h-[60px] sm:min-h-[80px]" />;
                  }
                  
                  const dateEvents = getEventsForDate(date);
                  const isToday = date.getTime() === today.getTime();
                  const isSelected = selectedDate && date.getTime() === selectedDate.getTime();
                  
                  return (
                    <div
                      key={date.toISOString()}
                      onClick={() => handleDateClick(date)}
                      className={`min-h-[60px] sm:min-h-[80px] rounded-lg border p-1 sm:p-2 cursor-pointer transition-colors ${
                        isSelected 
                          ? "bg-primary/20 border-primary" 
                          : isToday 
                            ? "bg-blue-50 border-blue-300 dark:bg-blue-950" 
                            : "hover:bg-accent"
                      }`}
                    >
                      <div className={`text-xs sm:text-sm font-semibold ${isToday ? 'text-blue-600' : ''}`}>
                        {date.getDate()}
                      </div>
                      {dateEvents.length > 0 && (
                        <div className="mt-1 space-y-0.5">
                          {dateEvents.slice(0, 2).map((event) => (
                            <div
                              key={event.id}
                              className="text-[10px] sm:text-xs p-0.5 rounded bg-blue-100 dark:bg-blue-900 truncate"
                            >
                              {event.title}
                            </div>
                          ))}
                          {dateEvents.length > 2 && (
                            <div className="text-[10px] text-muted-foreground">
                              +{dateEvents.length - 2} more
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Selected Date Events */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {selectedDate 
                  ? selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
                  : 'Select a Date'}
              </CardTitle>
              <CardDescription>
                {selectedDate ? `${getEventsForDate(selectedDate).length} events` : 'Click a date to view events'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedDate && getEventsForDate(selectedDate).length > 0 ? (
                <div className="space-y-3">
                  {getEventsForDate(selectedDate).map((event) => (
                    <div key={event.id} className="border rounded-lg p-3 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold text-sm">{event.title}</h4>
                          {event.description && (
                            <p className="text-xs text-muted-foreground">{event.description}</p>
                          )}
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => deleteEvent(event.id)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {event.time}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {event.location}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  {selectedDate ? 'No events on this date' : 'Select a date to view events'}
                </div>
              )}
              
              {selectedDate && (
                <Button className="w-full mt-4" onClick={() => setShowEventDialog(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Event
                </Button>
              )}
            </CardContent>
          </Card>

          {/* All Upcoming Events */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">All Events</CardTitle>
              <CardDescription>{events.length} total events</CardDescription>
            </CardHeader>
            <CardContent>
              {events.length > 0 ? (
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-2 border rounded text-sm">
                      <div>
                        <div className="font-medium">{event.title}</div>
                        <div className="text-xs text-muted-foreground">{event.date} at {event.time}</div>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => deleteEvent(event.id)}>
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-muted-foreground text-sm">
                  No events yet. Click on a date and add one!
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Create Event Dialog */}
      <Dialog open={showEventDialog} onOpenChange={setShowEventDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Event</DialogTitle>
            <DialogDescription>
              {selectedDate 
                ? `Add an event for ${selectedDate.toLocaleDateString()}`
                : 'Select a date first, then create an event'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Event Title *</label>
              <Input
                placeholder="Meeting with team..."
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Input
                placeholder="Optional description..."
                value={newEvent.description}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Time</label>
                <Input
                  type="time"
                  value={newEvent.time}
                  onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Location</label>
                <Input
                  placeholder="Zoom, Office, etc."
                  value={newEvent.location}
                  onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEventDialog(false)}>Cancel</Button>
            <Button onClick={handleCreateEvent} disabled={!selectedDate || !newEvent.title}>
              Create Event
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
