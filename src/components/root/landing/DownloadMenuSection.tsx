"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useTranslations } from "next-intl";

export default function DownloadMenuSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });
  const t = useTranslations("menuDownload"); // Assuming you'll add translations for this section

  return (
    <section
      ref={sectionRef}
      className="from-background to-secondary/10 relative flex w-full items-center justify-center overflow-hidden bg-gradient-to-t py-20 md:py-32"
    >
      {/* Background Elements for visual depth */}
      <div
        className="absolute top-1/4 left-0 h-96 w-96 rounded-full opacity-5 blur-3xl"
        style={{
          background: `radial-gradient(circle at center, hsl(var(--accent)), transparent 70%)`,
        }}
      />
      <div
        className="absolute right-0 bottom-1/4 h-80 w-80 rounded-full opacity-5 blur-3xl"
        style={{
          background: `radial-gradient(circle at center, hsl(var(--primary)), transparent 70%)`,
        }}
      />

      <div className="relative z-10 container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="border-border/40 from-card/60 to-card/20 mx-auto max-w-4xl rounded-3xl border bg-gradient-to-br p-8 text-center shadow-2xl backdrop-blur-sm md:p-12"
        >
          <h2 className="from-foreground via-foreground/90 to-foreground/80 mb-4 bg-gradient-to-r bg-clip-text font-mono text-3xl font-bold tracking-tight text-transparent sm:text-4xl md:text-5xl">
            {t("title")}
          </h2>
          <p className="text-muted-foreground mx-auto mb-8 max-w-2xl font-serif text-lg md:text-xl">
            {t("description")}
          </p>
          <Button
            asChild
            size="lg"
            className="group bg-primary text-primary-foreground"
          >
            <a href="/menu.pdf" download="La_Fabrique_Du_Bonheur_Menu.pdf">
              {t("buttonText")}
              <Download className="ml-2 h-5 w-5 transition-transform group-hover:translate-y-0.5" />
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
