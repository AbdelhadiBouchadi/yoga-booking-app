"use client";

import { useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  BookOpen,
  Edit,
  Eye,
} from "lucide-react";
import { LessonCalendarEvent } from "@/types/calendar-types";

interface LessonEventDialogProps {
  event: LessonCalendarEvent | null;
  isOpen: boolean;
  onClose: () => void;
}

export function LessonEventDialog({
  event,
  isOpen,
  onClose,
}: LessonEventDialogProps) {
  const router = useRouter();

  if (!event) return null;

  const availableSpots = event.maxCapacity - event.currentBookings;
  const isAlmostFull = availableSpots <= 3 && availableSpots > 0;
  const isFull = availableSpots <= 0;

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "Advanced":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const handleEditLesson = () => {
    router.push(`/admin/sessions/${event.lessonId}/edit`);
    onClose();
  };

  const handleViewLesson = () => {
    router.push(`/sessions/${event.lessonId}`);
    onClose();
  };

  const categoryName = event.category?.nameEn;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">{event.title}</DialogTitle>
          <DialogDescription className="sr-only">
            Lesson details and management options
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Category and Level */}
          <div className="flex items-center gap-2">
            {categoryName && (
              <Badge variant="secondary" className="font-medium">
                {categoryName}
              </Badge>
            )}
            <Badge className={getLevelColor(event.level)}>{event.level}</Badge>
            <Badge variant="outline" className="capitalize">
              {event.status.toLowerCase()}
            </Badge>
            {isFull && <Badge variant="destructive">Full</Badge>}
            {isAlmostFull && !isFull && (
              <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                {availableSpots} left
              </Badge>
            )}
          </div>

          {/* Description */}
          {event.description && (
            <p className="text-muted-foreground text-sm">{event.description}</p>
          )}

          {/* Instructor */}
          {event.instructor && (
            <div className="bg-secondary/20 flex items-center gap-3 rounded-lg p-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={event.instructor.image || undefined} />
                <AvatarFallback className="bg-primary/10">
                  {event.instructor.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-semibold">{event.instructor.name}</p>
                <p className="text-muted-foreground text-sm">Instructor</p>
              </div>
            </div>
          )}

          {/* Event Details */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="text-primary h-4 w-4" />
              <div>
                <p className="text-muted-foreground">Date</p>
                <p className="font-medium">
                  {format(event.start, "MMM d, yyyy")}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="text-primary h-4 w-4" />
              <div>
                <p className="text-muted-foreground">Time</p>
                <p className="font-medium">
                  {format(event.start, "h:mm a")} -{" "}
                  {format(event.end, "h:mm a")}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <MapPin className="text-primary h-4 w-4" />
              <div>
                <p className="text-muted-foreground">Location</p>
                <p className="truncate font-medium">{event.location}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Users className="text-primary h-4 w-4" />
              <div>
                <p className="text-muted-foreground">Capacity</p>
                <p className="font-medium">
                  {event.currentBookings}/{event.maxCapacity}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <BookOpen className="text-primary h-4 w-4" />
              <div>
                <p className="text-muted-foreground">Duration</p>
                <p className="font-medium">{event.duration} min</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button onClick={handleEditLesson} className="flex-1">
              <Edit className="mr-2 h-4 w-4" />
              Edit Lesson
            </Button>
            <Button variant="outline" onClick={handleViewLesson}>
              <Eye className="mr-2 h-4 w-4" />
              View
            </Button>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
