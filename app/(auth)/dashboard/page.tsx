"use client"

import { VideoUploader } from '@/components/VideoUploader';
import { Sidebar } from '@/components/Sidebar';
import { FileVideo, Brain, ListTodo } from 'lucide-react';
import { VideoProvider } from '@/app/context/VideoContext';
import { signOut, getSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function Home() {
  const [tierDetails, setTierDetails] = useState("");

  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      if (session?.user?.tier) {
        setTierDetails(session.user.tier);
      }
    };

    fetchSession();
  }, []);

  return (
    <VideoProvider>
      <div className="flex min-h-screen bg-gradient-to-b from-black to-gray-900">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Main Content */}
        <main className="flex-1 md:ml-64">
          <div className="container mx-auto px-4 py-16">
            {/* Heading Section */}
            <div className="text-center mb-16">
              {/* Mobile View */}
              <div className="md:hidden">
                <h1 className="font-semibold text-4xl bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent mb-4">
                  NOTEGENIE
                </h1>
                <p className="text-lg text-gray-300">
                  Transform your meeting videos into actionable insights
                </p>
              </div>
              {/* Desktop View */}
              <div className="hidden md:block">
                <h1 className="text-4xl font-bold text-white mb-4">
                  AI-Powered Meet Notes
                </h1>
                <p className="text-xl text-gray-300">
                  Transform your meeting videos into actionable insights
                </p>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {/* Upload Video Card */}
              <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
                <div className="flex items-center mb-4">
                  <FileVideo className="w-8 h-8 text-blue-500" />
                  <h3 className="text-xl font-semibold ml-2 text-white">Upload Video</h3>
                </div>
                <p className="text-gray-300">
                  Upload meeting recordings in various formats (5 min, 100 MB max)
                </p>
              </div>

              {/* AI Processing Card */}
              <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
                <div className="flex items-center mb-4">
                  <Brain className="w-8 h-8 text-purple-500" />
                  <h3 className="text-xl font-semibold ml-2 text-white">AI Processing</h3>
                </div>
                <p className="text-gray-300">
                  Our AI analyzes the content and extracts key information
                </p>
              </div>

              {/* Get Tasks Card */}
              <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
                <div className="flex items-center mb-4">
                  <ListTodo className="w-8 h-8 text-green-500" />
                  <h3 className="text-xl font-semibold ml-2 text-white">Get Tasks</h3>
                </div>
                <p className="text-gray-300">
                  Receive organized notes and actionable tasks
                </p>
              </div>
            </div>

            {/* Video Uploader Section */}
            <div className="max-w-3xl mx-auto">
              <VideoUploader />
            </div>
          </div>
        </main>
      </div>
    </VideoProvider>
  );
}