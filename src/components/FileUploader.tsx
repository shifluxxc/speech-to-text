
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Upload } from 'lucide-react';

type FileUploaderProps = {
  onFileSelected: (file: File) => void;
};

const FileUploader = ({ onFileSelected }: FileUploaderProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (!file) return;
    
    // Check file type
    const validTypes = ['audio/mp3', 'audio/wav', 'audio/webm', 'audio/mpeg'];
    if (!validTypes.includes(file.type) && !file.name.endsWith('.mp3') && !file.name.endsWith('.wav') && !file.name.endsWith('.webm')) {
      toast({
        variant: "destructive",
        title: "Invalid File Type",
        description: "Please upload an MP3, WAV, or WebM audio file.",
      });
      return;
    }
    
    // Check file size (limit to 50MB)
    const maxSize = 50 * 1024 * 1024; // 50MB in bytes
    if (file.size > maxSize) {
      toast({
        variant: "destructive",
        title: "File Too Large",
        description: "Please upload an audio file smaller than 50MB.",
      });
      return;
    }
    
    setSelectedFile(file);
    onFileSelected(file);
  };
  
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-400 transition-colors">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".mp3,.wav,.webm,audio/mp3,audio/wav,audio/webm"
        className="hidden"
      />
      
      <Upload className="h-10 w-10 text-gray-400 mb-2" />
      
      <Button
        variant="ghost"
        onClick={triggerFileInput}
        className="text-purple-600 hover:text-purple-800 hover:bg-purple-50"
      >
        Upload Audio File
      </Button>
      
      <p className="text-sm text-gray-500 mt-2">
        Supported formats: MP3, WAV, WebM (max 50MB)
      </p>
      
      {selectedFile && (
        <div className="mt-4 text-sm text-green-600">
          Selected file: {selectedFile.name}
        </div>
      )}
    </div>
  );
};

export default FileUploader;
