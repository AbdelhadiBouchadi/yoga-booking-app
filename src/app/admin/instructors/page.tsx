import React from "react";
import { getInstructors } from "./actions";
import { UserCheck, Plus } from "lucide-react";
import { InstructorsDataTable } from "@/components/admin/instructors/InstructorsDataTable";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function InstructorsPage() {
  const data = await getInstructors();

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Instructors Management
          </h1>
          <p className="text-muted-foreground">
            Manage all instructors in your system
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/instructors/create">
            <Plus className="mr-2 h-4 w-4" />
            Add Instructor
          </Link>
        </Button>
      </div>

      <div className="space-y-4">
        <div className="text-muted-foreground flex items-center gap-2 text-sm">
          <UserCheck className="h-4 w-4" />
          <span>{data.length} total instructors</span>
        </div>

        <InstructorsDataTable data={data} />
      </div>
    </div>
  );
}
