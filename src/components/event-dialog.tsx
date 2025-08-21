"use client";

import { useEffect } from "react";
import {
  RiCalendarLine,
  RiDeleteBinLine,
  RiMapPinLine,
  RiTimeLine,
} from "@remixicon/react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { CalendarEvent } from "./types";
import { PencilIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface EventDialogProps {
  event: CalendarEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: CalendarEvent) => void;
  onDelete: (eventId: string) => void;
}

export function EventDialog({
  event,
  isOpen,
  onClose,
  onSave,
  onDelete,
}: EventDialogProps) {
  // Debug log to check what event is being passed
  useEffect(() => {
    console.log("EventDialog received event:", event);
  }, [event]);

  if (!event) return null;

  const formatEventTime = (start: Date, end: Date, allDay: boolean) => {
    if (allDay) {
      return "All day";
    }
    return `${format(start, "h:mm a")} - ${format(end, "h:mm a")}`;
  };

  const formatEventDate = (start: Date, end: Date) => {
    const startDate = format(start, "EEEE, MMMM d, yyyy");
    const endDate = format(end, "EEEE, MMMM d, yyyy");

    if (startDate === endDate) {
      return startDate;
    }
    return `${startDate} - ${endDate}`;
  };

  const getColorBadge = (color: string) => {
    const colorMap = {
      sky: "bg-sky-100 text-sky-800 border-sky-200",
      amber: "bg-amber-100 text-amber-800 border-amber-200",
      violet: "bg-violet-100 text-violet-800 border-violet-200",
      rose: "bg-rose-100 text-rose-800 border-rose-200",
      emerald: "bg-emerald-100 text-emerald-800 border-emerald-200",
      orange: "bg-orange-100 text-orange-800 border-orange-200",
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.sky;
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div
              className={`h-3 w-3 rounded-full bg-${event.color || "sky"}-400`}
            />
            {event.title || "(No title)"}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Session details and information
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Date and Time */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <RiCalendarLine className="text-muted-foreground h-5 w-5" />
              <div>
                <p className="font-medium">
                  {formatEventDate(new Date(event.start), new Date(event.end))}
                </p>
                <p className="text-muted-foreground text-sm">
                  {formatEventTime(
                    new Date(event.start),
                    new Date(event.end),
                    event.allDay || false,
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Location */}
          {event.location && (
            <div className="flex items-center gap-3">
              <RiMapPinLine className="text-muted-foreground h-5 w-5" />
              <p className="text-sm">{event.location}</p>
            </div>
          )}

          {/* Description */}
          {event.description && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Description</h4>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {event.description}
              </p>
            </div>
          )}

          {/* Color Category */}
          {event.color && (
            <div className="flex items-center gap-3">
              <span className="text-muted-foreground text-sm">Category:</span>
              <Badge variant="outline" className={getColorBadge(event.color)}>
                {event.color.charAt(0).toUpperCase() + event.color.slice(1)}
              </Badge>
            </div>
          )}

          {/* Duration */}
          <div className="flex items-center gap-3">
            <RiTimeLine className="text-muted-foreground h-5 w-5" />
            <p className="text-muted-foreground text-sm">
              {event.allDay
                ? "All day event"
                : `${Math.round((new Date(event.end).getTime() - new Date(event.start).getTime()) / (1000 * 60))} minutes`}
            </p>
          </div>
        </div>

        <DialogFooter className="flex-row sm:justify-between">
          <div className="flex flex-1 justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Close
              <XIcon className="h-4 w-4" />
            </Button>
            {event?.id && (
              <Button asChild>
                <Link href={`/admin/sessions/${event.id}/edit`}>
                  Edit
                  <PencilIcon className="h-4 w-4" />
                </Link>
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
