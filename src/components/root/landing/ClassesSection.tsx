"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, Star, Calendar, MapPin } from "lucide-react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { PublishedLessonType } from "@/app/data/lessons/lesson-actions";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface ClassesSectionProps {
  lessons: PublishedLessonType[];
}

export default function ClassesSection({ lessons }: ClassesSectionProps) {
  const t = useTranslations("classes");
  const locale = useLocale();
  const isFrench = locale === "fr";
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

  const classes = [
    {
      title: t("types.hatha.title"),
      description: t("types.hatha.description"),
      duration: t("types.hatha.duration"),
      level: t("types.hatha.level"),
      capacity: t("types.hatha.capacity"),
      rating: 4.9,
      price: t("types.hatha.price"),
      image:
        "https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=600",
      gradient: "from-primary/20 to-secondary-500/5",
    },
    {
      title: t("types.vinyasa.title"),
      description: t("types.vinyasa.description"),
      duration: t("types.vinyasa.duration"),
      level: t("types.vinyasa.level"),
      capacity: t("types.vinyasa.capacity"),
      rating: 4.8,
      price: t("types.vinyasa.price"),
      image:
        "https://images.pexels.com/photos/3822906/pexels-photo-3822906.jpeg?auto=compress&cs=tinysrgb&w=600",
      gradient: "from-primary/20 to-secondary-500/5",
    },
    {
      title: t("types.yin.title"),
      description: t("types.yin.description"),
      duration: t("types.yin.duration"),
      level: t("types.yin.level"),
      capacity: t("types.yin.capacity"),
      rating: 5.0,
      price: t("types.yin.price"),
      image:
        "https://images.pexels.com/photos/3822864/pexels-photo-3822864.jpeg?auto=compress&cs=tinysrgb&w=600",
      gradient: "from-primary/20 to-secondary-500/5",
    },
  ];

  const hasLessonPassed = (startTime: Date) => {
    return new Date() > new Date(startTime);
  };

  const calculateDuration = (startTime: Date, endTime: Date) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diffInMinutes = Math.round(
      (end.getTime() - start.getTime()) / (1000 * 60),
    );
    return `${diffInMinutes} min`;
  };

  const getAvailableSpots = (maxCapacity: number, bookingCount: number) => {
    const available = maxCapacity - bookingCount;
    return available > 0 ? `${available} spots left` : "Full";
  };

  return (
    <section className="relative w-full overflow-hidden py-20 md:py-32">
      {/* Background Elements */}
      <div
        className="absolute top-1/4 right-0 h-80 w-80 rounded-full opacity-5 blur-3xl"
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
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mx-auto mb-16 max-w-3xl text-center"
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

        {/* Classes Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {lessons.map((lesson, index) => {
            const isPastLesson = hasLessonPassed(lesson.startTime);
            const duration = calculateDuration(
              lesson.startTime,
              lesson.endTime,
            );
            const availableSpots = getAvailableSpots(
              lesson.maxCapacity,
              lesson._count.Booking,
            );
            const lessonDate = format(
              new Date(lesson.startTime),
              "MMM dd, yyyy",
            );
            const lessonTime = format(new Date(lesson.startTime), "h:mm a");

            return (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, y: 40 }}
                animate={
                  isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }
                }
                transition={{
                  duration: 0.6,
                  ease: "easeInOut",
                }}
                whileHover={{ y: -8, scale: 1.02 }}
                className={cn(
                  "group border-border/40 from-card/60 to-card/20 relative overflow-hidden rounded-3xl border bg-gradient-to-br backdrop-blur-sm",
                  isPastLesson && "opacity-70",
                )}
              >
                {/* Card Background Gradient */}
                <div className="from-primary/20 to-secondary/5 absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={lesson.imageUrl}
                    alt={lesson.titleEn}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

                  {/* Status Badge */}
                  {isPastLesson && (
                    <div className="absolute top-4 left-4">
                      <Badge variant="destructive" className="backdrop-blur-sm">
                        {isFrench ? "Séance passée" : "Past Session"}
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="relative z-10 p-6">
                  <div className="mb-3 flex items-center justify-between font-sans">
                    <h3 className="text-foreground text-2xl font-bold">
                      {isFrench ? lesson.titleFr : lesson.titleEn}
                    </h3>
                  </div>

                  <p className="text-muted-foreground mb-4 font-serif">
                    {isFrench
                      ? lesson.shortDescriptionFr
                      : lesson.shortDescriptionEn}
                  </p>

                  {/* Class Details */}
                  <div className="mb-6 grid grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="text-primary h-4 w-4" />
                      <span className="text-muted-foreground">
                        {lesson.duration}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="text-primary h-4 w-4" />
                      <span className="text-muted-foreground">
                        {availableSpots}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="text-primary h-4 w-4" />
                      <span className="text-muted-foreground">
                        {lesson.location}
                      </span>
                    </div>
                    <div>
                      <Badge variant="secondary" className="text-xs">
                        {lesson.level}
                      </Badge>
                    </div>
                  </div>

                  {/* Action Button */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isPastLesson ? (
                      <Button
                        disabled
                        className="w-full font-sans"
                        variant="secondary"
                      >
                        Session Date Has Passed
                      </Button>
                    ) : (
                      <Button
                        asChild
                        className="bg-primary text-primary-foreground w-full font-sans"
                      >
                        <Link href={`/sessions/${lesson.id}`}>
                          <Calendar className="mr-2 h-4 w-4" />
                          {t("bookClass")}
                        </Link>
                      </Button>
                    )}
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-border/40 bg-background/50 backdrop-blur-sm"
            >
              <Link href="/sessions">{t("viewAll")}</Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
