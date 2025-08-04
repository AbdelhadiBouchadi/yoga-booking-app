"use client";
import { motion, useInView } from "framer-motion";
import { useRef, useEffect } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function GallerySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
  }, []);

  const images = [
    {
      id: 1,
      src: "/gallery/image1.jpg",
      alt: "Yoga image 1",
      size: "large",
      position: {
        desktop: { top: "5%", left: "5%" },
        mobile: { top: "5%", left: "5%" },
      },
      rotate: -8,
      zIndex: 25,
      hasBlob: true,
      blobColor: "from-secondary/30 to-secondary/20",
      shape: "rounded-3xl",
    },
    {
      id: 2,
      src: "/gallery/image2.jpg",
      alt: "Yoga image 2",
      size: "medium",
      position: {
        desktop: { top: "10%", right: "5%" },
        mobile: { top: "30%", right: "5%" },
      },
      rotate: 12,
      zIndex: 30,
      hasBlob: false,
      shape: "rounded-[2rem]",
    },
    {
      id: 3,
      src: "/gallery/image3.jpg",
      alt: "Yoga image 3",
      size: "small",
      position: {
        desktop: { top: "55%", left: "8%" },
        mobile: { top: "55%", left: "10%" },
      },
      rotate: -15,
      zIndex: 20,
      hasBlob: true,
      blobColor: "from-secondary/30 to-secondary/20",
      shape: "rounded-2xl",
    },
    {
      id: 4,
      src: "/gallery/image4.jpg",
      alt: "Yoga image 4",
      size: "large",
      position: {
        desktop: { bottom: "5%", right: "8%" },
        mobile: { bottom: "25%", right: "5%" },
      },
      rotate: 6,
      zIndex: 35,
      hasBlob: true,
      blobColor: "from-secondary/30 to-secondary/20",
      shape: "rounded-[3rem]",
    },
    {
      id: 5,
      src: "/gallery/image5.jpg",
      alt: "Yoga image 5",
      size: "medium",
      position: {
        desktop: { bottom: "8%", left: "35%" },
        mobile: { bottom: "5%", left: "5%" },
      },
      rotate: -5,
      zIndex: 15,
      hasBlob: false,
      shape: "rounded-[2.5rem]",
    },
    {
      id: 6,
      src: "/gallery/image6.jpg",
      alt: "Yoga image 6",
      size: "small",
      position: {
        desktop: { top: "35%", right: "35%" },
        mobile: { top: "75%", right: "10%" },
      },
      rotate: 18,
      zIndex: 28,
      hasBlob: true,
      blobColor: "from-secondary/30 to-secondary/20",
      shape: "rounded-xl",
    },
  ];

  const getSizeClasses = (size: string) => {
    switch (size) {
      case "large":
        return "w-64 h-80 md:w-80 md:h-96 lg:w-96 lg:h-[28rem]";
      case "medium":
        return "w-48 h-64 md:w-64 md:h-72 lg:w-72 lg:h-80";
      case "small":
        return "w-40 h-48 md:w-48 md:h-56 lg:w-56 lg:h-64";
      default:
        return "w-48 h-64";
    }
  };

  useEffect(() => {
    if (!isInView || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Floating animations
      imageRefs.current.forEach((imageWrapper, index) => {
        if (imageWrapper) {
          // Continuous subtle floating
          gsap.to(imageWrapper, {
            y: `random(-20, 20)`,
            x: `random(-15, 15)`,
            rotation: `random(-5, 5)`,
            scale: `random(0.98, 1.02)`,
            duration: `random(8, 15)`,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
            delay: `random(0, 2)`,
          });

          // Scroll-triggered parallax
          const parallaxSettings = {
            yPercent: index % 2 === 0 ? `random(-30, -10)` : `random(10, 30)`,
            xPercent: `random(-10, 10)`,
            rotation: `random(-15, 15)`,
            scale: `random(1.02, 1.08)`,
          };
          gsap.to(imageWrapper, {
            ...parallaxSettings,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.5,
            },
          });

          // Cross-plane movement effect - images move across X and Y axes
          const crossPlaneMovement = {
            // Alternating movement patterns for variety
            x:
              index % 3 === 0
                ? "random(-150, -50)"
                : index % 3 === 1
                  ? "random(50, 150)"
                  : "random(-100, 100)",
            y: index % 2 === 0 ? "random(-100, -30)" : "random(30, 100)",
            rotation: `random(-20, 20)`,
          };
          gsap.to(imageWrapper, {
            x: crossPlaneMovement.x,
            y: crossPlaneMovement.y,
            rotation: crossPlaneMovement.rotation,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 2, // Slightly slower scrub for smoother cross-plane movement
              invalidateOnRefresh: true, // Ensures proper recalculation on resize
            },
          });
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [isInView]);

  return (
    <section
      className="relative min-h-screen w-full overflow-hidden py-20 md:py-32"
      ref={sectionRef}
    >
      {/* Noise texture overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.015] mix-blend-multiply"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
      {/* Images container */}
      <div className="relative z-10 mx-auto max-w-7xl px-4">
        <div className="relative h-[150vh] md:h-[180vh]">
          {images.map((img, index) => (
            <motion.div
              key={img.id}
              initial={{
                opacity: 0,
                scale: 0.7,
                y: 100,
                rotateX: 15,
              }}
              animate={
                isInView
                  ? {
                      opacity: 1,
                      scale: 1,
                      y: 0,
                      rotateX: 0,
                    }
                  : {}
              }
              transition={{
                duration: 1.2,
                delay: index * 0.2,
                ease: [0.25, 0.46, 0.45, 0.94],
                type: "spring",
                damping: 20,
                stiffness: 100,
              }}
              className={`absolute ${getSizeClasses(img.size)}`}
              style={{
                ...img.position.desktop,
                transform: `rotate(${img.rotate}deg)`,
                zIndex: img.zIndex,
              }}
            >
              {/* Blob background for select images */}
              {img.hasBlob && (
                <div
                  className={`absolute -inset-8 bg-gradient-to-br ${img.blobColor} rounded-full opacity-60 blur-2xl`}
                  style={{ transform: "scale(1.3)" }}
                />
              )}
              <div
                ref={(el) => {
                  imageRefs.current[index] = el;
                }}
                className={`group relative h-full w-full overflow-hidden ${img.shape} hover:shadow-3xl shadow-2xl shadow-black/10 transition-all duration-700 hover:shadow-black/20`}
                style={{
                  backdropFilter: "blur(0.5px)",
                }}
              >
                {/* Image */}
                <Image
                  src={img.src || "/placeholder.svg"}
                  alt={img.alt}
                  fill
                  className="object-cover transition-all duration-1000 group-hover:scale-110"
                  sizes="(max-width: 768px) 280px, (max-width: 1024px) 320px, 400px"
                />
                {/* Gradient overlays for depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-white/10" />
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/20" />
                {/* Subtle inner glow */}
                <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/5 to-white/10 opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
                {/* Border highlight */}
                <div className="absolute inset-0 rounded-[inherit] ring-1 ring-white/20 ring-inset" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      {/* Additional atmospheric elements */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/10" />
      {/* Floating particles effect */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-1 w-1 rounded-full bg-white/30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 15,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 10,
            }}
          />
        ))}
      </div>
    </section>
  );
}
