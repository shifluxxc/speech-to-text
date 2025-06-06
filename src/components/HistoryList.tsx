
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export type TranscriptionItem = {
  id: string;
  text: string;
  createdAt: string;
  sourceType: 'recording' | 'upload';
  fileName?: string;
};

type HistoryListProps = {
  items: TranscriptionItem[];
  isLoading: boolean;
};

const HistoryList = ({ items, isLoading }: HistoryListProps) => {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedItem(expandedItem === id ? null : id);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center my-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <Card className="my-4 bg-gray-50">
        <CardContent className="p-6 text-center text-gray-500">
          <p>No transcription history yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <Card key={item.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="p-4 pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-sm font-medium">
                {item.sourceType === 'recording' 
                  ? 'Voice Recording'
                  : `File: ${item.fileName || 'Unknown'}`}
              </CardTitle>
              <span className="text-xs text-gray-500">
                {formatDate(item.createdAt)}
              </span>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-gray-700 text-sm mb-2">
              {expandedItem === item.id 
                ? item.text 
                : `${item.text.substring(0, 100)}${item.text.length > 100 ? '...' : ''}`}
            </p>
            {item.text.length > 100 && (
              <Button 
                variant="link" 
                size="sm" 
                className="p-0 h-auto text-purple-600"
                onClick={() => toggleExpand(item.id)}
              >
                {expandedItem === item.id ? 'Show less' : 'Show more'}
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default HistoryList;
