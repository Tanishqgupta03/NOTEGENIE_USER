"use client";

import { useVideo } from '@/app/context/VideoContext';
import { Button } from '@/components/ui/button';
import { Sidebar } from '@/components/Sidebar';
import { useEffect, useState } from 'react';
import { VideoProvider } from '@/app/context/VideoContext';
import { getSession } from 'next-auth/react';
import { useToast } from '@/hooks/use-toast'; // Assuming you have a toast hook
import { CopyIcon } from 'lucide-react'; // Assuming you have a copy icon
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'; // Assuming you have a tooltip component

// Define the type for processed data
interface ActionItem {
  task: string;
  assignedTo: string;
  dueDate: string; // Assuming dueDate is stored as a string in the database
  status: string;
}

interface ProcessedData {
  userId: string;
  videoId: string;
  transcript: string;
  notes: string;
  actionItems: ActionItem[];
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// Wrap the page component with VideoProvider
export default function UploadedVideoPageWrapper() {
  return (
    <VideoProvider>
      <UploadedVideoPage />
    </VideoProvider>
  );
}

function UploadedVideoPage() {
  const { latestUpload } = useVideo(); // Use the context
  const [isClient, setIsClient] = useState(false); // Track client-side rendering
  const [isProcessing, setIsProcessing] = useState(false); // Track processing state
  const [processedData, setProcessedData] = useState<ProcessedData | null>(null); // Store processed data with type
  const { toast } = useToast(); // Use toast for notifications

  useEffect(() => {
    setIsClient(true); // Set isClient to true after mounting
  }, []);

  const handleProceedWithAI = async () => {
    setIsProcessing(true); // Start processing
  
    try {
      // Step 1: Get the session to fetch userId
      const session = await getSession();
      console.log('Session after login:', session);
  
      if (!session?.user?.id) {
        console.error('User ID not found in session');
        toast({
          title: 'Error',
          description: 'User ID not found in session.',
          variant: 'destructive',
        });
        return;
      }
  
      const userId = session.user.id;
  
      // Step 2: Fetch videoId and videoUrl from local storage
      const storedUpload = localStorage.getItem(`latestUpload_${userId}`);
      if (!storedUpload) {
        console.error('No video found in local storage');
        toast({
          title: 'Error',
          description: 'No video found in local storage.',
          variant: 'destructive',
        });
        return;
      }
  
      const { _id: videoId, url: videoUrl } = JSON.parse(storedUpload);
  
      // Step 3: Call the AI Processing Microservice
      const response = await fetch('http://localhost:3002/api/videoProcessing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, videoId, videoUrl }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to process video');
      }
  
      const result = await response.json();
      console.log('AI Processing Result:', result);
      // Step 6: Update the UI with the processed data
      setProcessedData(result);
      toast({
        title: 'Success!',
        description: 'Video processed successfully!',
      });
    } catch (error) {
      console.error('Error processing video:', error);
      toast({
        title: 'Error',
        description: 'Failed to process video. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false); // End processing
    }
  };

  const handleSaveData = async () => {
    if (!processedData) return;
  
    try {
      const response = await fetch('http://localhost:3002/api/videoProcessing/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(processedData),
      });
  
      if (!response.ok) {
        throw new Error('Failed to save data');
      }
  
      toast({
        title: 'Success!',
        description: 'Data saved successfully!',
      });
    } catch (error) {
      console.error('Error saving data:', error);
      toast({
        title: 'Error',
        description: 'Failed to save data. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied!',
      description: 'Text copied to clipboard.',
    });
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-black to-gray-900">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 md:ml-64">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            {/* Video Preview and Action Items Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Video Preview Section */}
              <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
                <h2 className="text-2xl font-semibold text-white mb-6">Video Preview</h2>
                {isClient && latestUpload ? (
                  <video controls className="w-full rounded-lg" src={latestUpload.url}>
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <p className="text-gray-400">No video available for preview.</p>
                )}

                {/* Action Section */}
                <div className="flex flex-col space-y-4 mt-6">
                  <p className="text-lg text-gray-300">
                    Do you want us to proceed with AI to create notes for this meeting?
                  </p>

                  {/* Buttons */}
                  <div className="flex space-x-4">
                    <Button
                      onClick={handleProceedWithAI}
                      disabled={isProcessing}
                      variant="secondary"
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
                    >
                      {isProcessing ? 'Processing...' : 'Proceed with AI Notes'}
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 text-white border-2 border-gray-600 bg-gray-700 hover:border-gray-500 hover:bg-gray-600 hover:text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
                    >
                      Trim Video
                    </Button>
                  </div>
                </div>
              </div>

              {/* Action Items Section */}
              <div
                className={`bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 ${
                  isProcessing ? 'live-blur' : ''
                }`}
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold text-white">Action Items</h2>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          onClick={() =>
                            handleCopyToClipboard(
                              processedData?.actionItems
                                .map((item) => `Task: ${item.task}\nAssigned To: ${item.assignedTo}\nDue Date: ${item.dueDate}\nStatus: ${item.status}`)
                                .join('\n\n') || ''
                            )
                          }
                          size="icon"
                          variant="ghost"
                          className="text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-all duration-300 transform hover:scale-105"
                        >
                          <CopyIcon className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Copy</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                {processedData?.actionItems && processedData.actionItems.length > 0 ? (
                  <ul className="list-disc list-inside text-gray-300">
                    {processedData.actionItems.map((item, index) => (
                      <li key={index} className="mb-4">
                        <strong>Task:</strong> {item.task} <br />
                        <strong>Assigned To:</strong> {item.assignedTo} <br />
                        <strong>Due Date:</strong> {new Date(item.dueDate).toLocaleDateString()} <br />
                        <strong>Status:</strong> {item.status}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-400">No action detected.</p>
                )}
              </div>
            </div>

            {/* Processed Notes Section */}
            <div className="mt-6">
              <div
                className={`bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 ${
                  isProcessing ? 'live-blur' : ''
                }`}
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold text-white">Processed Notes</h2>
                  <div className="flex space-x-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={() =>
                              handleCopyToClipboard(
                                `${processedData?.transcript}\n\n${processedData?.notes}`
                              )
                            }
                            size="icon"
                            variant="ghost"
                            className="text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-all duration-300 transform hover:scale-105"
                          >
                            <CopyIcon className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Copy</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={handleSaveData}
                            variant="secondary"
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105"
                          >
                            Save
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Save processed notes and action items together</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
                {processedData ? (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-semibold text-white">Transcript</h3>
                      <p className="text-gray-300">{processedData.transcript}</p>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">Summary</h3>
                      <p className="text-gray-300">{processedData.notes}</p>
                    </div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={handleProceedWithAI}
                            variant="secondary"
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
                          >
                            Process Again
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Again process the video content</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                ) : (
                  <p className="text-gray-400">No data processed.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}