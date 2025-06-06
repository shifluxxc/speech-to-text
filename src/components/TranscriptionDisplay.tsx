
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader } from 'lucide-react';

type TranscriptionDisplayProps = {
  text: string;
  isLoading: boolean;
  onSave?: () => void;
  onCopy?: () => void;
};

const TranscriptionDisplay = ({ text, isLoading, onSave, onCopy }: TranscriptionDisplayProps) => {
  const handleCopyToClipboard = () => {
    if (onCopy) {
      onCopy();
    } else {
      navigator.clipboard.writeText(text);
    }
  };

  return (
    <Card className="my-4">
      <CardContent className="p-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader className="h-8 w-8 animate-spin text-purple-600" />
            <p className="mt-4 text-gray-500">Transcribing your audio...</p>
          </div>
        ) : (
          <>
            {text ? (
              <>
                <div className="bg-gray-50 p-4 rounded-md mb-4 max-h-60 overflow-y-auto">
                  <p className="text-gray-700 whitespace-pre-wrap">{text}</p>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={handleCopyToClipboard}
                  >
                    Copy
                  </Button>
                  {onSave && (
                    <Button 
                      size="sm"
                      className="bg-purple-600 hover:bg-purple-700"
                      onClick={onSave}
                    >
                      Save
                    </Button>
                  )}
                </div>
              </>
            ) : (
              <p className="text-center text-gray-500 py-8">
                Transcription will appear here
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default TranscriptionDisplay;
