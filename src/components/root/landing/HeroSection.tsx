"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Sparkles } from "lucide-react";
import { AnimatedShinyText } from "./AnimatedShinyText";
import { useTranslations } from "next-intl";
import Image from "next/image";

export default function HeroSection() {
  const t = useTranslations("hero");
  const heroRef = useRef(null);
  const isInView = useInView(heroRef, { once: true, amount: 0.3 });

  return (
    <section className="from-background via-secondary/15 to-foreground/45 relative min-h-screen w-full overflow-hidden bg-gradient-to-br">
      {/* Blurry Background Dots (New Implementation) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={
          isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }
        }
        transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
        className="bg-primary/45 absolute top-[-6rem] right-[11rem] -z-10 h-[31.25rem] w-[31.25rem] rounded-full blur-[10rem] sm:w-[68.75rem] dark:bg-[#524B4A]"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={
          isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }
        }
        transition={{ duration: 1, delay: 0.7, ease: "easeOut" }}
        className="bg-primary/60 absolute top-[-1rem] left-[-35rem] -z-10 h-[31.25rem] w-[50rem] rounded-full blur-[10rem] sm:w-[68.75rem] md:left-[-33rem] lg:left-[-28rem] xl:left-[-15rem] 2xl:left-[-5rem] dark:bg-[#4A4B52]"
      />

      {/* Main Hero Content */}
      <div
        className="relative z-10 container mx-auto px-4 md:px-6"
        ref={heroRef}
      >
        <div className="flex min-h-screen flex-col items-center justify-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mx-auto max-w-4xl"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={
                isInView ? { scale: 1, opacity: 1 } : { scale: 0.9, opacity: 0 }
              }
              transition={{ duration: 0.6, delay: 0.2 }}
              className="border-primary/20 bg-primary/10 dark:bg-secondary/10 text-muted-foreground mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-2 font-sans text-sm font-medium backdrop-blur-sm"
            >
              <AnimatedShinyText className="flex items-center justify-center gap-x-2 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
                <Sparkles className="text-primary fill-primary h-4 w-4" />
                {t("badge")}
              </AnimatedShinyText>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="from-foreground via-foreground/90 to-foreground/80 mb-6 bg-gradient-to-r bg-clip-text py-2 font-mono text-5xl font-bold tracking-tight text-transparent sm:text-6xl md:text-7xl lg:text-8xl"
            >
              {t("title")}
              <span className="from-primary to-primary/70 block bg-gradient-to-r bg-clip-text text-transparent">
                {t("titleHighlight")}
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-muted-foreground mx-auto mb-8 max-w-2xl font-serif text-xl md:text-2xl"
            >
              {t("description")}
            </motion.p>
          </motion.div>
          {/* Floating Elements */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={
              isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }
            }
            transition={{ duration: 1, delay: 0.8 }}
            className="absolute bottom-32 left-10 hidden lg:block"
          >
            <div className="border-border/20 bg-card/50 rounded-2xl border p-4 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="bg-primary h-3 w-3 rounded-full"></div>
                <span className="text-muted-foreground text-sm">
                  500+ {t("stats.happyYogis")}
                </span>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={
              isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }
            }
            transition={{ duration: 1, delay: 1 }}
            className="absolute right-10 bottom-32 hidden lg:block"
          >
            <div className="border-border/20 bg-card/50 rounded-2xl border p-4 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="bg-primary h-3 w-3 rounded-full"></div>
                <span className="text-muted-foreground text-sm">
                  {t("stats.expertInstructors")}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      {/* Yoga Certification Badge  */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={
          isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }
        }
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute top-4 right-4 z-20" // Adjusted positioning for all screens
      >
        <div className="border-border/20 bg-card/50 rounded-2xl border p-4 backdrop-blur-sm">
          <Image
            src="/yoga-cert.png"
            alt={"Yoga Certification Badge"}
            width={80}
            height={80}
            className="h-20 w-20 object-contain"
          />
        </div>
      </motion.div>
    </section>
  );
}
