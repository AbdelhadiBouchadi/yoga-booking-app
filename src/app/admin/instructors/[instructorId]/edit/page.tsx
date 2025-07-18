import React from "react";
import { getInstructorById } from "../../actions";
import { notFound } from "next/navigation";
import EditInstructorForm from "@/components/admin/instructors/EditInstructorForm";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

type Params = Promise<{ instructorId: string }>;

export default async function EditInstructorPage({
  params,
}: {
  params: Params;
}) {
  const { instructorId } = await params;

  const instructor = await getInstructorById(instructorId);

  if (!instructor) {
    notFound();
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-4 flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin/instructors">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="space-y-1">
          <h1 className="text-foreground text-2xl font-bold">
            Edit Instructor
          </h1>
          <p className="text-muted-foreground">Update instructor information</p>
        </div>
      </div>

      <EditInstructorForm instructor={instructor} />
    </div>
  );
}
