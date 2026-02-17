"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic, Square, Play, Download } from "lucide-react";
import { useState } from "react";

export function AudioRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecording, setHasRecording] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mic className="h-5 w-5" />
          Audio Recorder
        </CardTitle>
        <CardDescription>
          Record audio notes and get automatic transcriptions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Recording Visualization */}
        <div className="flex items-center justify-center h-32 bg-muted rounded-lg">
          <div className="flex gap-1 h-16 items-end">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="w-2 bg-primary rounded-t"
                style={{
                  height: `${Math.random() * 60 + 20}%`,
                  animation: isRecording ? `pulse ${0.5 + i * 0.05}s infinite alternate` : 'none',
                }}
              />
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4">
          <Button
            size="lg"
            variant={isRecording ? "destructive" : "default"}
            onClick={() => setIsRecording(!isRecording)}
            className="gap-2"
          >
            {isRecording ? (
              <>
                <Square className="h-4 w-4" />
                Stop Recording
              </>
            ) : (
              <>
                <Mic className="h-4 w-4" />
                Start Recording
              </>
            )}
          </Button>
          
          {hasRecording && (
            <>
              <Button size="lg" variant="outline" className="gap-2">
                <Play className="h-4 w-4" />
                Playback
              </Button>
              <Button size="lg" variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Download
              </Button>
            </>
          )}
        </div>

        {/* Status */}
        <div className="text-center space-y-2">
          <p className="text-sm font-medium">
            {isRecording ? "Recording in progress..." : "Ready to record"}
          </p>
          <p className="text-xs text-muted-foreground">
            {isRecording 
              ? "Click stop when finished. Audio will be automatically transcribed."
              : "Click the microphone button to start recording your note."}
          </p>
        </div>

        {/* Transcription Preview */}
        {hasRecording && (
          <div className="space-y-2">
            <h4 className="font-medium">Transcription Preview</h4>
            <div className="p-4 bg-muted rounded-lg text-sm">
              <p className="text-muted-foreground">
                This is where your audio transcription will appear. The system uses advanced
                speech-to-text technology to convert your recordings into searchable text.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}