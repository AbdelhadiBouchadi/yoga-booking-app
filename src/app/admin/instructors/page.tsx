import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function InstructorsPage() {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-bold">Your Instructors</h1>
      <Button asChild>
        <Link href="/admin/instructors/create">
          Create a new instructor
          <PlusIcon />
        </Link>
      </Button>
    </div>
  );
}
