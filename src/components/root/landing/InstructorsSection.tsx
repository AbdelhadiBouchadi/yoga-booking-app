"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Star, Award, Heart } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";

export default function InstructorsSection() {
  const t = useTranslations("instructors");
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  const instructors = [
    {
      name: t("team.sarah.name"),
      title: t("team.sarah.title"),
      specialties: Object.values(
        t.raw("team.sarah.specialties") as Record<string, string>,
      ),
      experience: t("team.sarah.experience"),
      rating: 4.9,
      bio: t("team.sarah.bio"),
      image:
        "https://images.pexels.com/photos/3822864/pexels-photo-3822864.jpeg?auto=compress&cs=tinysrgb&w=400",
      certifications: Object.values(
        t.raw("team.sarah.certifications") as Record<string, string>,
      ),
    },
    {
      name: t("team.marcus.name"),
      title: t("team.marcus.title"),
      specialties: Object.values(
        t.raw("team.marcus.specialties") as Record<string, string>,
      ),
      experience: t("team.marcus.experience"),
      rating: 4.8,
      bio: t("team.marcus.bio"),
      image:
        "https://images.pexels.com/photos/3822906/pexels-photo-3822906.jpeg?auto=compress&cs=tinysrgb&w=400",
      certifications: Object.values(
        t.raw("team.marcus.certifications") as Record<string, string>,
      ),
    },
    {
      name: t("team.luna.name"),
      title: t("team.luna.title"),
      specialties: Object.values(
        t.raw("team.luna.specialties") as Record<string, string>,
      ),
      experience: t("team.luna.experience"),
      rating: 5.0,
      bio: t("team.luna.bio"),
      image:
        "https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=400",
      certifications: Object.values(
        t.raw("team.luna.certifications") as Record<string, string>,
      ),
    },
  ];

  return (
    <section className="from-background to-secondary/10 relative w-full overflow-hidden bg-gradient-to-b py-20 md:py-32">
      {/* Background Elements */}
      <div
        className="absolute top-1/2 left-1/4 h-96 w-96 -translate-y-1/2 rounded-full opacity-5 blur-3xl"
        style={{
          background: `radial-gradient(circle at center, hsl(var(--primary)), transparent 70%)`,
        }}
      />

      <div
        className="relative z-10 container mx-auto px-4 md:px-6"
        ref={sectionRef}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mx-auto mb-16 max-w-3xl space-y-4 text-center"
        >
          <h2 className="mb-6 font-mono text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            {t("title")}
            <span className="from-primary to-primary/30 block bg-gradient-to-r bg-clip-text py-3 text-transparent">
              {t("titleHighlight")}
            </span>
          </h2>
          <p className="text-muted-foreground font-serif text-xl md:text-2xl">
            {t("description")}
          </p>
        </motion.div>

        {/* Instructors Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {instructors.map((instructor, index) => (
            <motion.div
              key={instructor.name}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{
                duration: 0.6,
                delay: index * 0.2,
                ease: "easeOut",
              }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group border-border/40 from-card/60 to-card/20 relative overflow-hidden rounded-3xl border bg-gradient-to-br backdrop-blur-sm"
            >
              <div className="from-primary/5 absolute inset-0 bg-gradient-to-br to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              {/* Image */}
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={instructor.image}
                  alt={instructor.name}
                  className="h-full w-full object-fill transition-transform duration-500 group-hover:scale-110"
                  width={200}
                  height={200}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                {/* Rating Badge */}
                <div className="absolute top-4 right-4 font-sans">
                  <div className="bg-background/90 flex items-center gap-1 rounded-full px-2 py-1 backdrop-blur-sm">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-foreground text-xs font-medium">
                      {instructor.rating}
                    </span>
                  </div>
                </div>

                {/* Experience Badge */}
                <div className="absolute bottom-4 left-4 font-sans">
                  <Badge className="bg-primary/90 text-primary-foreground backdrop-blur-sm">
                    {instructor.experience} {t("experience")}
                  </Badge>
                </div>
              </div>

              {/* Content */}
              <div className="relative z-10 p-6">
                <div className="mb-2 font-sans">
                  <h3 className="text-foreground text-2xl font-bold">
                    {instructor.name}
                  </h3>
                  <p className="text-primary font-medium">{instructor.title}</p>
                </div>

                <p className="text-muted-foreground mb-4 font-serif text-sm leading-relaxed">
                  {instructor.bio}
                </p>

                {/* Specialties */}
                <div className="mb-4 font-sans">
                  <h4 className="text-foreground mb-2 text-sm font-semibold">
                    {t("specialties")}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {instructor.specialties.map((specialty) => (
                      <Badge
                        key={specialty}
                        variant="secondary"
                        className="text-xs"
                      >
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Certifications */}
                <div className="border-border/20 border-t pt-4 font-sans">
                  <div className="mb-2 flex items-center gap-2">
                    <Award className="text-primary h-4 w-4" />
                    <h4 className="text-foreground text-sm font-semibold">
                      {t("certifications")}
                    </h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {instructor.certifications.map((cert) => (
                      <Badge key={cert} variant="outline" className="text-xs">
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-16 w-full text-center"
        >
          <div className="border-border/40 from-card/60 to-card/20 mx-auto rounded-2xl border bg-gradient-to-br p-8 backdrop-blur-sm">
            <Heart className="text-primary mx-auto mb-4 h-12 w-12" />
            <h3 className="text-foreground mb-4 font-mono text-2xl font-bold">
              {t("cta.title")}
            </h3>
            <p className="text-muted-foreground mx-auto max-w-md font-serif text-balance">
              {t("cta.description")}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
