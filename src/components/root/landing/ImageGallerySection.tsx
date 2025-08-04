"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ImageGallerySection() {
  const t = useTranslations("imageGallery");
  const sectionRef = useRef<HTMLElement>(null);
  const image1Ref = useRef<HTMLDivElement>(null);
  const image2Ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

  useEffect(() => {
    if (!isInView) return;

    const ctx = gsap.context(() => {
      // Animation for the first image (abstract art)
      if (image1Ref.current) {
        gsap.to(image1Ref.current, {
          y: "random(-20, 20)",
          x: "random(-15, 15)",
          rotation: "random(-5, 5)",
          scale: "random(0.98, 1.02)",
          duration: "random(12, 20)",
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          delay: "random(0, 2)",
        });
      }

      // Animation for the second image (yoga friends)
      if (image2Ref.current) {
        gsap.to(image2Ref.current, {
          y: "random(-15, 15)",
          x: "random(-10, 10)",
          rotation: "random(-3, 3)",
          scale: "random(0.99, 1.01)",
          duration: "random(10, 18)",
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          delay: "random(0, 1.5)",
        });
      }
    }, sectionRef); // Context scope

    return () => ctx.revert(); // Clean up GSAP animations
  }, [isInView]);

  return (
    <section
      className="from-secondary/10 to-background relative w-full overflow-hidden bg-gradient-to-b py-20 md:py-32"
      ref={sectionRef}
    >
      {/* Background Elements */}
      <div
        className="absolute top-1/4 left-0 h-96 w-96 rounded-full opacity-5 blur-3xl"
        style={{
          background: `radial-gradient(circle at center, hsl(var(--primary)), transparent 70%)`,
        }}
      />
      <div
        className="absolute right-0 bottom-1/4 h-80 w-80 rounded-full opacity-5 blur-3xl"
        style={{
          background: `radial-gradient(circle at center, hsl(var(--accent)), transparent 70%)`,
        }}
      />

      <div className="relative z-10 container mx-auto max-h-screen px-4 md:px-6">
        {/* Image Gallery Grid */}
        <div className="grid gap-8 md:grid-cols-2">
          {/* Image 1: Abstract Yoga Art */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative overflow-hidden rounded-3xl shadow-2xl"
          >
            <div ref={image1Ref} className="h-full w-full">
              <Image
                src="/image1.jpg"
                alt={"Abstract Art"}
                width={400}
                height={400}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </motion.div>

          {/* Image 2: Yoga Friends */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative overflow-hidden rounded-3xl shadow-2xl"
          >
            <div ref={image2Ref} className="h-full w-full">
              <Image
                src="/image2.jpg"
                alt={"Founders Picture"}
                width={400}
                height={400}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
