"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ImageModalSliderProps {
  images: string[];
  initialIndex: number;
  onClose: () => void;
}

export default function ImageModalSlider({
  images,
  initialIndex,
  onClose,
}: ImageModalSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  }, [images.length]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length,
    );
  }, [images.length]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        goToNext();
      } else if (event.key === "ArrowLeft") {
        goToPrevious();
      } else if (event.key === "Escape") {
        onClose();
      }
    },
    [goToNext, goToPrevious, onClose],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden"; // Prevent scrolling when modal is open
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset"; // Re-enable scrolling
    };
  }, [handleKeyDown]);

  if (!images || images.length === 0) {
    return null; // Or render a fallback if no images
  }

  const currentImage = images[currentIndex];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={onClose} // Close modal when clicking outside image
    >
      <div
        className="relative flex h-full w-full max-w-6xl flex-col items-center justify-center p-4"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside content
      >
        {/* Close Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
          onClick={onClose}
          aria-label="Close modal"
        >
          <X className="h-6 w-6" />
        </Button>

        {/* Main Image */}
        <div className="relative flex h-[calc(100%-120px)] w-full items-center justify-center overflow-hidden rounded-lg bg-gray-900">
          <AnimatePresence initial={false} mode="wait">
            <motion.div
              key={currentIndex} // Key changes to trigger re-render and animation
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="relative h-full w-full"
            >
              <Image
                src={
                  currentImage ||
                  "/placeholder.svg?height=800&width=1200&query=full size yoga instructor"
                }
                alt={`Gallery image ${currentIndex + 1}`}
                fill
                style={{ objectFit: "contain" }}
                priority={true} // Prioritize loading for the active image
                className="rounded-lg"
              />
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-1/2 left-4 -translate-y-1/2 text-white hover:bg-white/20"
            onClick={goToPrevious}
            aria-label="Previous image"
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-1/2 right-4 -translate-y-1/2 text-white hover:bg-white/20"
            onClick={goToNext}
            aria-label="Next image"
          >
            <ChevronRight className="h-8 w-8" />
          </Button>
        </div>

        {/* Thumbnails Pagination */}
        <div className="mt-4 flex h-24 w-full items-center justify-center gap-2 overflow-x-auto p-2">
          {images.map((image, index) => (
            <motion.div
              key={index}
              className={cn(
                "relative h-20 w-20 flex-shrink-0 cursor-pointer overflow-hidden rounded-md border-2 transition-all duration-200",
                index === currentIndex
                  ? "border-primary scale-105 shadow-md"
                  : "border-transparent opacity-70 hover:opacity-100",
              )}
              onClick={() => setCurrentIndex(index)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Image
                src={
                  image ||
                  "/placeholder.svg?height=80&width=80&query=thumbnail yoga instructor"
                }
                alt={`Thumbnail ${index + 1}`}
                fill
                style={{ objectFit: "cover" }}
                sizes="(max-width: 768px) 80px, 80px" // Optimize thumbnail loading
                className="rounded-md"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
