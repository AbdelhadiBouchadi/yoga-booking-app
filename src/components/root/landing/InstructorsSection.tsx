"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Award, Calendar, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { PublicInstructorType } from "@/app/data/instructors/get-instructors";

interface InstructorsSectionProps {
  instructors: PublicInstructorType[];
}

export default function InstructorsSection({
  instructors,
}: InstructorsSectionProps) {
  const t = useTranslations("instructors");
  const locale = useLocale();
  const isFrench = locale === "fr";
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  return (
    <section className="relative w-full overflow-hidden py-20 md:py-32">
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
        {instructors.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {instructors.map((instructor, index) => (
              <motion.div
                key={instructor.id}
                initial={{ opacity: 0, y: 40 }}
                animate={
                  isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }
                }
                transition={{
                  duration: 0.6,
                  delay: index * 0.2,
                  ease: "easeOut",
                }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group border-border/40 from-card/60 to-card/20 relative flex h-full flex-col overflow-hidden rounded-3xl border bg-gradient-to-br backdrop-blur-sm"
              >
                <div className="from-primary/5 absolute inset-0 bg-gradient-to-br to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                {/* Image */}
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={
                      instructor.image ||
                      "/placeholder.svg?height=400&width=400&query=yoga instructor" ||
                      "/placeholder.svg"
                    }
                    alt={instructor.name}
                    className="from-secondary/20 to-primary/10 h-full w-full bg-gradient-to-br object-contain transition-transform duration-500 group-hover:scale-105"
                    width={400}
                    height={256}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                  {/* Rating Badge */}
                  {instructor.averageRating > 0 && (
                    <div className="absolute top-4 right-4 font-sans">
                      <div className="bg-background/90 flex items-center gap-1 rounded-full px-2 py-1 backdrop-blur-sm">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-foreground text-xs font-medium">
                          {instructor.averageRating}
                        </span>
                        <span className="text-muted-foreground text-xs">
                          ({instructor.totalReviews})
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Experience Badge */}
                  {instructor.experience && (
                    <div className="absolute bottom-4 left-4 font-sans">
                      <Badge className="bg-primary/90 text-primary-foreground backdrop-blur-sm">
                        {instructor.experience} {t("experience")}
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="relative z-10 flex h-full flex-col p-6">
                  <div className="flex-1">
                    <div className="mb-2 font-sans">
                      <h3 className="text-foreground text-2xl font-bold">
                        {instructor.name}
                      </h3>
                    </div>

                    <div className="mb-2 h-16">
                      <p className="text-muted-foreground line-clamp-3 font-serif text-sm leading-relaxed">
                        {locale === "fr" ? instructor.bioFr : instructor.bioEn}
                      </p>
                    </div>

                    {/* Specialties */}
                    {instructor.specialties &&
                      instructor.specialties.length > 0 && (
                        <div className="mb-2 font-sans">
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
                      )}

                    {/* Certifications */}
                    {instructor.certifications &&
                      instructor.certifications.length > 0 && (
                        <div className="border-border/20 mb-4 border-t pt-4 font-sans">
                          <div className="mb-2 flex items-center gap-2">
                            <Award className="text-primary h-4 w-4" />
                            <h4 className="text-foreground text-sm font-semibold">
                              {t("certifications")}
                            </h4>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {instructor.certifications
                              .slice(0, 2)
                              .map((cert) => (
                                <Badge
                                  key={cert}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {cert}
                                </Badge>
                              ))}
                            {instructor.certifications.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{instructor.certifications.length - 2}
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                  </div>

                  {/* Action Button - Always at bottom */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      asChild
                      className="bg-primary text-primary-foreground w-full font-sans"
                    >
                      <Link href={`/${locale}/instructors/${instructor.id}`}>
                        {isFrench
                          ? `Rencontrez ${instructor.name}`
                          : `Meet ${instructor.name}`}
                      </Link>
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <p className="text-muted-foreground text-lg">No Founders Found</p>
          </div>
        )}
      </div>
    </section>
  );
}
