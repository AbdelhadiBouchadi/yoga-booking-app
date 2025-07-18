"use client";

import React, { useTransition } from "react";
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
  Loader2Icon,
  SaveIcon,
  User,
  Mail,
  Phone,
  Award,
  FileText,
  ArrowLeft,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { instructorSchema, InstructorSchemaType } from "@/lib/validator";
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
import { PhoneInput } from "@/components/ui/phone-input";
import Link from "next/link";
import {
  GetInstructorByIdType,
  updateInstructor,
} from "@/app/admin/instructors/actions";
import { SpecialtyInput } from "./SpecialtyInput";
import { MultiImageUploader } from "@/components/file-uploader/MultipleImageUploader";

interface EditInstructorFormProps {
  instructor: NonNullable<GetInstructorByIdType>;
}

export default function EditInstructorForm({
  instructor,
}: EditInstructorFormProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<InstructorSchemaType>({
    resolver: zodResolver(instructorSchema),
    defaultValues: {
      name: instructor.name,
      email: instructor.email,
      phone: instructor.phone || "",
      bioEn: instructor.bioEn || "",
      bioFr: instructor.bioFr || "",
      specialties: instructor.specialties || [],
      certifications: instructor.certifications || [],
      experience: instructor.experience || 0,
      image: instructor.image || "",
      images: instructor.images || [],
    },
  });

  const onSubmit = (values: InstructorSchemaType) => {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(
        updateInstructor(instructor.id, values),
      );

      if (error) {
        toast.error("An unexpected error occurred");
        return;
      }

      if (result.status === "success") {
        toast.success("Instructor updated successfully");
        router.push("/admin/instructors");
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
              <User className="h-5 w-5" />
              Basic Information
            </CardTitle>
            <CardDescription>
              Update the instructor's personal details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter instructor's full name..."
                        className="h-11"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email Address
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="instructor@example.com"
                        className="h-11"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Phone Number
                    </FormLabel>
                    <FormControl>
                      <PhoneInput
                        placeholder="Enter phone number"
                        className="h-11"
                        defaultCountry="MA"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="experience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Award className="h-4 w-4" />
                      Years of Experience
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        placeholder="5"
                        className="h-11"
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

        {/* Professional Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Professional Information
            </CardTitle>
            <CardDescription>
              Update the instructor's background and expertise
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="specialties"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Specialties</FormLabel>
                  <FormControl>
                    <SpecialtyInput className="h-11" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bioFr"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Biography (French)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us about the instructor's background in french, certifications, and teaching philosophy..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bioEn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Biography (English)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us about the instructor's background, certifications, and teaching philosophy..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Profile Image */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Image</CardTitle>
            <CardDescription>
              Update the instructor's professional photo (optional)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="image"
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

        {/* Gallery Images */}
        <Card>
          <CardHeader>
            <CardTitle>Instructor Gallery</CardTitle>
            <CardDescription>
              Update photos of the instructor (optional)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <MultiImageUploader
                      value={field.value}
                      onValueChange={field.onChange}
                      maxFiles={5}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/instructors")}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isPending} className="flex-1">
            {isPending ? (
              <>
                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <SaveIcon className="mr-2 h-4 w-4" />
                Update Instructor
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
