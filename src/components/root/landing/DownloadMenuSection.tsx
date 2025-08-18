"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useTranslations } from "next-intl";
import type { DownloadDocumentType } from "@/app/data/admin/menu-download-actions";

interface DownloadMenuSectionProps {
  document: DownloadDocumentType;
}

export default function DownloadMenuSection({
  document,
}: DownloadMenuSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });
  const t = useTranslations("menuDownload");

  const downloadUrl = document?.url || "/menu.pdf";
  const downloadName = document?.name
    ? `${document.name.replace(/\s+/g, "_")}.pdf`
    : "La_Fabrique_Du_Bonheur_Menu.pdf";

  return (
    <section
      ref={sectionRef}
      className="relative flex w-full items-center justify-center overflow-hidden py-20 md:py-32"
    >
      <motion.div
        initial={{ scale: 1.1, opacity: 0 }}
        animate={isInView ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('/menu-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      <div className="absolute inset-0 z-10 bg-black/40" />

      <div className="relative z-20 container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="mx-auto max-w-4xl rounded-3xl border border-white/20 bg-white/10 p-8 text-center shadow-2xl backdrop-blur-md md:p-12"
        >
          <h2 className="mb-4 font-mono text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            {t("title")}
          </h2>
          <p className="mx-auto mb-8 max-w-2xl font-serif text-lg text-white/90 md:text-xl">
            {t("description")}
          </p>
          <Button
            asChild
            size="lg"
            className="group bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <a href={downloadUrl} download={downloadName} target="_blank">
              {t("buttonText")}
              <Download className="ml-2 h-5 w-5 transition-transform group-hover:translate-y-0.5" />
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
