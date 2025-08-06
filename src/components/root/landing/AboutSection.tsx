"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Flower2Icon, Heart } from "lucide-react";
import { useTranslations } from "next-intl";

export default function AboutSection() {
  const t = useTranslations("about");
  const aboutRef = useRef(null);

  const aboutInView = useInView(aboutRef, { once: true, amount: 0.3 });

  return (
    <section className="relative w-full overflow-hidden py-20 md:py-32">
      {/* Ambient Background */}
      <div
        className="absolute top-1/2 left-0 h-96 w-96 -translate-y-1/2 rounded-full opacity-5 blur-3xl"
        style={{
          background: `radial-gradient(circle at center, hsl(var(--primary)), transparent 70%)`,
        }}
      />

      <div className="relative z-10 container mx-auto px-4 md:px-6">
        {/* Mission & Vision Cards */}
        <div className="mb-24 grid gap-8 md:grid-cols-2" ref={aboutRef}>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={
              aboutInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }
            }
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="group border-border/40 from-card/50 to-card/20 relative overflow-hidden rounded-3xl border bg-gradient-to-br p-8 backdrop-blur-sm md:p-10"
          >
            <div className="from-primary/5 absolute inset-0 bg-gradient-to-br to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            <div className="relative z-10">
              <div className="from-primary/20 to-primary/5 mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br">
                <Flower2Icon className="text-primary h-8 w-8" />
              </div>

              <h3 className="from-primary/90 to-primary/70 mb-4 bg-gradient-to-r bg-clip-text font-sans text-3xl font-bold text-transparent">
                {t("mission.title")}
              </h3>

              <p className="text-muted-foreground font-serif text-lg leading-relaxed">
                {t("mission.description")}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={aboutInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.6 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="group border-border/40 from-card/50 to-card/20 relative overflow-hidden rounded-3xl border bg-gradient-to-br p-8 backdrop-blur-sm md:p-10"
          >
            <div className="from-secondary/20 absolute inset-0 bg-gradient-to-br to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            <div className="relative z-10">
              <div className="from-secondary/30 to-secondary/10 mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br">
                <Heart className="text-foreground h-8 w-8" />
              </div>

              <h3 className="text-foreground mb-4 font-sans text-3xl font-bold">
                {t("vision.title")}
              </h3>

              <p className="text-muted-foreground font-serif text-lg leading-relaxed">
                {t("vision.description")}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
