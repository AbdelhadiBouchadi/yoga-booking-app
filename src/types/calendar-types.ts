import { PublishedLessonType } from "@/app/data/lessons/lesson-actions";
import { CalendarEvent, EventColor } from "@/components";

// Extend the calendar event to include lesson-specific data
export interface LessonCalendarEvent extends CalendarEvent {
  lessonId: string;
  instructor?: {
    id: string;
    name: string;
    image?: string | null;
  };
  category?: {
    nameEn: string;
    nameFr: string;
  };
  level: string;
  maxCapacity: number;
  currentBookings: number;
  location: string;
  duration: number;
  status: string;
}

// Function to convert lesson to calendar event
export function lessonToCalendarEvent(
  lesson: PublishedLessonType,
  locale: "en" | "fr" = "en",
): LessonCalendarEvent {
  // Map lesson level to event color
  const getEventColor = (level: string): EventColor => {
    switch (level) {
      case "Beginner":
        return "emerald";
      case "Intermediate":
        return "amber";
      case "Advanced":
        return "rose";
      default:
        return "sky";
    }
  };

  const title = lesson.titleEn;
  const description = lesson.shortDescriptionEn;

  return {
    id: lesson.id,
    lessonId: lesson.id,
    title,
    description,
    start: new Date(lesson.startTime),
    end: new Date(lesson.endTime),
    allDay: false,
    color: getEventColor(lesson.level),
    location: lesson.location,
    instructor: lesson.instructor
      ? {
          id: lesson.instructor.id,
          name: lesson.instructor.name,
          image: lesson.instructor.image,
        }
      : undefined,
    category: lesson.Category
      ? {
          nameEn: lesson.Category.nameEn,
          nameFr: lesson.Category.nameFr,
        }
      : undefined,
    level: lesson.level,
    maxCapacity: lesson.maxCapacity,
    currentBookings: lesson._count.Booking,
    duration: lesson.duration,
    status: lesson.status,
  };
}
