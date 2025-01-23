// app/uploaded-video/page.tsx
"use client";

import { useVideo } from '@/app/context/VideoContext';
import { Button } from '@/components/ui/button';
import { Sidebar } from '@/components/Sidebar';
import { useEffect, useState } from 'react';
import { VideoProvider } from '@/app/context/VideoContext'; // Import VideoProvider

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

  useEffect(() => {
    setIsClient(true); // Set isClient to true after mounting
  }, []);

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-black to-gray-900">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 md:ml-64">
        <div className="container mx-auto px-4 py-16">
          {/* Video Preview Section */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
              <h2 className="text-2xl font-semibold text-white mb-6">
                Video Preview
              </h2>

              {/* Video Player - Render only on the client */}
              <div className="mb-6">
                {isClient && latestUpload ? ( // Render only on the client
                  <video
                    controls
                    className="w-full rounded-lg"
                    src={latestUpload.url} // Use the video URL from latestUpload
                  >
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <p className="text-gray-400">No video available for preview.</p>
                )}
              </div>

              {/* Action Section */}
              <div className="flex flex-col space-y-4">
                <p className="text-lg text-gray-300">
                  Do you want us to proceed with AI to create notes for this meeting?
                  You can also check the preview here or trim your video clip for better accuracy.
                </p>

                {/* Buttons */}
                <div className="flex space-x-4">
                  <Button
                    variant="secondary"
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
                  >
                    Proceed with AI Notes
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
          </div>
        </div>
      </main>
    </div>
  );
}