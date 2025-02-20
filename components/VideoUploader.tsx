"use client";

import { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { getSession } from "next-auth/react";
import { useVideo } from '@/app/context/VideoContext';
import { FFmpeg } from '@ffmpeg/ffmpeg';

// Constants for validation
const MAX_FILE_SIZE_MB = 100;
const MAX_DURATION_MINUTES = 5;

type ProgressStep = 'validating' | 'compressing' | 'uploading';

export function VideoUploader() {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState<ProgressStep | null>(null);
  const { toast } = useToast();
  const { setLatestUpload } = useVideo();
  const [ffmpeg, setFFmpeg] = useState<FFmpeg | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('@ffmpeg/ffmpeg').then(({ FFmpeg }) => {
        const ffmpegInstance = new FFmpeg();
        setFFmpeg(ffmpegInstance);
      });
    }
  }, []);

  const validateFile = async (file: File) => {
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      throw new Error(`File size exceeds ${MAX_FILE_SIZE_MB}MB limit`);
    }

    const duration = await getVideoDuration(file);
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

  interface VideoUploadResponse {
    video: {
      _id: string;
      filename: string;
      createdAt: string;
      url: string;
    };
  }

  const compressAndUpload = async (file: File): Promise<VideoUploadResponse> => {
    if (!ffmpeg) {
      throw new Error("FFmpeg not initialized");
    }

    const compressionStartTime = new Date().getTime();
    console.log("Compression Start Time:", compressionStartTime);
    const session = await getSession();
    if (!session || !session.user?.id) {
      throw new Error("User not authenticated");
    }
    console.log("Original file size:", (file.size / 1024 / 1024).toFixed(2), "MB");

    const userId = session.user.id;
    
    // Compression
    await ffmpeg.load();
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    await ffmpeg.writeFile('input.mp4', uint8Array);

    await ffmpeg.exec([
      '-i', 'input.mp4',
      '-vf', 'scale=160:120',
      '-c:v', 'libx264',
      '-b:v', '200k',
      '-crf', '30',
      '-preset', 'ultrafast',
      '-r', '10',
      '-c:a', 'libmp3lame',
      '-b:a', '64k',
      '-ar', '22050',
      '-ac', '1',
      '-threads', '0',
      '-movflags', 'frag_keyframe+empty_moov',
      'output.mp4'
    ]);

    const compressedData = await ffmpeg.readFile('output.mp4');
    console.log("Compressed file size:", (compressedData.length / 1024 / 1024).toFixed(2), "MB");
  
    // Convert Uint8Array to a File object
    const compressedFile = new File([compressedData], file.name, { type: file.type });
    const compressionEndTime = new Date().getTime();
    console.log("Compression End Time:", compressionEndTime);
    console.log("Compression Time (ms):", compressionEndTime - compressionStartTime);

    // Update progress after compression
    setProgress(60);
    setCurrentStep('uploading');

    // Upload with progress tracking
    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('video', compressedFile);

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `${process.env.NEXT_PUBLIC_VIDEO_UPLOAD_API}`);

      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const uploadProgress = (event.loaded / event.total) * 40;
          setProgress(60 + uploadProgress);
        }
      });

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          reject(new Error('Upload failed'));
        }
      };

      xhr.onerror = () => reject(new Error('Upload failed'));
      xhr.send(formData);
    });
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;
    const startTime = new Date().getTime();
    console.log("Upload Start Time:", startTime);
  
    setIsUploading(true);
    setCurrentStep('validating');
    setProgress(0);
  
    try {
      await validateFile(file);
      setProgress(10);
      setCurrentStep('compressing');
  
      const response = await compressAndUpload(file); // Store the response properly
  
      const session = await getSession();
      if (!session || !session.user?.id) {
        throw new Error("User not authenticated");
      }
      const userId = session.user.id; // Define userId here
  
      const data = response; // No need to call `await response.json()` since it's already JSON
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
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload video",
        variant: "destructive",
      });
    } finally {
      const endTime = new Date().getTime();
      console.log("Upload End Time:", endTime);
      console.log("Total Upload Time (ms):", endTime - startTime);
      setIsUploading(false);
      setProgress(0);
      setCurrentStep(null);
    }
  }, [toast, setLatestUpload, ffmpeg]);
  

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
            <p className="text-lg text-gray-600">
              {currentStep === 'validating' && 'Validating...'}
              {currentStep === 'compressing' && 'Compressing...'}
              {currentStep === 'uploading' && 'Uploading...'}
              {Math.round(progress)}%
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-500 h-2.5 rounded-full transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
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
              <p className="text-xs text-gray-400 mt-2">
                Please note: Your video will be validated, compressed, and then uploaded. 
                This process may take some time depending on the video size and your internet speed.
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