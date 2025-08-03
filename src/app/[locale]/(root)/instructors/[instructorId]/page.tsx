import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPublicInstructorById } from "@/app/data/instructors/get-instructors";
import InstructorDetailPage from "@/components/root/instructors/InstructorDetailPage";

interface InstructorPageProps {
  params: {
    locale: string;
    instructorId: string;
  };
}

export async function generateMetadata({
  params,
}: InstructorPageProps): Promise<Metadata> {
  const instructor = await getPublicInstructorById(params.instructorId);

  if (!instructor) {
    return {
      title: "Instructor Not Found",
    };
  }

  const bio = params.locale === "fr" ? instructor.bioFr : instructor.bioEn;

  return {
    title: `${instructor.name} - Yoga Instructor`,
    description:
      bio ||
      `Learn more about ${instructor.name}, our experienced yoga instructor.`,
    openGraph: {
      title: `${instructor.name} - Yoga Instructor`,
      description:
        bio ||
        `Learn more about ${instructor.name}, our experienced yoga instructor.`,
      images: instructor.image ? [instructor.image] : [],
    },
  };
}

export default async function InstructorPage({ params }: InstructorPageProps) {
  const instructor = await getPublicInstructorById(params.instructorId);

  if (!instructor) {
    notFound();
  }

  return (
    <InstructorDetailPage instructor={instructor} locale={params.locale} />
  );
}
