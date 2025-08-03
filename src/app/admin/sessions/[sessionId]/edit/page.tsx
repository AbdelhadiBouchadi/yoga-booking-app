import { getInstructors } from "@/app/admin/instructors/actions";
import { getCategories } from "@/app/data/admin/category-actions";
import { getAdminLesson } from "@/app/data/admin/get-admin-lesson";
import EditLessonForm from "@/components/admin/lessons/EditLessonForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";

type Params = Promise<{ sessionId: string }>;

export default async function EditLessonPage({ params }: { params: Params }) {
  const { sessionId } = await params;

  const [data, categories, instructors] = await Promise.all([
    getAdminLesson(sessionId),
    getCategories(),
    getInstructors(),
  ]);

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">
        Edit Lesson :{" "}
        <span className="text-primary underline underline-offset-2">
          {data!.titleEn}
        </span>
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>Basic Info</CardTitle>
          <CardDescription>
            Edit basic information about the lesson
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EditLessonForm
            data={data}
            initialCategories={categories}
            initialInstructors={instructors}
          />
        </CardContent>
      </Card>
    </div>
  );
}
