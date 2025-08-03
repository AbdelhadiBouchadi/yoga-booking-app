"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Sparkles } from "lucide-react";
import { AnimatedShinyText } from "./AnimatedShinyText";
import { useTranslations } from "next-intl";

export default function HeroSection() {
  const t = useTranslations("hero");
  const heroRef = useRef(null);
  const isInView = useInView(heroRef, { once: true, amount: 0.3 });

  return (
    <section className="from-background via-secondary/15 to-foreground/45 relative min-h-screen w-full overflow-hidden bg-gradient-to-br">
      {/* Ambient Background Elements */}
      <div
        className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full opacity-10 blur-3xl"
        style={{
          background: `radial-gradient(circle at center, hsl(var(--primary)), transparent 70%)`,
        }}
      />
      <div
        className="absolute right-1/4 bottom-1/4 h-80 w-80 rounded-full opacity-5 blur-3xl"
        style={{
          background: `radial-gradient(circle at center, hsl(var(--accent)), transparent 70%)`,
        }}
      />

      <div
        className="relative z-10 container mx-auto px-4 md:px-6"
        ref={heroRef}
      >
        <div className="flex min-h-screen flex-col items-center justify-center text-center">
          {/* Main Hero Content */}
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
    </section>
  );
}
