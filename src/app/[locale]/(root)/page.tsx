import { getPublicInstructors } from "@/app/data/instructors/get-instructors";
import { getPublishedLessons } from "@/app/data/lessons/lesson-actions";
import AboutSection from "@/components/root/landing/AboutSection";
import ClassesSection from "@/components/root/landing/ClassesSection";
import ContactSection from "@/components/root/landing/ContactSection";
import HeroSection from "@/components/root/landing/HeroSection";
import InstructorsSection from "@/components/root/landing/InstructorsSection";
import QuoteSection from "@/components/root/landing/QuoteSection";

export default async function Home() {
  const [lessons, instructors] = await Promise.all([
    getPublishedLessons(),
    getPublicInstructors(),
  ]);

  const featuredLessons = lessons.slice(0, 3);
  const featuredInstructors = instructors.slice(0, 2); // Show top 3 instructors

  return (
    <>
      <HeroSection />
      <AboutSection />
      <ClassesSection lessons={featuredLessons} />
      <InstructorsSection instructors={featuredInstructors} />
      <QuoteSection />
      <ContactSection />
    </>
  );
}
