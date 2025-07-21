"use client";

import { Calendar, Star, StarIcon, Users } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

export function SessionsHero() {
  const t = useTranslations("sessions.hero");

  return (
    <section className="relative py-20 md:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-4xl text-center">
          <div className="border-primary/20 bg-primary/10 text-muted-foreground mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium backdrop-blur-sm">
            <StarIcon className="text-primary fill-primary h-4 w-4" />
            {t("badge")}
          </div>

          <h1 className="from-foreground via-foreground/90 to-foreground/80 mb-6 bg-gradient-to-r bg-clip-text font-mono text-5xl font-bold tracking-tight text-transparent sm:text-6xl md:text-7xl">
            {t("title")}
            <span className="from-primary to-primary/70 block bg-gradient-to-r bg-clip-text text-transparent">
              {t("titleHighlight")}
            </span>
          </h1>

          <p className="text-muted-foreground mx-auto mb-8 max-w-2xl font-serif text-xl md:text-2xl">
            {t("description")}
          </p>

          <div className="text-muted-foreground flex flex-wrap justify-center gap-4 font-serif text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="text-primary h-4 w-4" />
              <span>{t("features.scheduling")}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="text-primary h-4 w-4" />
              <span>{t("features.classSize")}</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="text-primary h-4 w-4" />
              <span>{t("features.instructors")}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
