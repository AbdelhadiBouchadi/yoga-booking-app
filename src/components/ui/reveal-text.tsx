"use client";

import type React from "react";
import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type AdvancedRevealTextProps = {
  text: string;
  id: string;
  className?: string;
  staggerAmount?: number;
  as?: React.ElementType;
  duration?: number;
  align?: "center" | "start" | "end";
  delay?: number;
};

export const AdvancedRevealText = ({
  text,
  id,
  align = "center",
  as: Component = "div",
  duration = 1.2,
  className,
  staggerAmount = 0.15,
  delay = 0,
}: AdvancedRevealTextProps) => {
  const componentRef = useRef<HTMLDivElement>(null);
  const words = text.split(" ");

  useEffect(() => {
    if (!componentRef.current) return;

    const ctx = gsap.context(() => {
      // Set initial state
      gsap.set(`.word-${id}`, {
        y: 200,
        rotationX: 90,
        opacity: 0,
        scale: 0.8,
        transformOrigin: "50% 50% -50px",
      });

      // Create the main timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: componentRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      });

      // Animate each word with a falling/raining effect
      words.forEach((_, index) => {
        tl.to(
          `.word-${id}-${index}`,
          {
            y: 0,
            rotationX: 0,
            opacity: 1,
            scale: 1,
            duration: duration,
            ease: "back.out(1.7)",
            transformOrigin: "50% 50% 0px",
          },
          delay + index * staggerAmount,
        )
          .to(
            `.word-${id}-${index}`,
            {
              textShadow:
                "0 0 20px rgba(var(--primary-rgb), 0.8), 0 0 40px rgba(var(--primary-rgb), 0.4)",
              duration: 0.3,
              ease: "power2.out",
            },
            delay + index * staggerAmount + duration * 0.7,
          )
          .to(
            `.word-${id}-${index}`,
            {
              textShadow: "0 0 10px rgba(var(--primary-rgb), 0.3)",
              duration: 0.5,
              ease: "power2.out",
            },
            delay + index * staggerAmount + duration,
          );
      });

      // Add floating animation after reveal
      tl.to(`.word-${id}`, {
        y: "random(-10, 10)",
        rotation: "random(-2, 2)",
        duration: 3,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        stagger: {
          amount: 1,
          from: "random",
        },
      });
    }, componentRef);

    return () => ctx.revert();
  }, [text, id, duration, staggerAmount, delay, words]);

  return (
    <Component
      className={cn(
        "reveal-text perspective-1000 text-balance",
        align === "center" && "text-center",
        align === "end" && "text-right",
        align === "start" && "text-left",
        className,
      )}
      ref={componentRef}
    >
      {words.map((word, index) => (
        <span
          key={`${word}-${index}-${id}`}
          className={`word-${id} word-${id}-${index} mx-2 inline-block will-change-transform`}
          style={{
            transformStyle: "preserve-3d",
          }}
        >
          {word}
          {index < words.length - 1 && "\u00A0"}
        </span>
      ))}
    </Component>
  );
};
