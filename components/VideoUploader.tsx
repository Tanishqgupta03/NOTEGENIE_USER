"use client";

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export function VideoUploader() {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsUploading(true);
    
    // Create FormData
    const formData = new FormData();
    formData.append('video', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      
      toast({
        title: "Success!",
        description: "Video uploaded successfully. Processing will begin shortly.",
      });
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload video. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  }, [toast]);

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
                or click to select a file
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