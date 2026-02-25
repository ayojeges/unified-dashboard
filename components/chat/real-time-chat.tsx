"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Send, 
  Smile, 
  Paperclip, 
  Mic,
  MoreVertical,
  Check,
  CheckCheck,
  Clock
} from "lucide-react";

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  senderColor: string;
  message: string;
  timestamp: Date;
  status: "sent" | "delivered" | "read";
  isOwn: boolean;
}

interface TeamMember {
  id: string;
  name: string;
  avatar: string;
  color: string;
  role: string;
  status: "online" | "away" | "offline";
}

interface RealTimeChatProps {
  teamId: string;
}

// Mock team members
const mockTeamMembers: TeamMember[] = [
  { id: "1", name: "Mark", avatar: "M", color: "#DC2626", role: "Project Manager", status: "online" },
  { id: "2", name: "Sarah", avatar: "S", color: "#3B82F6", role: "Lead Developer", status: "online" },
  { id: "3", name: "Alex", avatar: "A", color: "#8B5CF6", role: "UI/UX Designer", status: "online" },
  { id: "4", name: "Jamie", avatar: "J", color: "#10B981", role: "Marketing", status: "away" },
  { id: "5", name: "Taylor", avatar: "T", color: "#F59E0B", role: "Sales Lead", status: "online" },
];

// Mock initial messages
const mockMessages: ChatMessage[] = [
  {
    id: "1",
    senderId: "1",
    senderName: "Mark",
    senderAvatar: "M",
    senderColor: "#DC2626",
    message: "Team, we need to finalize the Q2 roadmap by Friday. Let's schedule a meeting tomorrow at 2 PM.",
    timestamp: new Date(Date.now() - 3600000), // 1 hour ago
    status: "read",
    isOwn: false
  },
  {
    id: "2",
    senderId: "2",
    senderName: "Sarah",
    senderAvatar: "S",
    senderColor: "#3B82F6",
    message: "I've completed the API integration for the new dashboard. Ready for review.",
    timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
    status: "read",
    isOwn: false
  },
  {
    id: "3",
    senderId: "3",
    senderName: "Alex",
    senderAvatar: "A",
    senderColor: "#8B5CF6",
    message: "Design mockups for the mobile app are ready. Feedback welcome!",
    timestamp: new Date(Date.now() - 900000), // 15 minutes ago
    status: "read",
    isOwn: false
  },
  {
    id: "4",
    senderId: "5",
    senderName: "Taylor",
    senderAvatar: "T",
    senderColor: "#F59E0B",
    message: "Just closed a deal with TechCorp! $50k ARR added to pipeline.",
    timestamp: new Date(Date.now() - 300000), // 5 minutes ago
    status: "delivered",
    isOwn: false
  },
  {
    id: "5",
    senderId: "current",
    senderName: "You",
    senderAvatar: "Y",
    senderColor: "#6366F1",
    message: "Great work everyone! Let's keep the momentum going.",
    timestamp: new Date(Date.now() - 60000), // 1 minute ago
    status: "sent",
    isOwn: true
  }
];

export function RealTimeChat({ teamId }: RealTimeChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(mockMessages);
  const [newMessage, setNewMessage] = useState("");
  const [onlineMembers, setOnlineMembers] = useState<TeamMember[]>(
    mockTeamMembers.filter(m => m.status === "online")
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      senderId: "current",
      senderName: "You",
      senderAvatar: "Y",
      senderColor: "#6366F1",
      message: newMessage,
      timestamp: new Date(),
      status: "sent",
      isOwn: true
    };

    setMessages(prev => [...prev, newMsg]);
    setNewMessage("");

    // Simulate response after 2 seconds
    setTimeout(() => {
      const randomMember = onlineMembers[Math.floor(Math.random() * onlineMembers.length)];
      const responses = [
        "Got it!",
        "Working on it now.",
        "Can you clarify that?",
        "I'll take care of it.",
        "Great point!",
        "Let me check and get back to you."
      ];
      
      const responseMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        senderId: randomMember.id,
        senderName: randomMember.name,
        senderAvatar: randomMember.avatar,
        senderColor: randomMember.color,
        message: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
        status: "delivered",
        isOwn: false
      };

      setMessages(prev => [...prev, responseMsg]);
    }, 2000);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusIcon = (status: ChatMessage["status"]) => {
    switch (status) {
      case "sent": return <Check className="h-3 w-3" />;
      case "delivered": return <CheckCheck className="h-3 w-3" />;
      case "read": return <CheckCheck className="h-3 w-3 text-blue-500" />;
      default: return <Clock className="h-3 w-3" />;
    }
  };

  return (
    <div className="flex flex-col h-[500px]">
      {/* Online Members Bar */}
      <div className="flex items-center justify-between mb-4 p-2 bg-muted rounded-lg">
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {onlineMembers.slice(0, 4).map((member) => (
              <div 
                key={member.id}
                className="h-8 w-8 rounded-full border-2 border-background flex items-center justify-center text-white text-xs font-bold"
                style={{ backgroundColor: member.color }}
                title={`${member.name} (${member.role})`}
              >
                {member.avatar}
              </div>
            ))}
            {onlineMembers.length > 4 && (
              <div className="h-8 w-8 rounded-full border-2 border-background bg-muted flex items-center justify-center text-xs">
                +{onlineMembers.length - 4}
              </div>
            )}
          </div>
          <div className="ml-2">
            <p className="text-sm font-medium">{onlineMembers.length} members online</p>
            <p className="text-xs text-muted-foreground">Active now</p>
          </div>
        </div>
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
          Live
        </Badge>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 pr-4">
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.isOwn ? "flex-row-reverse" : ""}`}
            >
              {/* Avatar */}
              {!msg.isOwn && (
                <div 
                  className="h-8 w-8 rounded-full flex-shrink-0 flex items-center justify-center text-white text-sm font-bold"
                  style={{ backgroundColor: msg.senderColor }}
                >
                  {msg.senderAvatar}
                </div>
              )}

              {/* Message Bubble */}
              <div className={`max-w-[70%] ${msg.isOwn ? "text-right" : ""}`}>
                {!msg.isOwn && (
                  <p className="text-xs font-medium mb-1">{msg.senderName}</p>
                )}
                <div
                  className={`rounded-2xl px-4 py-2 ${
                    msg.isOwn
                      ? "bg-primary text-primary-foreground rounded-br-none"
                      : "bg-muted rounded-bl-none"
                  }`}
                >
                  <p className="text-sm">{msg.message}</p>
                </div>
                <div className={`flex items-center gap-2 mt-1 text-xs text-muted-foreground ${msg.isOwn ? "justify-end" : ""}`}>
                  <span>{formatTime(msg.timestamp)}</span>
                  {msg.isOwn && (
                    <span className="flex items-center gap-1">
                      {getStatusIcon(msg.status)}
                    </span>
                  )}
                </div>
              </div>

              {/* Avatar for own messages */}
              {msg.isOwn && (
                <div 
                  className="h-8 w-8 rounded-full flex-shrink-0 flex items-center justify-center text-white text-sm font-bold"
                  style={{ backgroundColor: msg.senderColor }}
                >
                  {msg.senderAvatar}
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Message Input */}
      <div className="mt-4 flex gap-2">
        <div className="flex-1 flex items-center gap-2 bg-muted rounded-lg px-3">
          <Button variant="ghost" size="icon">
            <Smile className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Paperclip className="h-4 w-4" />
          </Button>
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message here..."
            className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <Button variant="ghost" size="icon">
            <Mic className="h-4 w-4" />
          </Button>
        </div>
        <Button 
          onClick={handleSendMessage}
          disabled={!newMessage.trim()}
          className="gap-2"
        >
          <Send className="h-4 w-4" />
          Send
        </Button>
      </div>

      {/* Chat Features */}
      <div className="mt-4 grid grid-cols-3 gap-2">
        <Button variant="outline" size="sm" className="text-xs">
          Create Thread
        </Button>
        <Button variant="outline" size="sm" className="text-xs">
          Share File
        </Button>
        <Button variant="outline" size="sm" className="text-xs">
          Start Video Call
        </Button>
      </div>
    </div>
  );
}