"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Flower2Icon, Heart, Users, Zap } from "lucide-react";
import { useTranslations } from "next-intl";

export default function AboutSection() {
  const t = useTranslations("about");
  const aboutRef = useRef(null);
  const valuesRef = useRef(null);

  const aboutInView = useInView(aboutRef, { once: true, amount: 0.3 });
  const valuesInView = useInView(valuesRef, { once: true, amount: 0.3 });

  const values = [
    {
      title: t("values.mindfulness.title"),
      description: t("values.mindfulness.description"),
      icon: Flower2Icon,
    },
    {
      title: t("values.community.title"),
      description: t("values.community.description"),
      icon: Users,
    },
    {
      title: t("values.wellness.title"),
      description: t("values.wellness.description"),
      icon: Heart,
    },
    {
      title: t("values.growth.title"),
      description: t("values.growth.description"),
      icon: Zap,
    },
  ];

  return (
    <section className="from-background to-secondary/10 relative w-full overflow-hidden bg-gradient-to-b py-20 md:py-32">
      {/* Ambient Background */}
      <div
        className="absolute top-1/2 left-0 h-96 w-96 -translate-y-1/2 rounded-full opacity-5 blur-3xl"
        style={{
          background: `radial-gradient(circle at center, hsl(var(--primary)), transparent 70%)`,
        }}
      />

      <div className="relative z-10 container mx-auto px-4 md:px-6">
        {/* Header Section */}
        <motion.div
          ref={aboutRef}
          initial={{ opacity: 0, y: 30 }}
          animate={aboutInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mx-auto mb-20 max-w-3xl text-center"
        >
          <h2 className="from-foreground via-foreground/90 to-foreground/80 mb-6 bg-gradient-to-r bg-clip-text font-mono text-4xl font-bold tracking-tight text-transparent sm:text-5xl md:text-6xl">
            {t("title")}
            <span className="from-primary to-primary/70 block bg-gradient-to-r bg-clip-text text-transparent">
              {t("titleHighlight")}
            </span>
          </h2>
          <p className="text-muted-foreground font-serif text-xl md:text-2xl">
            {t("description")}
          </p>
        </motion.div>

        {/* Mission & Vision Cards */}
        <div className="mb-24 grid gap-8 md:grid-cols-2">
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

        {/* Core Values */}
        <div ref={valuesRef}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={
              valuesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
            }
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mb-12 text-center"
          >
            <h3 className="from-foreground/80 via-foreground to-foreground/80 mb-4 bg-gradient-to-r bg-clip-text font-mono text-3xl font-bold tracking-tight text-transparent sm:text-4xl">
              {t("values.title")}
            </h3>
            <p className="text-muted-foreground mx-auto max-w-2xl font-serif text-lg">
              {t("values.description")}
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {values.map((value, index) => {
              const IconComponent = value.icon;

              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={
                    valuesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
                  }
                  transition={{
                    duration: 0.6,
                    ease: "easeOut",
                  }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="group border-border/40 from-card/60 to-card/20 relative overflow-hidden rounded-2xl border bg-gradient-to-br p-6 backdrop-blur-sm"
                >
                  <div className="from-primary/5 absolute inset-0 bg-gradient-to-br to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  <div className="relative z-10">
                    <div className="from-primary/20 to-primary/5 mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br transition-transform duration-300 group-hover:scale-110">
                      <IconComponent className="text-primary h-6 w-6" />
                    </div>

                    <h4 className="text-foreground mb-3 font-sans text-xl font-semibold">
                      {value.title}
                    </h4>

                    <p className="text-muted-foreground font-serif text-sm leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
