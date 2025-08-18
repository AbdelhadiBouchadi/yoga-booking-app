"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  CloudUploadIcon,
  FileUpIcon,
  FileTextIcon,
  XIcon,
  Loader2Icon,
  RefreshCwIcon,
} from "lucide-react";

export function RenderEmptyState({ isDragActive }: { isDragActive: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 text-center">
      <div
        className={cn(
          "bg-muted mx-auto flex size-16 items-center justify-center rounded-full transition-all duration-300",
          isDragActive && "bg-primary/10 scale-110",
        )}
      >
        <CloudUploadIcon
          className={cn(
            "text-muted-foreground size-8 transition-all duration-300",
            isDragActive && "text-primary scale-110",
          )}
        />
      </div>

      <div className="space-y-2">
        <p className="text-foreground text-lg font-semibold">
          Drop Your PDF Here
        </p>
        <p className="text-muted-foreground text-sm">
          or{" "}
          <span className="text-primary cursor-pointer font-semibold transition-all duration-200 hover:underline hover:underline-offset-2">
            click to browse
          </span>
        </p>
      </div>

      <Button type="button" className="mt-2 gap-2 px-6">
        <FileUpIcon className="size-4" />
        Select PDF
      </Button>

      <p className="text-muted-foreground text-xs">Maximum file size: 10MB</p>
    </div>
  );
}

interface RenderErrorStateProps {
  onRetry?: () => void;
}

export function RenderErrorState({ onRetry }: RenderErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 text-center">
      <div className="bg-destructive/30 mx-auto flex size-16 animate-pulse items-center justify-center rounded-full">
        <FileTextIcon className="text-destructive size-8" />
      </div>

      <div className="space-y-2">
        <p className="text-foreground text-lg font-semibold">Upload Failed</p>
        <p className="text-muted-foreground text-sm">
          Something went wrong while uploading your PDF
        </p>
      </div>

      <Button type="button" className="mt-2 gap-2 px-6" onClick={onRetry}>
        <RefreshCwIcon className="size-4" />
        Try Again
      </Button>
    </div>
  );
}

export function RenderUploadingState({
  progress = 0,
  file,
}: {
  progress: number;
  file: File;
}) {
  return (
    <div className="flex w-full flex-col items-center justify-center space-y-4 text-center">
      <div className="bg-muted mx-auto flex size-16 items-center justify-center rounded-full">
        <Loader2Icon className="text-primary size-8 animate-spin" />
      </div>

      <div className="w-full space-y-2">
        <p className="text-foreground text-lg font-semibold">Uploading PDF</p>
        {file && (
          <p className="text-muted-foreground mx-auto max-w-xs truncate text-sm">
            {file.name}
          </p>
        )}
      </div>

      <div className="w-full max-w-xs space-y-2">
        <div className="bg-muted h-2 overflow-hidden rounded-full">
          <div
            className="bg-primary h-full rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-muted-foreground text-xs">{progress}% uploaded</p>
      </div>
    </div>
  );
}

interface RenderUploadedStateProps {
  fileName: string;
  fileSize?: number;
  isDeleting: boolean;
  onDelete: () => void;
}

export function RenderUploadedState({
  fileName,
  fileSize,
  isDeleting,
  onDelete,
}: RenderUploadedStateProps) {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    );
  };

  return (
    <div className="group relative flex h-full w-full flex-col items-center justify-center space-y-4 p-6">
      <div className="bg-primary/10 flex size-20 items-center justify-center rounded-full">
        <FileTextIcon className="text-primary size-10" />
      </div>

      <div className="space-y-2 text-center">
        <p className="text-foreground font-semibold">PDF Uploaded</p>
        <p className="text-muted-foreground max-w-xs truncate text-sm">
          {fileName}
        </p>
        {fileSize && (
          <p className="text-muted-foreground text-xs">
            {formatFileSize(fileSize)}
          </p>
        )}
      </div>

      <Button
        type="button"
        size="sm"
        variant="destructive"
        className="gap-2"
        onClick={onDelete}
        disabled={isDeleting}
      >
        {isDeleting ? (
          <Loader2Icon className="size-4 animate-spin" />
        ) : (
          <XIcon className="size-4" />
        )}
        Remove PDF
      </Button>
    </div>
  );
}
