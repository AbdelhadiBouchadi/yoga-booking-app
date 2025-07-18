"use client";

import React, { useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CalendarIcon,
  Clock,
  Globe2Icon,
  Loader2Icon,
  MapPin,
  PlusIcon,
  SaveIcon,
  Users,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import {
  lessonLevels,
  lessonSchema,
  LessonSchemaType,
  lessonStatus,
} from "@/lib/validator";
import { tryCatch } from "@/hooks/try-catch";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Uploader } from "@/components/file-uploader/Uploader";
import { Separator } from "@/components/ui/separator";
import { RichTextEditor } from "../rich-text-editor/Editor";
import { GetCategoryType } from "@/app/data/admin/category-actions";
import { GetInstructorType } from "@/app/admin/instructors/actions";
import CreateCategoryDialog from "../categories/CreateCategoryDialog";
import DateTimePicker from "./DateTimePicker";
import { AdminLessonSingularType } from "@/app/data/admin/get-admin-lesson";
import { editLesson } from "@/app/admin/sessions/[sessionId]/edit/actions";

interface EditLessonProps {
  data: AdminLessonSingularType;
  initialCategories: GetCategoryType[];
  initialInstructors: GetInstructorType[];
}

export default function EditLessonForm({
  data,
  initialCategories,
  initialInstructors,
}: EditLessonProps) {
  const [isPending, startTransition] = useTransition();
  const [categories, setCategories] =
    useState<GetCategoryType[]>(initialCategories);
  const [instructors] = useState<GetInstructorType[]>(initialInstructors);
  const router = useRouter();

  const handleCategoryAdded = (newCategory: {
    id: string;
    nameEn: string;
    nameFr: string;
    createdAt: Date;
    updatedAt: Date;
  }) => {
    setCategories((prev) => [...prev, newCategory]);
    form.setValue("categoryId", newCategory.id);
    toast.success("Category added");
  };

  const form = useForm<LessonSchemaType>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      titleEn: data?.titleEn,
      titleFr: data?.titleFr,
      shortDescriptionEn: data?.shortDescriptionEn,
      shortDescriptionFr: data?.shortDescriptionFr,
      descriptionEn: data?.descriptionEn,
      descriptionFr: data?.descriptionFr,
      categoryId: data?.categoryId ?? "",
      instructorId: data?.instructorId ?? "",
      location: data?.location,
      startTime: data?.startTime,
      endTime: data?.endTime,
      level: data?.level,
      maxCapacity: data?.maxCapacity,
      duration: data?.duration,
      status: data?.status,
      cancellationDeadlineHours: data?.cancellationDeadlineHours,
      imageUrl: data?.imageUrl,
    },
  });

  const watchedStartTime = form.watch("startTime");
  const watchedDuration = form.watch("duration");
  const watchedInstructorId = form.watch("instructorId");

  useEffect(() => {
    if (watchedStartTime && watchedDuration) {
      const endTime = new Date(watchedStartTime);
      endTime.setMinutes(endTime.getMinutes() + watchedDuration);
      form.setValue("endTime", endTime);
    }
  }, [watchedStartTime, watchedDuration, form]);

  const onSubmit = (values: LessonSchemaType) => {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(
        editLesson(values, data!.id),
      );

      if (error) {
        toast.error("An unexpected error occured");
        return;
      }

      if (result.status === "success") {
        toast.success("Session updated successfully");
        form.reset();
        router.push("/admin/sessions");
      } else if (result.status === "error") {
        toast.error(result.message);
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe2Icon className="h-5 w-5" />
              Basic Information
            </CardTitle>
            <CardDescription>
              Provide the lesson title and descriptions in both languages
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Titles */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="titleEn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <span className="bg-primary/20 text-primary rounded px-2 py-1 text-xs">
                        EN
                      </span>
                      Title (English)
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter English title..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="titleFr"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <span className="bg-primary/20 text-primary rounded px-2 py-1 text-xs">
                        FR
                      </span>
                      Title (French)
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Entrez le titre français..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            {/* Short Descriptions */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="shortDescriptionEn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <span className="bg-primary/20 text-primary rounded px-2 py-1 text-xs">
                        EN
                      </span>
                      Short Description (English)
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Brief description in English..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="shortDescriptionFr"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <span className="bg-primary/20 text-primary rounded px-2 py-1 text-xs">
                        FR
                      </span>
                      Short Description (French)
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Brève description en français..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            {/* Full Descriptions */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="descriptionEn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <span className="bg-primary/20 text-primary rounded px-2 py-1 text-xs">
                        EN
                      </span>
                      Full Description (English)
                    </FormLabel>
                    <FormControl>
                      <RichTextEditor field={field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="descriptionFr"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <span className="bg-primary/20 text-primary rounded px-2 py-1 text-xs">
                        FR
                      </span>
                      Full Description (French)
                    </FormLabel>
                    <FormControl>
                      <RichTextEditor field={field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Lesson Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Lesson Details
            </CardTitle>
            <CardDescription>
              Configure the lesson settings and requirements
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.nameEn} / {category.nameFr}
                          </SelectItem>
                        ))}
                        <div className="border-t pt-2">
                          <CreateCategoryDialog
                            onCategoryAdded={handleCategoryAdded}
                          >
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-full justify-start"
                              type="button"
                            >
                              <PlusIcon className="mr-2 h-4 w-4" />
                              Add New Category
                            </Button>
                          </CreateCategoryDialog>
                        </div>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="instructorId"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Instructor</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select an instructor" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {instructors.map((instructor) => (
                          <SelectItem key={instructor.id} value={instructor.id}>
                            {instructor.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <FormField
                control={form.control}
                name="level"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Level</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {lessonLevels.map((level, idx) => (
                          <SelectItem key={idx} value={level}>
                            {level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maxCapacity"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Max Capacity
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Duration (minutes)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Schedule & Location */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Schedule & Location
            </CardTitle>
            <CardDescription>
              Set the lesson timing and location details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter lesson location..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Time</FormLabel>
                    <FormControl>
                      <DateTimePicker
                        value={field.value}
                        onChange={field.onChange}
                        instructorId={watchedInstructorId}
                        placeholder="Select start date and time"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Time</FormLabel>
                    <FormControl>
                      <DateTimePicker
                        value={field.value}
                        onChange={field.onChange}
                        instructorId={watchedInstructorId}
                        placeholder="Select end date and time"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cancellationDeadlineHours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cancellation Deadline (hours)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Image Upload */}
        <Card>
          <CardHeader>
            <CardTitle>Lesson Image</CardTitle>
            <CardDescription>
              Upload an image for the lesson (optional)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Uploader
                      value={field.value}
                      onValueChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Set a status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {lessonStatus.map((status, idx) => (
                    <SelectItem key={idx} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? (
            <>
              <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
              Updating...
            </>
          ) : (
            <>
              <SaveIcon className="mr-2 h-4 w-4" />
              Update Lesson
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
