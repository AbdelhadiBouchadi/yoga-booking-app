import { getActiveDownloadDocument } from "@/app/data/admin/menu-download-actions";
import { getPublicInstructors } from "@/app/data/instructors/get-instructors";
import { getPublishedLessons } from "@/app/data/lessons/lesson-actions";
import AboutSection from "@/components/root/landing/AboutSection";
import ClassesSection from "@/components/root/landing/ClassesSection";
import ClassesSkeleton from "@/components/root/landing/ClassesSkeleton";
import ContactSection from "@/components/root/landing/ContactSection";
import DownloadMenuSection from "@/components/root/landing/DownloadMenuSection";
import DownloadMenuSkeleton from "@/components/root/landing/DownloadMenuSkeleton";
import FooterCopyright from "@/components/root/landing/FooterCopyright";
import HeroSection from "@/components/root/landing/HeroSection";
import InstructorsSection from "@/components/root/landing/InstructorsSection";
import InstructorsSkeleton from "@/components/root/landing/InstructorsSkeleton";
import ParallaxImageGallery from "@/components/root/landing/ParallaxImageGallery";
import PricingSection from "@/components/root/landing/PricingSection";
import QuoteSection from "@/components/root/landing/QuoteSection";
import SubQuoteSection from "@/components/root/landing/SubQuoteSection";
import { Suspense } from "react";

export default function Home() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <Suspense fallback={<ClassesSkeleton />}>
        <ClassesSectionWrapper />
      </Suspense>
      <PricingSection />
      <Suspense fallback={<DownloadMenuSkeleton />}>
        <DownloadMenuWrapper />
      </Suspense>
      <Suspense fallback={<InstructorsSkeleton />}>
        <InstructorsSectionWrapper />
      </Suspense>
      <ParallaxImageGallery />
      <QuoteSection />
      <ContactSection />
      <SubQuoteSection />
      <FooterCopyright />
    </>
  );
}

async function ClassesSectionWrapper() {
  const lessons = await getPublishedLessons();
  const featuredLessons = lessons.slice(0, 3);
  return <ClassesSection lessons={featuredLessons} />;
}

// Wrapper for Menu
async function DownloadMenuWrapper() {
  const document = await getActiveDownloadDocument();
  return <DownloadMenuSection document={document} />;
}

// Wrapper for Instructors
async function InstructorsSectionWrapper() {
  const instructors = await getPublicInstructors();
  const featuredInstructors = instructors.slice(0, 2);
  return <InstructorsSection instructors={featuredInstructors} />;
}
