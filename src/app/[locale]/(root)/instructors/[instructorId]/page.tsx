import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPublicInstructorById } from "@/app/data/instructors/get-instructors";
import InstructorDetailPage from "@/components/root/instructors/InstructorDetailPage";

type Params = Promise<{ instructorId: string }>;

export default async function InstructorPage({ params }: { params: Params }) {
  const { instructorId } = await params;

  const instructor = await getPublicInstructorById(instructorId);

  if (!instructor) {
    notFound();
  }

  return <InstructorDetailPage instructor={instructor} />;
}
