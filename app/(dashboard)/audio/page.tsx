"use client";
import { AudioRecorder } from "@/components/audio-input/audio-recorder";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic, Headphones, FileText, Share2 } from "lucide-react";

export default function AudioPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Audio Notes</h1>
        <p className="text-muted-foreground">
          Record, transcribe, and manage your audio notes
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Recorder */}
        <div className="lg:col-span-2">
          <AudioRecorder />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Headphones className="h-5 w-5" />
                Quick Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">Recording Tips</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Speak clearly and at a moderate pace</li>
                  <li>• Find a quiet environment</li>
                  <li>• Keep recordings under 5 minutes for best results</li>
                  <li>• Use a good quality microphone</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Features</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Automatic speech-to-text transcription</li>
                  <li>• Cloud storage for all recordings</li>
                  <li>• Share recordings with team members</li>
                  <li>• Search within transcriptions</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <Mic className="mr-2 h-4 w-4" />
                New Recording
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                View Transcripts
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Share2 className="mr-2 h-4 w-4" />
                Share Notes
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Storage</CardTitle>
              <CardDescription>
                Your audio storage usage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>2.4 GB of 10 GB used</span>
                  <span className="font-medium">24%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-primary w-1/4" />
                </div>
                <p className="text-xs text-muted-foreground">
                  48 recordings • Last cleaned: 2 days ago
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}