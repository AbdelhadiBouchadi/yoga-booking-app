"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  checkInstructorAvailability,
  TimeSlot,
} from "@/app/admin/sessions/actions";
interface DateTimePickerProps {
  value?: Date;
  onChange?: (date: Date) => void;
  instructorId?: string;
  disabled?: boolean;
  placeholder?: string;
  excludeLessonId?: string;
}

export default function DateTimePicker({
  value,
  onChange,
  instructorId,
  disabled = false,
  placeholder = "Select date and time",
  excludeLessonId,
}: DateTimePickerProps) {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState<Date>(value || today);
  const [selectedTime, setSelectedTime] = useState<string | null>(
    value ? format(value, "HH:mm") : null,
  );
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const loadingRef = useRef(false);

  const loadAvailability = useCallback(async () => {
    if (!instructorId || loadingRef.current) return;

    loadingRef.current = true;
    setIsLoadingSlots(true);
    try {
      const slots = await checkInstructorAvailability(
        instructorId,
        selectedDate,
        excludeLessonId,
      );
      setTimeSlots(slots);
    } catch (error) {
      console.error("Error loading availability:", error);
      // Fallback to generating empty slots
      setTimeSlots(generateDefaultTimeSlots());
    } finally {
      setIsLoadingSlots(false);
      loadingRef.current = false;
    }
  }, [instructorId, selectedDate, excludeLessonId]);

  // Load availability when date or instructor changes
  useEffect(() => {
    if (instructorId && selectedDate && isOpen) {
      loadAvailability();
    }
  }, [instructorId, selectedDate, isOpen, loadAvailability]);

  const generateDefaultTimeSlots = (): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    for (let hour = 6; hour <= 22; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}`;
        slots.push({
          time: timeString,
          available: true,
        });
      }
    }
    return slots;
  };

  const handleDateSelect = (newDate: Date | undefined) => {
    if (newDate) {
      setSelectedDate(newDate);
      setSelectedTime(null); // Reset time when date changes
    }
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);

    // Create the complete datetime and call onChange
    const [hours, minutes] = time.split(":").map(Number);
    const datetime = new Date(selectedDate);
    datetime.setHours(hours, minutes, 0, 0);

    onChange?.(datetime);
    setIsOpen(false); // Close popover after selection
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground",
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, "PPP 'at' p") : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex max-sm:flex-col">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            className="p-2 sm:pe-5"
            disabled={[
              { before: today }, // Dates before today
            ]}
            initialFocus
          />
          <div className="relative w-full max-sm:h-48 sm:w-40">
            <div className="absolute inset-0 py-4 max-sm:border-t">
              <ScrollArea className="h-full sm:border-s">
                <div className="space-y-3">
                  <div className="flex h-5 shrink-0 items-center px-5">
                    <p className="text-sm font-medium">
                      {format(selectedDate, "EEEE, d")}
                    </p>
                  </div>

                  {isLoadingSlots ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  ) : !instructorId ? (
                    <div className="px-5 py-4">
                      <p className="text-muted-foreground text-center text-sm">
                        Select an instructor first
                      </p>
                    </div>
                  ) : (
                    <div className="grid gap-1.5 px-5 max-sm:grid-cols-2">
                      {timeSlots.map(({ time: timeSlot, available }) => (
                        <Button
                          key={timeSlot}
                          variant={
                            selectedTime === timeSlot ? "default" : "outline"
                          }
                          size="sm"
                          className="w-full"
                          onClick={() => handleTimeSelect(timeSlot)}
                          disabled={!available}
                        >
                          {timeSlot}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
