"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Users, MessageSquare, Bot, User, Loader2, RefreshCw } from "lucide-react";

const API_URL = "/api/chat";

interface Message {
  _id?: string;
  channel_name: string;
  sender: string;
  text: string;
  meta?: { type?: string; source?: string; agent?: string };
  created_at: string;
}

interface Channel {
  _id: string;
  name: string;
  label: string;
  type: string;
  owner_clawbot: string;
}

const AGENT_MAP: Record<string, string> = {
  general: "main",
  "mark-leadership": "main",
  "engineering-bot": "engineering_lead_bot",
  "growth-bot": "growth_revenue_bot",
};

const CHANNEL_COLORS: Record<string, string> = {
  general: "bg-red-100 text-red-700",
  "mark-leadership": "bg-red-100 text-red-700",
  "engineering-bot": "bg-blue-100 text-blue-700",
  "growth-bot": "bg-emerald-100 text-emerald-700",
};

const VISIBLE_CHANNELS = ["general", "mark-leadership", "engineering-bot", "growth-bot"];

export default function ChatPage() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [activeChannel, setActiveChannel] = useState<string>("general");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollRef = useRef<NodeJS.Timeout | null>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const fetchChannels = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/channels`);
      const data = await res.json();
      if (data.success) {
        setChannels(data.channels.filter((c: Channel) => VISIBLE_CHANNELS.includes(c.name)));
      }
    } catch (err) {
      console.error("Failed to load channels:", err);
    }
  }, []);

  const fetchMessages = useCallback(async (channelName: string) => {
    try {
      const res = await fetch(`${API_URL}?channel_name=${channelName}&limit=100`);
      const data = await res.json();
      if (data.success) {
        setMessages(data.messages);
        setTimeout(scrollToBottom, 100);
      }
    } catch (err) {
      console.error("Failed to load messages:", err);
    }
  }, [scrollToBottom]);

  useEffect(() => {
    fetchChannels();
  }, [fetchChannels]);

  useEffect(() => {
    setLoading(true);
    fetchMessages(activeChannel).finally(() => setLoading(false));
    // Poll for new messages every 5s
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(() => fetchMessages(activeChannel), 5000);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [activeChannel, fetchMessages]);

  const handleSend = async () => {
    if (!input.trim() || sending) return;
    const text = input.trim();
    setInput("");
    setSending(true);

    // Optimistic: add user message immediately
    const optimisticMsg: Message = {
      channel_name: activeChannel,
      sender: "CEO",
      text,
      meta: { source: "dashboard", type: "chat" },
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimisticMsg]);
    setTimeout(scrollToBottom, 50);

    try {
      const agentId = AGENT_MAP[activeChannel] || "main";
      const res = await fetch(`${API_URL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, agentId, channel_name: activeChannel }),
      });
      const data = await res.json();
      if (data.success) {
        // Add agent response
        const agentMsg: Message = {
          channel_name: activeChannel,
          sender: agentId === "main" ? "MarkPMO" : agentId,
          text: data.response,
          meta: { source: "openclaw", type: "agent_response" },
          created_at: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, agentMsg]);
      } else {
        setMessages((prev) => [...prev, {
          channel_name: activeChannel, sender: "system",
          text: `Error: ${data.error}`, meta: { type: "error" },
          created_at: new Date().toISOString(),
        }]);
      }
    } catch (err: any) {
      setMessages((prev) => [...prev, {
        channel_name: activeChannel, sender: "system",
        text: `Connection error: ${err.message}`, meta: { type: "error" },
        created_at: new Date().toISOString(),
      }]);
    } finally {
      setSending(false);
      setTimeout(scrollToBottom, 100);
    }
  };

  const isOwnMessage = (msg: Message) => msg.sender === "CEO" || msg.meta?.source === "dashboard";
  const isSystemMessage = (msg: Message) => msg.sender === "system" || msg.meta?.type === "error";
  const isAgentMessage = (msg: Message) => !isOwnMessage(msg) && !isSystemMessage(msg);

  const getSenderDisplay = (msg: Message) => {
    if (msg.sender === "MarkPMO" || msg.sender === "main") return "Mark";
    if (msg.sender === "engineering_lead_bot") return "Eng Lead";
    if (msg.sender === "growth_revenue_bot") return "Growth Lead";
    if (msg.sender === "CEO") return "You";
    return msg.sender;
  };

  const formatTime = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch { return ""; }
  };

  const activeChannelObj = channels.find((c) => c.name === activeChannel);

  return (
    <div className="space-y-4" data-testid="chat-page">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Team Chat</h1>
          <p className="text-muted-foreground text-sm">Talk directly to Mark and his team</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => fetchMessages(activeChannel)} data-testid="refresh-messages">
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-4 h-[calc(100vh-220px)] min-h-[500px]">
        {/* Channel Sidebar */}
        <Card className="lg:col-span-1 flex flex-col" data-testid="channel-sidebar">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Channels</CardTitle>
            <CardDescription className="text-xs">Select a channel to chat</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-0">
            {channels.map((ch) => (
              <div
                key={ch._id}
                className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${
                  activeChannel === ch.name ? "bg-accent border-l-2 border-primary" : "hover:bg-muted/50"
                }`}
                onClick={() => setActiveChannel(ch.name)}
                data-testid={`channel-${ch.name}`}
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback className={CHANNEL_COLORS[ch.name] || "bg-gray-100"}>
                    {ch.type === "leadership" ? <User className="h-4 w-4" /> : <Users className="h-4 w-4" />}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{ch.label}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {ch.name === "general" ? "Talk to Mark" :
                     ch.name === "mark-leadership" ? "CEO + Mark" :
                     ch.name === "engineering-bot" ? "Engineering Lead" :
                     "Growth & Revenue"}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="lg:col-span-3 flex flex-col" data-testid="chat-area">
          {/* Header */}
          <CardHeader className="pb-3 border-b">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback className={CHANNEL_COLORS[activeChannel] || "bg-gray-100"}>
                  <Bot className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg">{activeChannelObj?.label || activeChannel}</CardTitle>
                <CardDescription className="text-xs">
                  Agent: {AGENT_MAP[activeChannel] === "main" ? "Mark (Director)" :
                          AGENT_MAP[activeChannel] === "engineering_lead_bot" ? "Engineering Lead Bot" :
                          "Growth & Revenue Bot"}
                  {sending && <span className="ml-2 text-amber-600">Agent is thinking...</span>}
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          {/* Messages */}
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-3">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <div className="text-center">
                  <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No messages yet. Send a message to start talking to the agent.</p>
                </div>
              </div>
            ) : (
              messages.map((msg, i) => (
                <div key={msg._id || i} className={`flex ${isOwnMessage(msg) ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[75%] ${isSystemMessage(msg) ? "w-full text-center" : ""}`}>
                    {isSystemMessage(msg) ? (
                      <p className="text-xs text-red-500 bg-red-50 rounded px-3 py-1 inline-block">{msg.text}</p>
                    ) : (
                      <>
                        {isAgentMessage(msg) && (
                          <div className="flex items-center gap-1.5 mb-1">
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4">
                              <Bot className="h-2.5 w-2.5 mr-0.5" />
                              {getSenderDisplay(msg)}
                            </Badge>
                            <span className="text-[10px] text-muted-foreground">{formatTime(msg.created_at)}</span>
                          </div>
                        )}
                        <div className={`rounded-lg px-3 py-2 text-sm whitespace-pre-wrap ${
                          isOwnMessage(msg)
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}>
                          {msg.text}
                        </div>
                        {isOwnMessage(msg) && (
                          <p className="text-[10px] text-muted-foreground mt-0.5 text-right">{formatTime(msg.created_at)}</p>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </CardContent>

          {/* Input */}
          <div className="p-3 border-t">
            <div className="flex gap-2">
              <Input
                placeholder={sending ? "Agent is thinking..." : "Type a message..."}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                disabled={sending}
                className="flex-1"
                data-testid="chat-input"
              />
              <Button onClick={handleSend} disabled={!input.trim() || sending} data-testid="send-button">
                {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
