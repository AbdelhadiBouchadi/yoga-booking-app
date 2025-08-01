import { getPublishedLessons } from "@/app/data/lessons/lesson-actions";
import AboutSection from "@/components/root/landing/AboutSection";
import ClassesSection from "@/components/root/landing/ClassesSection";
import ContactSection from "@/components/root/landing/ContactSection";
import HeroSection from "@/components/root/landing/HeroSection";
import InstructorsSection from "@/components/root/landing/InstructorsSection";

export default async function Home() {
  const lessons = await getPublishedLessons();
  const featuredLessons = lessons.slice(0, 3);

  return (
    <>
      <HeroSection />
      <AboutSection />
      <ClassesSection lessons={featuredLessons} />
      <InstructorsSection />
      <ContactSection />
    </>
  );
}
