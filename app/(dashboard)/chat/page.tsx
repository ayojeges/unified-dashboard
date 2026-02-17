"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Send, 
  Search, 
  Users, 
  Plus,
  X,
  MessageSquare
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface Message {
  id: number;
  sender: string;
  text: string;
  time: string;
  isOwn: boolean;
}

interface Conversation {
  id: number;
  name: string;
  type: 'direct' | 'group';
  messages: Message[];
  participants: string[];
}

export default function ChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewChatDialog, setShowNewChatDialog] = useState(false);
  const [showNewGroupDialog, setShowNewGroupDialog] = useState(false);
  const [newChatName, setNewChatName] = useState("");
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupMembers, setNewGroupMembers] = useState("");

  const handleSendMessage = () => {
    if (!message.trim() || !activeConversation) return;
    
    const newMessage: Message = {
      id: Date.now(),
      sender: "You",
      text: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isOwn: true
    };
    
    setConversations(conversations.map(conv => 
      conv.id === activeConversation.id 
        ? { ...conv, messages: [...conv.messages, newMessage] }
        : conv
    ));
    
    setActiveConversation({
      ...activeConversation,
      messages: [...activeConversation.messages, newMessage]
    });
    
    setMessage("");
  };

  const handleStartChat = () => {
    if (!newChatName.trim()) return;
    
    const newConversation: Conversation = {
      id: Date.now(),
      name: newChatName,
      type: 'direct',
      messages: [],
      participants: [newChatName, 'You']
    };
    
    setConversations([newConversation, ...conversations]);
    setActiveConversation(newConversation);
    setNewChatName("");
    setShowNewChatDialog(false);
  };

  const handleCreateGroup = () => {
    if (!newGroupName.trim()) return;
    
    const members = newGroupMembers.split(',').map(m => m.trim()).filter(m => m);
    
    const newConversation: Conversation = {
      id: Date.now(),
      name: newGroupName,
      type: 'group',
      messages: [],
      participants: [...members, 'You']
    };
    
    setConversations([newConversation, ...conversations]);
    setActiveConversation(newConversation);
    setNewGroupName("");
    setNewGroupMembers("");
    setShowNewGroupDialog(false);
  };

  const deleteConversation = (convId: number) => {
    setConversations(conversations.filter(c => c.id !== convId));
    if (activeConversation?.id === convId) {
      setActiveConversation(null);
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Team Chat</h1>
          <p className="text-muted-foreground text-sm">
            Real-time communication with your team
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowNewGroupDialog(true)}>
            <Users className="mr-2 h-4 w-4" />
            New Group
          </Button>
          <Button size="sm" onClick={() => setShowNewChatDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Start Chat
          </Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-4 h-[calc(100vh-250px)] min-h-[500px]">
        {/* Conversations List */}
        <Card className="lg:col-span-1 flex flex-col">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Conversations</CardTitle>
              <Badge variant="secondary">{conversations.length}</Badge>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-0">
            {filteredConversations.length > 0 ? (
              <div className="space-y-1">
                {filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-accent group ${
                      activeConversation?.id === conversation.id ? "bg-accent" : ""
                    }`}
                    onClick={() => setActiveConversation(conversation)}
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className={conversation.type === 'group' ? 'bg-purple-100' : 'bg-blue-100'}>
                        {conversation.type === 'group' ? <Users className="h-5 w-5" /> : conversation.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-sm truncate">{conversation.name}</p>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6 opacity-0 group-hover:opacity-100"
                          onClick={(e) => { e.stopPropagation(); deleteConversation(conversation.id); }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {conversation.messages.length > 0 
                          ? conversation.messages[conversation.messages.length - 1].text 
                          : 'No messages yet'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-muted-foreground text-sm">
                {searchQuery ? 'No conversations found' : 'No conversations yet. Start a new chat!'}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="lg:col-span-3 flex flex-col">
          {activeConversation ? (
            <>
              <CardHeader className="pb-3 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className={activeConversation.type === 'group' ? 'bg-purple-100' : 'bg-blue-100'}>
                        {activeConversation.type === 'group' ? <Users className="h-5 w-5" /> : activeConversation.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{activeConversation.name}</CardTitle>
                      <CardDescription>
                        {activeConversation.type === 'group' 
                          ? `${activeConversation.participants.length} members` 
                          : 'Direct message'}
                      </CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto p-4">
                {activeConversation.messages.length > 0 ? (
                  <div className="space-y-4">
                    {activeConversation.messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[70%] ${msg.isOwn ? 'order-2' : ''}`}>
                          <div
                            className={`rounded-lg px-4 py-2 ${
                              msg.isOwn
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted'
                            }`}
                          >
                            {!msg.isOwn && (
                              <p className="text-xs font-medium mb-1">{msg.sender}</p>
                            )}
                            <p className="text-sm">{msg.text}</p>
                          </div>
                          <p className={`text-xs text-muted-foreground mt-1 ${msg.isOwn ? 'text-right' : ''}`}>
                            {msg.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No messages yet. Send the first message!</p>
                    </div>
                  </div>
                )}
              </CardContent>
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Input
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage} disabled={!message.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <MessageSquare className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No Conversation Selected</h3>
                <p className="text-sm mb-4">Select a conversation or start a new one</p>
                <div className="flex gap-2 justify-center">
                  <Button variant="outline" onClick={() => setShowNewGroupDialog(true)}>
                    <Users className="mr-2 h-4 w-4" />
                    New Group
                  </Button>
                  <Button onClick={() => setShowNewChatDialog(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Start Chat
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* New Chat Dialog */}
      <Dialog open={showNewChatDialog} onOpenChange={setShowNewChatDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Start New Chat</DialogTitle>
            <DialogDescription>
              Enter the name of the person you want to chat with
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Enter name..."
              value={newChatName}
              onChange={(e) => setNewChatName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleStartChat()}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewChatDialog(false)}>Cancel</Button>
            <Button onClick={handleStartChat} disabled={!newChatName.trim()}>
              Start Chat
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Group Dialog */}
      <Dialog open={showNewGroupDialog} onOpenChange={setShowNewGroupDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Group</DialogTitle>
            <DialogDescription>
              Create a group chat with multiple team members
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Group Name *</label>
              <Input
                placeholder="e.g., Project Team"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Members (comma separated)</label>
              <Input
                placeholder="e.g., John, Jane, Bob"
                value={newGroupMembers}
                onChange={(e) => setNewGroupMembers(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewGroupDialog(false)}>Cancel</Button>
            <Button onClick={handleCreateGroup} disabled={!newGroupName.trim()}>
              Create Group
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
