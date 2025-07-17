"use client";

import {
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError,
  upload,
} from "@imagekit/next";
import { set } from "mongoose";
import { useRef, useState } from "react";

interface FileUploadProps {
  onSuccess?: (url: string) => void;
  onProgress?: (progress: number) => void;
  fileType?: "image" | "video";
}
const FileUpload = ({ onSuccess, onProgress, fileType }: FileUploadProps) => {
  const [progress, setProgress] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const abortController = new AbortController();

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileValidation = (file: File) => {
    {
      if (fileType === "video") {
        if (!file.type.startsWith("video/")) {
          setError("Invalid file type. Only videos are allowed.");
        }
      } else {
        if (!file.type.startsWith("image/")) {
          setError("Invalid file type. Only images are allowed.");
        }
      }
      if (file.size > 100 * 1024 * 1024) {
        setError("File size exceeds the limit of 100MB.");
      }
      return true;
    }
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const File = e.target.files?.[0];
      if (!File || !fileValidation(File)) {
        setError("Invalid file selected");
        return;
      }

      setUploading(true);
      setError(null);

      try {
        const authRes = await fetch("/api/auth/imagekit-auth");
        const authData = await authRes.json();
        const response = await upload({
          file: File,
          fileName: File.name,
          expire: authData.expire,
          token: authData.token,
          signature: authData.signature,
          publickey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,

          onProgress: (event: any) => {
            if (event.lengthComputable && onProgress) {
              const percent = (event.loaded / event.total) * 100;
              setProgress(percent);
              onProgress(Math.round(percent));
            }
          },
          onSuccess: (response: { url: string }) => {
            setUploading(false);
            setProgress(100);
          },
          onError: (error: any) => {
            setUploading(false);
            setProgress(0);
            if (error instanceof ImageKitAbortError) {
              console.error("Upload aborted:", error);
              setError("Upload aborted");
            } else if (error instanceof ImageKitInvalidRequestError) {
              console.error("Invalid request:", error);
              setError("Invalid request");
            } else if (error instanceof ImageKitServerError) {
              console.error("Server error:", error);
              setError("Server error");
            } else if (error instanceof ImageKitUploadNetworkError) {
              console.error("Network error:", error);
              setError("Network error");
            } else {
              console.error("Unknown error:", error);
              setError("An unknown error occurred");
            }
          },
        });
      } catch (error) {
        console.error("Error during file upload:", error);
        setUploading(false);
        setProgress(0);
        setError("An error occurred while uploading the file.");
      } finally {
        setUploading(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    };
  };

    function handleFileChange(event: ChangeEvent<HTMLInputElement>): void {
        throw new Error("Function not implemented.");
    }

  return (
    <>
      <input
        type="file"
        accept={fileType === "video" ? "video/*" : "image/*"}
        onChange={handleFileChange}
      />
      {uploading && <p>Uploading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <br />
      Upload progress: <progress value={progress} max={100}></progress>
    </>
  );
};

export default FileUpload;
