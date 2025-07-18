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
      <Tabs defaultValue="basic-info" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="basic-info">Basic Info</TabsTrigger>
          <TabsTrigger value="lesson-bookings">Lesson Bookings</TabsTrigger>
        </TabsList>
        <TabsContent value="basic-info">
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
        </TabsContent>
        <TabsContent value="lesson-bookings">
          <Card>
            <CardHeader>
              <CardTitle>Lesson Bookings</CardTitle>
              <CardDescription>
                Here you can edit your lesson structure
              </CardDescription>
            </CardHeader>
            <CardContent>{/* <CourseStructure data={data} /> */}</CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
