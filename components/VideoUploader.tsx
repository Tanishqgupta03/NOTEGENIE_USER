"use client";

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { getSession } from "next-auth/react";
import { useVideo } from '@/app/context/VideoContext';

// Constants for validation
const MAX_FILE_SIZE_MB = 100;
const MAX_DURATION_MINUTES = 5;

export function VideoUploader() {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const { setLatestUpload } = useVideo();

  const validateFile = async (file: File) => {
    // File size validation
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      throw new Error(`File size exceeds ${MAX_FILE_SIZE_MB}MB limit`);
    }
  
    // Video duration validation
    const duration = await getVideoDuration(file);
  
    console.log("duration:", duration);
  
    if (duration < 30) {
      throw new Error("Video must be at least 30 seconds long");
    }
  
    if (duration > MAX_DURATION_MINUTES * 60) {
      throw new Error(`Video exceeds ${MAX_DURATION_MINUTES} minute limit`);
    }
  };
  

  const getVideoDuration = (file: File): Promise<number> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      
      video.onloadedmetadata = () => {
        URL.revokeObjectURL(video.src);
        resolve(video.duration);
      };
      
      video.onerror = () => reject('Error reading video');
      video.src = URL.createObjectURL(file);
    });
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsUploading(true);

    try {
      // Validate file before upload
      await validateFile(file);

      const session = await getSession();
      if (!session || !session.user?.id) {
        throw new Error("User not authenticated");
      }

      const userId = session.user.id;
      const formData = new FormData();
      formData.append('video', file);
      formData.append('userId', userId);

      localStorage.removeItem(`latestUpload_${userId}`);

      const response = await fetch('http://localhost:3001/api/upload-video', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();

      // Update context and local storage
      const latestUploadData = {
        _id: data.video._id,
        fileName: data.video.filename,
        uploadDate: data.video.createdAt,
        status: "completed",
        url: data.video.url,
      };
      setLatestUpload(latestUploadData);
      localStorage.setItem(`latestUpload_${userId}`, JSON.stringify(latestUploadData));

      toast({
        title: "Success!",
        description: "Video uploaded successfully. Processing will begin shortly.",
      });

    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload video",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  }, [toast, setLatestUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': ['.mp4', '.avi', '.mov', '.mkv']
    },
    maxFiles: 1,
  });

  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-lg p-10 text-center cursor-pointer
        transition-colors duration-200
        ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
        hover:border-blue-500 hover:bg-blue-50
      `}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center space-y-4">
        {isUploading ? (
          <>
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
            <p className="text-lg text-gray-600">Uploading video...</p>
          </>
        ) : (
          <>
            <Upload className="w-12 h-12 text-gray-400" />
            <div>
              <p className="text-lg text-gray-600">
                {isDragActive
                  ? "Drop the video here"
                  : "Drag & drop your video here"}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Supported formats: MP4, AVI, MOV, MKV
              </p>
              <p className="text-sm text-gray-500">
                Min 30 sec • Max {MAX_DURATION_MINUTES} minutes • Max {MAX_FILE_SIZE_MB}MB
              </p>
            </div>
            <Button variant="outline">
              Select Video
            </Button>
          </>
        )}
      </div>
    </div>
  );
}