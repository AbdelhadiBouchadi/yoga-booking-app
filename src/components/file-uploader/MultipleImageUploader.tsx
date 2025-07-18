"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn, convertFileToUrl } from "@/lib/utils";
import { useCallback, useEffect, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { useUploadThing } from "@/lib/uploadthing";
import {
  UploadCloudIcon,
  XIcon,
  Loader2Icon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
  DownloadIcon,
  MaximizeIcon,
} from "lucide-react";
import Image from "next/image";
import { Dialog, DialogContent } from "../ui/dialog";

interface FileStateProps {
  id: string;
  file: File | null;
  isUploading: boolean;
  progress: number;
  url?: string;
  isDeleting: boolean;
  error: boolean;
  objectUrl?: string;
}

interface MultiImageUploaderProps {
  value?: string[];
  onValueChange?: (value: string[]) => void;
  maxFiles?: number;
  className?: string;
}

export function MultiImageUploader({
  value = [],
  onValueChange,
  maxFiles = 5,
  className,
}: MultiImageUploaderProps) {
  const [fileStates, setFileStates] = useState<FileStateProps[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);

  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    onClientUploadComplete: (res) => {
      if (res && res.length > 0) {
        const uploadedUrls = res.map((file) => file.url);
        const newValue = [...value, ...uploadedUrls];
        onValueChange?.(newValue);

        // Update file states to mark as completed
        setFileStates((prev) =>
          prev.map((state) => {
            const matchingUpload = res.find(
              (upload) => state.file?.name === upload.name,
            );
            if (matchingUpload) {
              return {
                ...state,
                isUploading: false,
                progress: 100,
                url: matchingUpload.url,
                error: false,
              };
            }
            return state;
          }),
        );

        toast.success(`${res.length} file(s) uploaded successfully!`);
      }
    },
    onUploadError: (error) => {
      console.error("Upload error:", error);
      toast.error("Upload failed. Please try again.");
      setFileStates((prev) =>
        prev.map((state) => ({
          ...state,
          error: true,
          isUploading: false,
          progress: 0,
        })),
      );
    },
    onUploadProgress: (progress) => {
      setFileStates((prev) =>
        prev.map((state) =>
          state.isUploading ? { ...state, progress } : state,
        ),
      );
    },
  });

  const handleFileUpload = async (files: File[]) => {
    const newFileStates = files.map((file) => ({
      id: uuidv4(),
      file,
      isUploading: true,
      progress: 0,
      isDeleting: false,
      error: false,
      objectUrl: convertFileToUrl(file),
    }));

    setFileStates((prev) => [...prev, ...newFileStates]);

    try {
      await startUpload(files);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Upload failed. Please try again.");
    }
  };

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const remainingSlots =
        maxFiles -
        value.length -
        fileStates.filter((f) => f.isUploading).length;
      const filesToUpload = acceptedFiles.slice(0, remainingSlots);

      if (filesToUpload.length < acceptedFiles.length) {
        toast.warning(
          `Only ${filesToUpload.length} files can be uploaded. Maximum ${maxFiles} files allowed.`,
        );
      }

      if (filesToUpload.length > 0) {
        handleFileUpload(filesToUpload);
      }
    },
    [value.length, fileStates, maxFiles],
  );

  const onFileRejected = (rejectedFiles: FileRejection[]) => {
    if (rejectedFiles.length > 0) {
      const fileSizeTooBig = rejectedFiles.find(
        (rejection) => rejection.errors[0].code === "file-too-large",
      );

      if (fileSizeTooBig) {
        toast.error("Some files exceed the 4MB limit");
      }
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    const newValue = value.filter((_, index) => index !== indexToRemove);
    onValueChange?.(newValue);

    // Adjust current slide if necessary
    if (currentSlide >= newValue.length && newValue.length > 0) {
      setCurrentSlide(newValue.length - 1);
    } else if (newValue.length === 0) {
      setCurrentSlide(0);
    }

    toast.success("Image removed successfully");
  };

  const handleRemoveUploadingFile = (fileId: string) => {
    setFileStates((prev) => prev.filter((state) => state.id !== fileId));
  };

  const nextSlide = () => {
    const totalImages = value.length + fileStates.length;
    setCurrentSlide((prev) => (prev + 1) % totalImages);
  };

  const prevSlide = () => {
    const totalImages = value.length + fileStates.length;
    setCurrentSlide((prev) => (prev - 1 + totalImages) % totalImages);
  };

  const nextModalImage = () => {
    setModalImageIndex((prev) => (prev + 1) % value.length);
  };

  const prevModalImage = () => {
    setModalImageIndex((prev) => (prev - 1 + value.length) % value.length);
  };

  const openModal = (index: number) => {
    if (index < value.length) {
      setModalImageIndex(index);
      setModalOpen(true);
    }
  };

  const canUploadMore =
    value.length + fileStates.filter((f) => f.isUploading).length < maxFiles;
  const totalImages = value.length + fileStates.length;
  const hasImages = totalImages > 0;

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: true,
    maxSize: 4 * 1024 * 1024, // 4MB
    onDropRejected: onFileRejected,
    disabled: !canUploadMore || isUploading,
  });

  // Clean up object URLs
  useEffect(() => {
    return () => {
      fileStates.forEach((state) => {
        if (state.objectUrl && !state.objectUrl.startsWith("http")) {
          URL.revokeObjectURL(state.objectUrl);
        }
      });
    };
  }, []);

  return (
    <div className={cn("space-y-6", className)}>
      {/* Enhanced Image Slider */}
      {hasImages && (
        <Card className="relative overflow-hidden shadow-lg">
          <CardContent className="p-0">
            <div className="relative h-80 w-full md:h-96">
              {/* Navigation Buttons */}
              {totalImages > 1 && (
                <>
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    className="absolute top-1/2 left-4 z-20 h-10 w-10 -translate-y-1/2 bg-black/60 text-white backdrop-blur-sm transition-all hover:scale-110 hover:bg-black/80"
                    onClick={prevSlide}
                  >
                    <ChevronLeftIcon className="h-5 w-5" />
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    className="absolute top-1/2 right-4 z-20 h-10 w-10 -translate-y-1/2 bg-black/60 text-white backdrop-blur-sm transition-all hover:scale-110 hover:bg-black/80"
                    onClick={nextSlide}
                  >
                    <ChevronRightIcon className="h-5 w-5" />
                  </Button>
                </>
              )}

              {/* Current Image */}
              {currentSlide < value.length ? (
                <div className="group relative h-full w-full">
                  <img
                    src={value[currentSlide]}
                    alt={`Image ${currentSlide + 1}`}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />

                  {/* Image Overlay Controls */}
                  <div className="absolute inset-0 bg-black/0 transition-all duration-300 group-hover:bg-black/20" />

                  <div className="absolute top-4 right-4 flex space-x-2 opacity-0 transition-all duration-300 group-hover:opacity-100">
                    <Button
                      type="button"
                      size="icon"
                      variant="secondary"
                      className="h-9 w-9 bg-black/60 text-white backdrop-blur-sm hover:bg-black/80"
                      onClick={() => openModal(currentSlide)}
                    >
                      <MaximizeIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      size="icon"
                      variant="destructive"
                      className="h-9 w-9"
                      onClick={() => handleRemoveImage(currentSlide)}
                    >
                      <XIcon className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Image Counter */}
                  <div className="absolute bottom-4 left-4 rounded-full bg-black/60 px-3 py-1 text-sm text-white backdrop-blur-sm">
                    {currentSlide + 1} / {value.length}
                  </div>
                </div>
              ) : (
                // Show uploading file
                <div className="bg-muted flex h-full w-full items-center justify-center">
                  {(() => {
                    const uploadingIndex = currentSlide - value.length;
                    const uploadingFile = fileStates[uploadingIndex];

                    if (uploadingFile?.error) {
                      return (
                        <div className="flex flex-col items-center space-y-4">
                          <div className="text-destructive text-lg font-medium">
                            Upload Failed
                          </div>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handleRemoveUploadingFile(uploadingFile.id)
                            }
                          >
                            Remove
                          </Button>
                        </div>
                      );
                    }

                    if (uploadingFile?.objectUrl) {
                      return (
                        <div className="group relative h-full w-full">
                          <img
                            src={uploadingFile.objectUrl}
                            alt="Uploading..."
                            className="h-full w-full object-cover opacity-60"
                          />
                          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm">
                            <div className="rounded-full bg-white/90 p-4 shadow-lg">
                              <Loader2Icon className="text-primary h-8 w-8 animate-spin" />
                            </div>
                            <div className="mt-4 rounded-full bg-black/60 px-4 py-2 text-white backdrop-blur-sm">
                              <div className="text-sm font-medium">
                                {uploadingFile.progress}% uploaded
                              </div>
                            </div>
                          </div>
                          <Button
                            type="button"
                            size="icon"
                            variant="destructive"
                            className="absolute top-4 right-4 h-9 w-9 opacity-0 transition-opacity group-hover:opacity-100"
                            onClick={() =>
                              handleRemoveUploadingFile(uploadingFile.id)
                            }
                          >
                            <XIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      );
                    }

                    return null;
                  })()}
                </div>
              )}

              {/* Enhanced Slide Indicators */}
              {totalImages > 1 && (
                <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 space-x-2 rounded-full bg-black/60 px-3 py-2 backdrop-blur-sm">
                  {Array.from({ length: totalImages }).map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      className={cn(
                        "h-2 w-2 rounded-full transition-all duration-300",
                        index === currentSlide
                          ? "scale-125 bg-white"
                          : "bg-white/50 hover:scale-110 hover:bg-white/75",
                      )}
                      onClick={() => setCurrentSlide(index)}
                    />
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Enhanced Upload Area */}
      {canUploadMore && (
        <Card
          {...getRootProps()}
          className={cn(
            "relative cursor-pointer rounded-xl border-2 border-dashed transition-all duration-300",
            isDragActive
              ? "border-primary bg-primary/5 scale-[1.02] border-solid shadow-lg"
              : "border-border hover:border-primary hover:bg-accent/20",
            isUploading && "cursor-default opacity-50",
            hasImages ? "h-32" : "h-40",
          )}
        >
          <CardContent className="flex h-full w-full items-center justify-center">
            <input
              {...getInputProps()}
              disabled={isUploading || !canUploadMore}
            />

            <div className="flex flex-col items-center justify-center space-y-3 text-center">
              <div
                className={cn(
                  "bg-muted mx-auto flex h-14 w-14 items-center justify-center rounded-full transition-all duration-300",
                  isDragActive && "bg-primary/10 scale-110 shadow-lg",
                )}
              >
                {hasImages ? (
                  <PlusIcon
                    className={cn(
                      "text-muted-foreground h-7 w-7 transition-all duration-300",
                      isDragActive && "text-primary scale-110",
                    )}
                  />
                ) : (
                  <UploadCloudIcon
                    className={cn(
                      "text-muted-foreground h-7 w-7 transition-all duration-300",
                      isDragActive && "text-primary scale-110",
                    )}
                  />
                )}
              </div>

              <div className="space-y-1">
                <p className="text-foreground text-base font-semibold">
                  {hasImages ? "Add More Images" : "Drop Your Images Here"}
                </p>
                <p className="text-muted-foreground text-sm">
                  or{" "}
                  <span className="text-primary font-medium hover:underline">
                    click to browse
                  </span>
                </p>
              </div>

              <div className="bg-muted rounded-full px-3 py-1">
                <p className="text-muted-foreground text-xs font-medium">
                  {value.length +
                    fileStates.filter((f) => f.isUploading).length}{" "}
                  / {maxFiles} images • Max 4MB each
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Enhanced Upload Progress Summary */}
      {fileStates.some((f) => f.isUploading) && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Loader2Icon className="text-primary h-4 w-4 animate-spin" />
                  <span className="text-sm font-semibold">
                    Uploading Images
                  </span>
                </div>
                <span className="text-muted-foreground text-sm">
                  {fileStates.filter((f) => f.isUploading).length} remaining
                </span>
              </div>
              <div className="space-y-3">
                {fileStates
                  .filter((f) => f.isUploading)
                  .map((file) => (
                    <div key={file.id} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-foreground truncate font-medium">
                          {file.file?.name}
                        </span>
                        <span className="text-muted-foreground">
                          {file.progress}%
                        </span>
                      </div>
                      <div className="bg-muted h-2 overflow-hidden rounded-full">
                        <div
                          className="bg-primary h-full rounded-full transition-all duration-500 ease-out"
                          style={{ width: `${file.progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Full-Screen Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="h-[90vh] max-w-4xl overflow-hidden p-0">
          <div className="relative h-full w-full bg-black">
            {value.length > 0 && (
              <>
                {/* Modal Navigation */}
                {value.length > 1 && (
                  <>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute top-1/2 left-4 z-30 h-12 w-12 -translate-y-1/2 bg-black/60 text-white backdrop-blur-sm hover:bg-black/80"
                      onClick={prevModalImage}
                    >
                      <ChevronLeftIcon className="h-6 w-6" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute top-1/2 right-4 z-30 h-12 w-12 -translate-y-1/2 bg-black/60 text-white backdrop-blur-sm hover:bg-black/80"
                      onClick={nextModalImage}
                    >
                      <ChevronRightIcon className="h-6 w-6" />
                    </Button>
                  </>
                )}

                {/* Modal Image */}
                <img
                  src={value[modalImageIndex]}
                  alt={`Image ${modalImageIndex + 1}`}
                  className="h-full w-full object-contain"
                />

                {/* Modal Controls */}
                <div className="absolute top-4 left-4 flex space-x-2">
                  <Button
                    type="button"
                    size="icon"
                    variant="secondary"
                    className="h-10 w-10 bg-black/60 text-white backdrop-blur-sm hover:bg-black/80"
                    asChild
                  >
                    <a href={value[modalImageIndex]} download>
                      <DownloadIcon className="h-4 w-4" />
                    </a>
                  </Button>
                </div>

                {/* Modal Image Counter */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-4 py-2 text-white backdrop-blur-sm">
                  {modalImageIndex + 1} / {value.length}
                </div>

                {/* Modal Thumbnails */}
                {value.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 space-x-2 rounded-full bg-black/60 p-2 backdrop-blur-sm">
                    {value.map((image, index) => (
                      <button
                        key={index}
                        type="button"
                        className={cn(
                          "h-12 w-12 overflow-hidden rounded-lg border-2 transition-all",
                          index === modalImageIndex
                            ? "scale-110 border-white"
                            : "border-transparent hover:border-white/50",
                        )}
                        onClick={() => setModalImageIndex(index)}
                      >
                        <img
                          src={image}
                          alt={`Thumbnail ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
