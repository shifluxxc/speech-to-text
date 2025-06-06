import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';

const baseURL = process.env.BaseURL; ;

import AudioRecorder from '@/components/AudioRecorder';
import FileUploader from '@/components/FileUploader';
import TranscriptionDisplay from '@/components/TranscriptionDisplay';
import HistoryList, { TranscriptionItem } from '@/components/HistoryList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';

const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [transcriptionText, setTranscriptionText] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [historyItems, setHistoryItems] = useState<TranscriptionItem[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);



  // Fetch user's transcription history from your server
  useEffect(() => {
    const fetchHistory = async () => {
      if (!user) return;

      try {
        const res = await axios.get(`${baseURL}/api/users/me`);
        // Assuming user.transcriptions is populated with transcription objects
        setHistoryItems(
          (res.data.user.transcriptions || []).map((t: any) => ({
            id: t._id,
            text: t.transcription,
            createdAt: t.createdAt,
            sourceType: t.fileName ? 'upload' : 'recording',
            fileName: t.fileName,
          }))
        );
      } catch (error) {
        console.error('Error fetching transcription history:', error);
        toast({
          variant: "destructive",
          title: "Failed to load history",
          description: "There was a problem loading your transcription history.",
        });
      } finally {
        setIsLoadingHistory(false);
      }
    };

    fetchHistory();
  }, [user, toast]);

  // Function to handle the transcription process
  const transcribeAudio = async (audioData: Blob | File, sourceType: 'recording' | 'upload', fileName?: string) => {
    if (!user) return;

    setIsTranscribing(true);
    setTranscriptionText('');

    // Create a FormData object to send the file
    const formData = new FormData();
    formData.append('file', audioData);
    if (fileName) formData.append('fileName', fileName);

    try {
      // Send to your backend API
      const res = await axios.post(`${baseURL}/api/transcriptions`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const { transcription } = res.data;
      setTranscriptionText(transcription.transcription);

      // Add new transcription to history
      const newItem: TranscriptionItem = {
        id: transcription._id,
        text: transcription.transcription,
        createdAt: transcription.createdAt,
        sourceType,
        fileName: transcription.fileName,
      };
      setHistoryItems(prev => [newItem, ...prev]);

      toast({
        title: "Transcription Complete",
        description: "Your audio has been successfully transcribed.",
      });

    } catch (error) {
      console.error('Error transcribing audio:', error);
      toast({
        variant: "destructive",
        title: "Transcription Failed",
        description: "There was a problem transcribing your audio.",
      });
    } finally {
      setIsTranscribing(false);
    }
  };

  // Handle recorded audio
  const handleAudioRecorded = (audioBlob: Blob) => {
    transcribeAudio(audioBlob, 'recording');
  };

  // Handle file upload
  const handleFileSelected = (file: File) => {
    setSelectedFile(file);
  };

  // Process the uploaded file
  const handleProcessFile = () => {
    if (selectedFile) {
      transcribeAudio(selectedFile, 'upload', selectedFile.name);
    }
  };

  // Copy transcription to clipboard
  const handleCopyTranscription = () => {
    navigator.clipboard.writeText(transcriptionText);
    toast({
      title: "Copied",
      description: "Transcription copied to clipboard.",
    });
  };

  // Save transcription (just show a toast for demo)
  const handleSaveTranscription = () => {
    toast({
      title: "Saved",
      description: "Transcription saved successfully.",
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-2">Speech to Text</h1>
      <p className="text-center text-gray-500 mb-8">
        Convert your speech or audio files into text
      </p>

      <Tabs defaultValue="record" className="mb-8">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="record">Record Audio</TabsTrigger>
          <TabsTrigger value="upload">Upload File</TabsTrigger>
        </TabsList>

        <TabsContent value="record" className="mt-4">
          <Card>
            <CardContent className="p-8">
              <AudioRecorder onAudioRecorded={handleAudioRecorded} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upload" className="mt-4">
          <Card>
            <CardContent className="p-8">
              <FileUploader onFileSelected={handleFileSelected} />
              {selectedFile && (
                <div className="mt-4 flex justify-center">
                  <button
                    onClick={handleProcessFile}
                    disabled={isTranscribing}
                    className="bg-purple-600 hover:bg-purple-700 text-white rounded-md px-4 py-2 transition-colors disabled:bg-gray-400"
                  >
                    {isTranscribing ? 'Processing...' : 'Process File'}
                  </button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <TranscriptionDisplay
        text={transcriptionText}
        isLoading={isTranscribing}
        onSave={handleSaveTranscription}
        onCopy={handleCopyTranscription}
      />

      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">Your Transcription History</h2>
        <HistoryList 
          items={historyItems} 
          isLoading={isLoadingHistory}
        />
      </div>
    </div>
  );
};

export default Dashboard;