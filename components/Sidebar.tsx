"use client";

import { useState, useEffect } from 'react';
import { signOut, getSession } from 'next-auth/react';
import { 
  Menu, 
  X, 
  Calendar, 
  Clock, 
  History,
  LogOut,
  User,
  Settings,
  Upload
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { StorageChart } from './StorageChart';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useVideo } from '@/app/context/VideoContext'; // Import the context
import Link from 'next/link'; // Import Link from next/link

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'yesterday' | 'week' | 'upload'>('upload');
  const { latestUpload, setLatestUpload } = useVideo(); // Use the context
  const [blink, setBlink] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  var tier_details="Starter";

  // Get the user ID from the session and check localStorage for latestUpload
  useEffect(() => {
    const fetchUserAndLatestUpload = async () => {
      const session = await getSession();
      console.log("session for sidebar is here : ",session);
      if (session?.user?.id) {
        const userId = session.user.id;
        const storedUpload = localStorage.getItem(`latestUpload_${userId}`);

        if (storedUpload) {
          const parsedUpload = JSON.parse(storedUpload);

          // Check if the upload is within the last 23 hours
          const uploadDate = new Date(parsedUpload.uploadDate);
          const currentDate = new Date();
          const timeDifference = currentDate.getTime() - uploadDate.getTime();
          const hoursDifference = timeDifference / (1000 * 60 * 60);

          if (hoursDifference <= 23) {
            setLatestUpload(parsedUpload); // Set the latest upload in the context
          } else {
            // If the upload is older than 23 hours, clear it from localStorage
            localStorage.removeItem(`latestUpload_${userId}`);
            setLatestUpload(null); // Clear the latest upload in the context
          }
        }
      }
      if(session?.user?.tier){
        tier_details = session.user.tier;
      }
    };

    fetchUserAndLatestUpload();
  }, [setLatestUpload]);

  // Trigger blink animation when latestUpload changes
  useEffect(() => {
    if (latestUpload) {
      setBlink(true);
      const timeout = setTimeout(() => setBlink(false), 2000); // Blink for 2 seconds
      return () => clearTimeout(timeout);
    }
  }, [latestUpload]);

  const periods = [
    { id: 'today', label: "Today's Uploads", icon: Clock },
    { id: 'yesterday', label: "Yesterday's Uploads", icon: Calendar },
    { id: 'week', label: 'Last 7 Days', icon: History },
  ] as const;

  return (
    <>
      {/* Mobile Menu Button */}
      {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          className="md:hidden fixed top-4 right-4 z-50 bg-gray-900 hover:bg-gray-800 text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed top-0 left-0 z-40 h-screen w-64 bg-gradient-to-b from-black to-gray-900 border-r border-gray-800 transition-transform duration-200 ease-in-out flex flex-col",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Logo Section */}
        <div className="p-4 border-b border-gray-800">
          <div className="h-12 flex items-center">
            {/* Logo */}
            <img src="/images/side_logo.png" alt="NoteGenie Logo" className="h-10 w-10 mr-2" />
            {/* App Name */}
            <span className="font-semibold text-lg bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              NOTEGENIE {tier_details}
            </span>
          </div>
        </div>

        {/* Main Content */}
        <ScrollArea className="flex-1">
          <div className="p-4">
            {/* Latest Upload Heading */}
            <h2 className="text-lg font-semibold mb-4 text-gray-300">Latest Upload</h2>

            {/* Latest Upload Card - Wrapped in Link */}
            <Link href="/uploaded-video">
              <div
                className={cn(
                  "mb-6 p-3 rounded-lg bg-gray-800 border border-gray-700 transition-all duration-300 cursor-pointer hover:bg-gray-700",
                  blink && "animate-blink" // Add blink animation
                )}
                onClick={() => {
                  setIsLoading(true); // Set loading state to true
                  // Simulate a delay (e.g., fetching data or redirecting)
                  setTimeout(() => {
                    setIsLoading(false); // Set loading state to false after delay
                  }, 2000); // Adjust the delay as needed
                }}
              >
                {latestUpload ? (
                  <>
                    <div className="flex items-center">
                      <p className="font-medium truncate text-gray-300">{latestUpload.fileName}</p>
                      {isLoading && (
                        <div className="ml-2">
                          <div className="w-4 h-4 border-2 border-white border-t-2 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-400">
                      {new Date(latestUpload.uploadDate).toLocaleString()}
                    </p>
                    <div className="mt-1">
                      <span className="text-xs bg-green-900 text-green-300 px-2 py-1 rounded-full">
                        {latestUpload.status}
                      </span>
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-gray-400">No uploads yet.</p>
                )}
              </div>
            </Link>

            {/* Video History Section */}
            <h2 className="text-lg font-semibold mb-4 text-gray-300">Video History</h2>
            
            {/* Upload New Video Button */}
            <Button
              variant={selectedPeriod === 'upload' ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start text-gray-300 hover:bg-gray-800 hover:text-white mb-4",
                selectedPeriod === 'upload' && "bg-gray-800 text-white"
              )}
              onClick={() => {
                window.location.href = '/dashboard';
              }}
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload New Video
            </Button>

            <div className="space-y-2">
              {periods.map(({ id, label, icon: Icon }) => (
                <Button
                  key={id}
                  variant={selectedPeriod === id ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start text-gray-300 hover:bg-gray-800 hover:text-white",
                    selectedPeriod === id && "bg-gray-800 text-white"
                  )}
                  onClick={() => setSelectedPeriod(id)}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {label}
                </Button>
              ))}
            </div>
          </div>
        </ScrollArea>

        {/* Bottom Section */}
        <div className="p-4 border-t border-gray-800 space-y-4">
          {/* Storage Usage */}
          <StorageChart used={200} total={500} />

          {/* User Profile */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Avatar className="h-8 w-8">
                <AvatarImage/>
                <AvatarFallback>
                  {/* Placeholder for user initials */}
                </AvatarFallback>
              </Avatar>
              <div className="ml-2">
                <p className="text-sm font-medium text-gray-300">User Name</p>
                <p className="text-xs text-gray-500">user@example.com</p>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-gray-300 hover:bg-gray-800">
                  <Settings className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-gray-800 border border-gray-700">
                <DropdownMenuItem 
                  onClick={() => window.location.href = '/profile'}
                  className="text-gray-300 hover:bg-gray-700"
                >
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => signOut()}
                  className="text-gray-300 hover:bg-gray-700"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </>
  );
}