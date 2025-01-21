"use client";

import { useState } from 'react';
import { signOut } from 'next-auth/react';
import { 
  Menu, 
  X, 
  Calendar, 
  Clock, 
  History,
  LogOut,
  User,
  Settings
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

interface VideoUpload {
  _id: string;
  fileName: string;
  uploadDate: string;
  status: string;
}

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'yesterday' | 'week'>('today');

  const uploads: VideoUpload[] = [
    { _id: '1', fileName: 'team-meeting.mp4', uploadDate: '2024-01-10T10:00:00Z', status: 'completed' },
  ];

  const periods = [
    { id: 'today', label: "Today's Uploads", icon: Clock },
    { id: 'yesterday', label: "Yesterday's Uploads", icon: Calendar },
    { id: 'week', label: 'Last 7 Days', icon: History },
  ] as const;

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        className="md:hidden fixed top-4 right-4 z-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
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
              NOTEGENIE
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4 text-gray-300">Video History</h2>
            
            <div className="space-y-2">
              {periods.map(({ id, label, icon: Icon }) => (
                <Button
                  key={id}
                  variant={selectedPeriod === id ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start text-gray-300 hover:bg-gray-800 hover:text-white",
                    selectedPeriod === id && "bg-gray-800 text-white" // Active state styling
                  )}
                  onClick={() => setSelectedPeriod(id)}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {label}
                </Button>
              ))}
            </div>

            <ScrollArea className="mt-6 flex-1 h-[calc(100vh-400px)]">
              <div className="space-y-2">
                {uploads.map((upload) => (
                  <div
                    key={upload._id}
                    className="p-3 rounded-lg bg-gray-800 hover:bg-gray-700 cursor-pointer border border-gray-700"
                  >
                    <p className="font-medium truncate text-gray-300">{upload.fileName}</p>
                    <p className="text-sm text-gray-400">
                      {new Date(upload.uploadDate).toLocaleString()}
                    </p>
                    <div className="mt-1">
                      <span className="text-xs bg-green-900 text-green-300 px-2 py-1 rounded-full">
                        {upload.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>

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