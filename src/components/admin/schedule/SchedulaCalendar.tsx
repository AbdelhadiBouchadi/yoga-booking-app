"use client";

import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { LessonEventDialog } from "@/components/admin/schedule/LessonEventDialog";
import { PublishedLessonType } from "@/app/data/lessons/lesson-actions";
import { toast } from "sonner";
import { lessonToCalendarEvent } from "@/types/calendar-types";
import { EventCalendar } from "@/components/event-calendar";

interface ScheduleCalendarProps {
  lessons: PublishedLessonType[];
}

export default function ScheduleCalendar({ lessons }: ScheduleCalendarProps) {
  // Convert lessons to calendar events
  const events = useMemo(() => {
    return lessons.map((lesson) => lessonToCalendarEvent(lesson, "en"));
  }, [lessons]);

  if (lessons.length === 0) {
    return (
      <Card className="border-border/40 from-card/60 to-card/20 border bg-gradient-to-br backdrop-blur-sm">
        <CardContent className="py-12 text-center">
          <Calendar className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
          <h3 className="mb-2 text-lg font-semibold">No Sessions Scheduled</h3>
          <p className="text-muted-foreground">
            Create your session to see it on the calendar.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <EventCalendar
      events={events}
      onEventUpdate={() => {}} // Read-only for now
      onEventDelete={() => {}} // Read-only for now
      initialView="month"
      className=""
    />
  );
}
