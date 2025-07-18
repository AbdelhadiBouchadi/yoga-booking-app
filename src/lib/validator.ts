import * as z from "zod";

export const lessonLevels = ["Beginner", "Intermediate", "Advanced"] as const;
export const lessonStatus = ["Draft", "Published", "Archived"] as const;

export const lessonSchema = z.object({
  titleEn: z.string().min(1, { message: "English title is required" }),
  titleFr: z.string().min(1, { message: "French title is required" }),
  descriptionEn: z
    .string()
    .min(1, { message: "English description is required" }),
  descriptionFr: z
    .string()
    .min(1, { message: "French description is required" }),
  shortDescriptionEn: z
    .string()
    .min(1, { message: "English short description is required" }),
  shortDescriptionFr: z
    .string()
    .min(1, { message: "French short description is required" }),
  categoryId: z.string().min(1, { message: "Category is required" }),
  instructorId: z.string().min(1, { message: "Instructor is required" }),
  location: z.string().min(1, { message: "Location is required" }),
  startTime: z.date({ message: "Start time is required" }),
  endTime: z.date({ message: "End time is required" }),
  level: z.enum(lessonLevels, { message: "Please select a level" }),
  status: z.enum(lessonStatus, { message: "Select a status" }),
  maxCapacity: z.number().min(1, { message: "Capacity must be at least 1" }),
  duration: z
    .number()
    .min(15, { message: "Duration must be at least 15 minutes" }),
  cancellationDeadlineHours: z
    .number()
    .min(1, { message: "Cancellation deadline must be at least 1 hour" }),
  imageUrl: z.string().optional(),
});

export const instructorSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  bioFr: z.string().min(1, "Bio in french is required"),
  bioEn: z.string().min(1, { message: "English bio in required" }),
  specialties: z.array(z.string()).min(1, "At least one specialty is required"),
  certifications: z.array(z.string()).optional(),
  experience: z.number().min(0, "Experience must be 0 or greater"),
  imageUrl: z.string().optional(),
});

export const categorySchema = z.object({
  nameEn: z.string().min(1, "English name is required"),
  nameFr: z.string().min(1, "French name is required"),
});

export type InstructorSchemaType = z.infer<typeof instructorSchema>;
export type CategorySchemaType = z.infer<typeof categorySchema>;
export type LessonSchemaType = z.infer<typeof lessonSchema>;
