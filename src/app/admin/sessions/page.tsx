import { getAdminLessons } from "@/app/data/admin/get-admin-lessons";
import { AdminLessonCard } from "@/components/admin/lessons/AdminLessonCard";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

export default async function SessionsPage() {
  const data = await getAdminLessons();

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Your Sessions</h1>
        <Button asChild>
          <Link href="/admin/sessions/create">
            Create a new session
            <PlusIcon />
          </Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-7 md:grid-cols-2">
        {data.map((course, idx) => {
          return <AdminLessonCard key={idx} data={course} />;
        })}
      </div>
    </>
  );
}
