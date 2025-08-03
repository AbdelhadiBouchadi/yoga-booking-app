"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect } from "react";
import { Quote } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AdvancedRevealText } from "@/components/ui/reveal-text";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function QuoteSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

  useEffect(() => {
    if (!backgroundRef.current || !particlesRef.current) return;

    const ctx = gsap.context(() => {
      // Animated background gradient
      if (backgroundRef.current) {
        gsap.to(backgroundRef.current, {
          backgroundPosition: "200% 200%",
          duration: 20,
          ease: "none",
          repeat: -1,
          yoyo: true,
        });
      }

      // Create floating particles
      if (particlesRef.current) {
        const particlesContainer = particlesRef.current;
        const particles = Array.from({ length: 50 }, (_, i) => {
          const particle = document.createElement("div");
          particle.className = "particle absolute rounded-full opacity-20";
          particle.style.width = `${Math.random() * 4 + 2}px`;
          particle.style.height = particle.style.width;
          particle.style.left = `${Math.random() * 100}%`;
          particle.style.top = `${Math.random() * 100}%`;
          particle.style.background = `hsl(var(--primary))`;
          particlesContainer.appendChild(particle);
          return particle;
        });

        // Animate particles
        particles.forEach((particle, i) => {
          gsap.to(particle, {
            y: "random(-100, 100)",
            x: "random(-50, 50)",
            rotation: 360,
            duration: "random(10, 20)",
            ease: "none",
            repeat: -1,
            yoyo: true,
            delay: i * 0.1,
          });

          gsap.to(particle, {
            opacity: "random(0.1, 0.4)",
            scale: "random(0.5, 1.5)",
            duration: "random(3, 6)",
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
            delay: i * 0.05,
          });
        });
      }

      // Scroll-triggered background effects
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          if (backgroundRef.current) {
            gsap.to(backgroundRef.current, {
              scale: 1 + progress * 0.1,
              rotation: progress * 5,
              duration: 0.3,
              ease: "none",
            });
          }
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      className="relative flex min-h-screen w-full items-center overflow-hidden py-20 md:py-32"
      ref={sectionRef}
    >
      {/* Animated Background */}
      <div
        ref={backgroundRef}
        className="absolute inset-0 opacity-30"
        style={{
          background: `
            radial-gradient(circle at 20% 50%, hsl(var(--primary)) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, hsl(var(--secondary)) 0%, transparent 50%),
            radial-gradient(circle at 40% 80%, hsl(var(--accent)) 0%, transparent 50%),
            linear-gradient(45deg, hsl(var(--primary)/0.1) 0%, hsl(var(--secondary)/0.1) 50%, hsl(var(--accent)/0.1) 100%)
          `,
          backgroundSize: "200% 200%",
          filter: "blur(40px)",
        }}
      />

      {/* Floating Particles */}
      <div
        ref={particlesRef}
        className="pointer-events-none absolute inset-0"
      />

      {/* Mesh Gradient Overlay */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background: `
            conic-gradient(from 0deg at 50% 50%, 
              hsl(var(--primary)) 0deg, 
              hsl(var(--secondary)) 120deg, 
              hsl(var(--accent)) 240deg, 
              hsl(var(--primary)) 360deg
            )
          `,
          filter: "blur(60px) saturate(1.5)",
          animation: "spin 30s linear infinite",
        }}
      />

      {/* Noise Texture */}
      <div
        className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-6xl text-center">
          {/* Quote Icon with Advanced Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0, rotateY: -180 }}
            animate={
              isInView
                ? { opacity: 1, scale: 1, rotateY: 0 }
                : { opacity: 0, scale: 0, rotateY: -180 }
            }
            transition={{ duration: 1, ease: [0.68, -0.55, 0.265, 1.55] }}
            className="mb-12 flex justify-center"
          >
            <div className="relative">
              <div className="bg-primary/20 border-primary/30 flex h-20 w-20 items-center justify-center rounded-full border-2 shadow-2xl backdrop-blur-sm">
                <Quote className="text-primary h-10 w-10" />
              </div>
              {/* Pulsing rings */}
              <div className="border-primary/20 absolute inset-0 animate-ping rounded-full border-2" />
              <div className="border-primary/10 absolute inset-0 animate-pulse rounded-full border" />
            </div>
          </motion.div>

          {/* Advanced Reveal Text */}
          <AdvancedRevealText
            text="COME AS YOU ARE"
            id="quote-section"
            className="font-quote text-6xl leading-none font-black tracking-tight md:text-8xl lg:text-9xl xl:text-[12rem]"
            staggerAmount={0.2}
            duration={1.5}
            delay={0.5}
          />

          {/* Attribution with Typewriter Effect */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 1, delay: 2.5 }}
            className="mt-12"
          >
            <p className="text-muted-foreground font-sans text-xl tracking-wider italic md:text-2xl">
              — Nirvana
            </p>
          </motion.div>

          {/* Enhanced Decorative Elements */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={
              isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }
            }
            transition={{ duration: 1.2, delay: 3 }}
            className="mt-16 flex justify-center"
          >
            <div className="flex items-center gap-4">
              <motion.div
                className="bg-primary h-2 w-16 rounded-full"
                animate={{
                  scaleX: [1, 1.2, 1],
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              />
              <motion.div
                className="bg-primary/70 h-2 w-8 rounded-full"
                animate={{
                  scaleX: [1, 1.3, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                  delay: 0.3,
                }}
              />
              <motion.div
                className="bg-primary/40 h-2 w-4 rounded-full"
                animate={{
                  scaleX: [1, 1.4, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                  delay: 0.6,
                }}
              />
            </div>
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </section>
  );
}
