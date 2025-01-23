"use client";

import { createContext, useContext, useState } from "react";

interface VideoUpload {
    _id: string;
    fileName: string;
    uploadDate: string;
    status: string;
    url: string; // Add the url property
  }

interface VideoContextType {
  latestUpload: VideoUpload | null;
  setLatestUpload: (upload: VideoUpload | null) => void;
}

const VideoContext = createContext<VideoContextType | null>(null);

export function VideoProvider({ children }: { children: React.ReactNode }) {
  const [latestUpload, setLatestUpload] = useState<VideoUpload | null>(null);

  return (
    <VideoContext.Provider value={{ latestUpload, setLatestUpload }}>
      {children}
    </VideoContext.Provider>
  );
}

export function useVideo() {
  const context = useContext(VideoContext);
  if (!context) {
    throw new Error("useVideo must be used within a VideoProvider");
  }
  return context;
}