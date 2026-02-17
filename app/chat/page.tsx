"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Send, 
  Search, 
  Users, 
  Phone, 
  Video, 
  MoreVertical,
  Paperclip,
  Smile,
  Bell,
  BellOff
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const conversations = [
  { 
    id: 1, 
    name: "Team Channel", 
    lastMessage: "Let's discuss the Q2 roadmap tomorrow at 10 AM", 
    time: "10:30 AM",
    unread: 3,
    online: true,
    type: "group"
  },
  { 
    id: 2, 
    name: "Alex Johnson", 
    lastMessage: "I've completed the homepage design", 
    time: "09:45 AM",
    unread: 0,
    online: true,
    type: "direct"
  },
  { 
    id: 3, 
    name: "Sarah Miller", 
    lastMessage: "Can you review the API documentation?", 
    time: "Yesterday",
    unread: 1,
    online: false,
    type: "direct"
  },
  { 
    id: 4, 
    name: "Project Alpha", 
    lastMessage: "Meeting notes from yesterday's sync", 
    time: "Yesterday",
    unread: 0,
    online: true,
    type: "group"
  },
  { 
    id: 5, 
    name: "Mike Chen", 
    lastMessage: "Thanks for the feedback!", 
    time: "Mar 12",
    unread: 0,
    online: true,
    type: "direct"
  },
];

const messages = [
  { id: 1, sender: "Alex Johnson", text: "Hey team, I've completed the homepage design. Let me know your thoughts!", time: "10:15 AM", isOwn: false },
  { id: 2, sender: "You", text: "Looks great Alex! The color scheme works well with our brand.", time: "10:16 AM", isOwn: true },
  { id: 3, sender: "Sarah Miller", text: "I agree. The layout is clean and intuitive.", time: "10:17 AM", isOwn: false },
  { id: 4, sender: "You", text: "Can we add a dark mode toggle? That would be a nice feature.", time: "10:18 AM", isOwn: true },
  { id: 5, sender: "Alex Johnson", text: "Good idea! I'll work on that today.", time: "10:20 AM", isOwn: false },
  { id: 6, sender: "Mike Chen", text: "I can help with the implementation if needed.", time: "10:21 AM", isOwn: false },
];

export default function ChatPage() {
  const [activeChat, setActiveChat] = useState(1);
  const [message, setMessage] = useState("");
  const [muted, setMuted] = useState(false);

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log("Sending message:", message);
      setMessage("");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Team Chat</h1>
          <p className="text-muted-foreground">
            Real-time communication with your team
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Users className="mr-2 h-4 w-4" />
            New Group
          </Button>
          <Button size="sm">
            Start Chat
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Conversations List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>Conversations</CardTitle>
                <Badge variant="secondary">8</Badge>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search messages..."
                  className="pl-9"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-accent ${
                      activeChat === conversation.id ? "bg-accent" : ""
                    }`}
                    onClick={() => setActiveChat(conversation.id)}
                  >
                    <div className="relative">
                      <Avatar>
                        <AvatarImage src={`/avatar-${conversation.id}.jpg`} />
                        <AvatarFallback>
                          {conversation.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      {conversation.online && (
                        <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background bg-green-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium truncate">{conversation.name}</p>
                        <span className="text-xs text-muted-foreground">
                          {conversation.time}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {conversation.lastMessage}
                      </p>
                    </div>
                    {conversation.unread > 0 && (
                      <Badge className="ml-auto">{conversation.unread}</Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-3">
          <Card className="h-[600px] flex flex-col">
            {/* Chat Header */}
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src="/avatar-team.jpg" />
                    <AvatarFallback>TC</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>Team Channel</CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      8 members online
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setMuted(!muted)}
                  >
                    {muted ? (
                      <BellOff className="h-4 w-4" />
                    ) : (
                      <Bell className="h-4 w-4" />
                    )}
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Video className="h-4 w-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Members</DropdownMenuItem>
                      <DropdownMenuItem>Notification Settings</DropdownMenuItem>
                      <DropdownMenuItem>Share Chat</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        Leave Channel
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>

            {/* Messages */}
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.isOwn ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      msg.isOwn
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    {!msg.isOwn && (
                      <div className="font-medium text-sm mb-1">
                        {msg.sender}
                      </div>
                    )}
                    <p>{msg.text}</p>
                    <div
                      className={`text-xs mt-1 ${
                        msg.isOwn
                          ? "text-primary-foreground/70"
                          : "text-muted-foreground"
                      }`}
                    >
                      {msg.time}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>

            {/* Message Input */}
            <div className="border-t p-4">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Input
                  placeholder="Type your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  className="flex-1"
                />
                <Button variant="ghost" size="icon">
                  <Smile className="h-4 w-4" />
                </Button>
                <Button onClick={handleSendMessage}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}