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

  const data = await getAdminLesson(sessionId);

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">
        Edit Course :{" "}
        <span className="text-primary underline underline-offset-2">
          {data!.titleEn}
        </span>
      </h1>
      <Tabs defaultValue="basic-info" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="basic-info">Basic Info</TabsTrigger>
          <TabsTrigger value="course-structure">Course Structure</TabsTrigger>
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
              <EditLessonForm data={data} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="course-structure">
          <Card>
            <CardHeader>
              <CardTitle>Course Structure</CardTitle>
              <CardDescription>
                Here you can edit your course structure
              </CardDescription>
            </CardHeader>
            <CardContent>{/* <CourseStructure data={data} /> */}</CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
