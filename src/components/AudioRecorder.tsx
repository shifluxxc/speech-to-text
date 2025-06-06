
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Loader } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type AudioRecorderProps = {
  onAudioRecorded: (audioBlob: Blob) => void;
};

const AudioRecorder = ({ onAudioRecorded }: AudioRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const { toast } = useToast();

  const startRecording = async () => {
    audioChunksRef.current = [];
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        onAudioRecorded(audioBlob);
        
        // Stop all tracks to release the microphone
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      // Start timer for recording duration
      timerRef.current = window.setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast({
        variant: "destructive",
        title: "Microphone Access Failed",
        description: "Please allow microphone access to record audio.",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Clear timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  // Format recording time as mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="text-center">
        {isRecording ? (
          <div className="relative inline-block">
            <div className="absolute inset-0 rounded-full bg-red-500 animate-pulse opacity-30"></div>
            <Button
              variant="outline"
              size="lg"
              className="relative rounded-full h-16 w-16 border-2 border-red-500 hover:bg-red-50"
              onClick={stopRecording}
            >
              <MicOff className="h-6 w-6 text-red-500" />
            </Button>
          </div>
        ) : (
          <Button
            variant="outline"
            size="lg"
            className="rounded-full h-16 w-16 border-2 border-purple-500 hover:bg-purple-50"
            onClick={startRecording}
          >
            <Mic className="h-6 w-6 text-purple-600" />
          </Button>
        )}
      </div>
      
      <div className="text-center">
        {isRecording ? (
          <div className="text-red-500 font-medium">
            Recording... {formatTime(recordingTime)}
          </div>
        ) : (
          <div className="text-gray-500">Click to record audio</div>
        )}
      </div>
    </div>
  );
};

export default AudioRecorder;
