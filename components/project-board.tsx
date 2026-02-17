"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Save, 
  Plus, 
  FileText, 
  MessageSquare,
  AlertTriangle,
  Trash2,
  Clock
} from "lucide-react";

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  type: "action" | "decision" | "info";
}

interface ParkingLotItem {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  priority: "low" | "medium" | "high";
}

interface ProjectBoardProps {
  projectKey: string;
  kanbanComponent: React.ReactNode;
}

export function ProjectBoard({ projectKey, kanbanComponent }: ProjectBoardProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [parkingLot, setParkingLot] = useState<ParkingLotItem[]>([]);
  const [isClient, setIsClient] = useState(false);
  
  // Note form state
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  
  // Parking lot form state
  const [parkingTitle, setParkingTitle] = useState("");
  const [parkingDescription, setParkingDescription] = useState("");

  useEffect(() => {
    setIsClient(true);
    // Load notes from localStorage
    try {
      const savedNotes = localStorage.getItem(`${projectKey}-notes`);
      if (savedNotes) {
        setNotes(JSON.parse(savedNotes));
      }
      
      const savedParking = localStorage.getItem(`${projectKey}-parking-lot`);
      if (savedParking) {
        setParkingLot(JSON.parse(savedParking));
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  }, [projectKey]);

  // Save notes
  const saveNotes = (newNotes: Note[]) => {
    setNotes(newNotes);
    if (typeof window !== 'undefined') {
      localStorage.setItem(`${projectKey}-notes`, JSON.stringify(newNotes));
    }
  };

  // Save parking lot
  const saveParkingLot = (newItems: ParkingLotItem[]) => {
    setParkingLot(newItems);
    if (typeof window !== 'undefined') {
      localStorage.setItem(`${projectKey}-parking-lot`, JSON.stringify(newItems));
    }
  };

  const handleAddNote = () => {
    if (!noteTitle.trim() || !noteContent.trim()) return;
    
    const newNote: Note = {
      id: `note-${Date.now()}`,
      title: noteTitle,
      content: noteContent,
      createdAt: new Date().toISOString(),
      type: "action",
    };
    
    saveNotes([newNote, ...notes]);
    setNoteTitle("");
    setNoteContent("");
  };

  const handleDeleteNote = (noteId: string) => {
    saveNotes(notes.filter(n => n.id !== noteId));
  };

  const handleAddParkingItem = () => {
    if (!parkingTitle.trim()) return;
    
    const newItem: ParkingLotItem = {
      id: `parking-${Date.now()}`,
      title: parkingTitle,
      description: parkingDescription,
      createdAt: new Date().toISOString(),
      priority: "low",
    };
    
    saveParkingLot([newItem, ...parkingLot]);
    setParkingTitle("");
    setParkingDescription("");
  };

  const handleDeleteParkingItem = (itemId: string) => {
    saveParkingLot(parkingLot.filter(p => p.id !== itemId));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isClient) {
    return (
      <div className="space-y-4">
        <div className="h-10 w-full bg-muted animate-pulse rounded" />
        <div className="h-64 w-full bg-muted animate-pulse rounded" />
      </div>
    );
  }

  return (
    <Tabs defaultValue="kanban" className="space-y-4">
      <TabsList>
        <TabsTrigger value="kanban">
          <FileText className="mr-2 h-4 w-4" />
          Kanban Board
        </TabsTrigger>
        <TabsTrigger value="notes">
          <MessageSquare className="mr-2 h-4 w-4" />
          Notes ({notes.length})
        </TabsTrigger>
        <TabsTrigger value="parking-lot">
          <AlertTriangle className="mr-2 h-4 w-4" />
          Parking Lot ({parkingLot.length})
        </TabsTrigger>
      </TabsList>

      {/* Kanban Board Tab */}
      <TabsContent value="kanban" className="space-y-4">
        {kanbanComponent}
      </TabsContent>

      {/* Notes Tab */}
      <TabsContent value="notes" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Project Notes</CardTitle>
            <CardDescription>
              Document action items, decisions, and important information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <h3 className="font-medium">Add New Note</h3>
                <Badge variant="outline">Action Item</Badge>
              </div>
              <Input 
                placeholder="Note title" 
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
              />
              <Textarea 
                placeholder="Document important information, decisions, or action items..."
                className="min-h-[150px]"
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
              />
              <div className="flex justify-end">
                <Button 
                  onClick={handleAddNote}
                  disabled={!noteTitle.trim() || !noteContent.trim()}
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save Note
                </Button>
              </div>
            </div>

            {/* Existing Notes */}
            <div className="space-y-3">
              {notes.length === 0 ? (
                <Card className="border-dashed">
                  <CardContent className="p-6 text-center">
                    <MessageSquare className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <h4 className="font-medium">No notes yet</h4>
                    <p className="text-sm text-muted-foreground">
                      Add your first note to get started
                    </p>
                  </CardContent>
                </Card>
              ) : (
                notes.map((note) => (
                  <Card key={note.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-base">{note.title}</CardTitle>
                          <CardDescription className="flex items-center gap-1 mt-1">
                            <Clock className="h-3 w-3" />
                            {formatDate(note.createdAt)}
                          </CardDescription>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => handleDeleteNote(note.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {note.content}
                      </p>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Parking Lot Tab */}
      <TabsContent value="parking-lot" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Parking Lot Issues</CardTitle>
            <CardDescription>
              Issues that need attention but aren&apos;t blocking current work
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <h3 className="font-medium">Add Parking Lot Item</h3>
                <Badge variant="outline">Low Priority</Badge>
              </div>
              <Input 
                placeholder="Issue title" 
                value={parkingTitle}
                onChange={(e) => setParkingTitle(e.target.value)}
              />
              <Textarea 
                placeholder="Describe the issue and why it's in the parking lot..."
                className="min-h-[100px]"
                value={parkingDescription}
                onChange={(e) => setParkingDescription(e.target.value)}
              />
              <div className="flex justify-end">
                <Button 
                  variant="outline"
                  onClick={handleAddParkingItem}
                  disabled={!parkingTitle.trim()}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add to Parking Lot
                </Button>
              </div>
            </div>

            {/* Parking Lot Items */}
            <div className="space-y-3">
              {parkingLot.length === 0 ? (
                <Card className="border-dashed">
                  <CardContent className="p-6 text-center">
                    <AlertTriangle className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <h4 className="font-medium">No parking lot items</h4>
                    <p className="text-sm text-muted-foreground">
                      Add items that need attention but aren&apos;t blocking current work
                    </p>
                  </CardContent>
                </Card>
              ) : (
                parkingLot.map((item) => (
                  <Card key={item.id} className="border-yellow-200 dark:border-yellow-800">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <AlertTriangle className="h-4 w-4 text-yellow-600" />
                            <h4 className="font-medium">{item.title}</h4>
                          </div>
                          {item.description && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {item.description}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDate(item.createdAt)}
                          </p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => handleDeleteParkingItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
