import AboutSection from "@/components/root/landing/AboutSection";
import ClassesSection from "@/components/root/landing/ClassesSection";
import ContactSection from "@/components/root/landing/ContactSection";
import HeroSection from "@/components/root/landing/HeroSection";
import InstructorsSection from "@/components/root/landing/InstructorsSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <ClassesSection />
      <InstructorsSection />
      <ContactSection />
    </>
  );
}
