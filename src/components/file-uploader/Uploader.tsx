"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn, convertFileToUrl } from "@/lib/utils";
import { useCallback, useEffect, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import {
  RenderEmptyState,
  RenderErrorState,
  RenderUploadedState,
  RenderUploadingState,
} from "./RenderState";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { useUploadThing } from "@/lib/uploadthing";

interface FileStateProps {
  id: string | null;
  file: File | null;
  isUploading: boolean;
  progress: number;
  key?: string;
  isDeleting: boolean;
  error: boolean;
  objectUrl?: string;
  fileType: "image" | "video";
}

interface UploaderProps {
  value?: string;
  onValueChange?: (value: string) => void;
  fileUrl?: string;
}

export function Uploader({ value, onValueChange, fileUrl }: UploaderProps) {
  const [fileState, setFileState] = useState<FileStateProps>({
    id: null,
    file: null,
    isUploading: false,
    isDeleting: false,
    progress: 0,
    key: value,
    error: false,
    fileType: "image",
    objectUrl: value || fileUrl,
  });

  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    onClientUploadComplete: (res) => {
      if (res && res[0]) {
        const uploadedFile = res[0];
        setFileState((prev) => ({
          ...prev,
          progress: 100,
          isUploading: false,
          key: uploadedFile.key,
        }));

        onValueChange?.(uploadedFile.url);
        toast.success("File uploaded successfully!");
      }
    },
    onUploadError: (error) => {
      console.error("Upload error:", error);
      toast.error("Upload failed. Please try again.");
      setFileState((prev) => ({
        ...prev,
        progress: 0,
        error: true,
        isUploading: false,
      }));
    },
    onUploadProgress: (progress) => {
      setFileState((prev) => ({
        ...prev,
        progress: progress,
      }));
    },
  });

  const handleFileUpload = async (file: File) => {
    setFileState((prev) => ({
      ...prev,
      isUploading: true,
      progress: 0,
      error: false,
    }));

    try {
      await startUpload([file]);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Upload failed. Please try again.");
      setFileState((prev) => ({
        ...prev,
        progress: 0,
        error: true,
        isUploading: false,
      }));
    }
  };

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];

        if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
          URL.revokeObjectURL(fileState.objectUrl);
        }

        setFileState({
          file: file,
          isUploading: false,
          progress: 0,
          objectUrl: convertFileToUrl(file),
          error: false,
          id: uuidv4(),
          isDeleting: false,
          fileType: "image",
        });

        handleFileUpload(file);
      }
    },
    [fileState.objectUrl],
  );

  const onFileRejected = (rejectedFiles: FileRejection[]) => {
    if (rejectedFiles.length > 0) {
      const tooManyFiles = rejectedFiles.find(
        (rejection) => rejection.errors[0].code === "too-many-files",
      );

      const fileSizeTooBig = rejectedFiles.find(
        (rejection) => rejection.errors[0].code === "file-too-large",
      );

      if (fileSizeTooBig) {
        toast.error("The file size should not exceed 4MB");
      }

      if (tooManyFiles) {
        toast.error("Too many files selected. Only one file is permitted");
      }
    }
  };

  const renderContent = () => {
    if (fileState.isUploading || isUploading) {
      return (
        <RenderUploadingState
          progress={fileState.progress}
          file={fileState.file as File}
        />
      );
    }

    if (fileState.error) {
      return (
        <RenderErrorState
          onRetry={() => fileState.file && handleFileUpload(fileState.file)}
        />
      );
    }

    if (fileState.objectUrl) {
      return (
        <RenderUploadedState
          previewUrl={fileState.objectUrl}
          isDeleting={fileState.isDeleting}
          onDelete={handleRemoveFile}
        />
      );
    }

    return <RenderEmptyState isDragActive={isDragActive} />;
  };

  const handleRemoveFile = async () => {
    if (fileState.isDeleting || !fileState.objectUrl) return;

    try {
      setFileState((prev) => ({
        ...prev,
        isDeleting: true,
      }));

      // For UploadThing, we don't need to manually delete files
      // They handle cleanup automatically

      if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
        URL.revokeObjectURL(fileState.objectUrl);
      }

      onValueChange?.("");

      setFileState({
        file: null,
        isUploading: false,
        progress: 0,
        objectUrl: undefined,
        error: false,
        fileType: "image",
        id: null,
        isDeleting: false,
      });

      toast.success("File removed successfully");
    } catch (error) {
      toast.error("Error removing file");

      setFileState((prev) => ({
        ...prev,
        error: false,
        isDeleting: false,
      }));

      console.log(error);
    }
  };

  useEffect(() => {
    return () => {
      if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
        URL.revokeObjectURL(fileState.objectUrl);
      }
    };
  }, [fileState.objectUrl]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 1,
    multiple: false,
    maxSize: 4 * 1024 * 1024, // 4MB to match UploadThing config
    onDropRejected: onFileRejected,
  });

  return (
    <Card
      {...getRootProps()}
      className={cn(
        "relative h-64 w-full rounded-lg border-2 border-dashed py-0 transition-colors duration-200",
        isDragActive
          ? "border-primary bg-primary/10 border-solid"
          : "border-border hover:border-primary",
        fileState.isUploading ||
          fileState.objectUrl ||
          fileState.isDeleting ||
          isUploading
          ? "cursor-default"
          : "cursor-pointer",
      )}
    >
      <CardContent className="flex h-full w-full items-center justify-center rounded-lg">
        <input
          {...getInputProps()}
          disabled={
            fileState.isUploading || fileState.isDeleting || isUploading
          }
        />
        {renderContent()}
      </CardContent>
    </Card>
  );
}
