"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock, MapPin, Users, Star, Award } from "lucide-react";
import { LessonDetailType } from "@/app/data/lessons/lesson-actions";
import { motion } from "framer-motion";
import { RenderDescription } from "@/components/admin/rich-text-editor/RenderDescription";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useLessonLevelFormatter } from "@/lib/enum-formatters";

interface LessonDetailsProps {
  lesson: NonNullable<LessonDetailType>;
}

export default function LessonDetails({ lesson }: LessonDetailsProps) {
  const t = useTranslations("sessionId.lessonDetails");
  const locale = useLocale();
  const isFrench = locale === "fr";
  const formatLessonLevel = useLessonLevelFormatter();

  const formatDate = (date: Date) => {
    return isFrench
      ? new Date(date).toLocaleDateString("fr-FR", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : new Date(date).toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        });
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "Advanced":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Image */}
      {lesson.imageUrl && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative h-64 overflow-hidden rounded-2xl md:h-80"
        >
          <Image
            src={lesson.imageUrl}
            alt={lesson.titleEn}
            className="h-full w-full object-contain"
            quality={95}
            fill
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

          {/* Floating badges */}
          <div className="absolute top-4 left-4 flex gap-2">
            {lesson.Category && (
              <Badge
                variant="secondary"
                className="bg-primary/90 font-quote backdroup-blr-sm"
              >
                {isFrench ? lesson.Category.nameFr : lesson.Category.nameEn}
              </Badge>
            )}
            <Badge className={cn(getLevelColor(lesson.level), "font-quote")}>
              {formatLessonLevel(lesson.level)}
            </Badge>
          </div>
        </motion.div>
      )}

      {/* Title and Description */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h1 className="from-foreground to-foreground/80 mb-4 bg-gradient-to-r bg-clip-text text-center font-mono text-4xl font-bold text-balance text-transparent md:text-5xl">
          {isFrench ? lesson.titleFr : lesson.titleEn}
        </h1>
        <p className="text-muted-foreground text-center font-serif text-xl leading-relaxed text-balance">
          {isFrench ? lesson.shortDescriptionFr : lesson.shortDescriptionEn}
        </p>
      </motion.div>

      {/* Lesson Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="border-border/40 from-card/60 to-card/20 border bg-gradient-to-br backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="text-primary h-5 w-5" />
              {t("title")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="text-primary h-5 w-5" />
                  <div>
                    <p className="text-muted-foreground text-sm">{t("date")}</p>
                    <p className="font-medium">
                      {formatDate(lesson.startTime)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="text-primary h-5 w-5" />
                  <div>
                    <p className="text-muted-foreground text-sm">{t("time")}</p>
                    <p className="font-medium">
                      {formatTime(lesson.startTime)} -{" "}
                      {formatTime(lesson.endTime)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <MapPin className="text-primary h-5 w-5" />
                  <div>
                    <p className="text-muted-foreground text-sm">
                      {t("location")}
                    </p>
                    <p className="font-medium">{lesson.location}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Users className="text-primary h-5 w-5" />
                  <div>
                    <p className="text-muted-foreground text-sm">
                      {t("capacity")}
                    </p>
                    <p className="font-medium">
                      Max {lesson.maxCapacity} participants
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Instructor Info */}
      {lesson.instructor && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="border-border/40 from-card/60 to-card/20 border bg-gradient-to-br backdrop-blur-sm">
            <CardHeader>
              <CardTitle>{t("title")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-6">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={lesson.instructor.image || undefined} />
                  <AvatarFallback className="bg-primary/10 text-lg">
                    {lesson.instructor.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="mb-3 flex items-center gap-3">
                    <h3 className="text-2xl font-bold">
                      {lesson.instructor.name}
                    </h3>
                    {lesson.instructor.rating && (
                      <div className="flex items-center gap-1 rounded-full bg-yellow-50 px-2 py-1 dark:bg-yellow-900/20">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">
                          {Number(lesson.instructor.rating).toFixed(1)}
                        </span>
                      </div>
                    )}
                  </div>

                  {(lesson.instructor.bioEn || lesson.instructor.bioFr) && (
                    <p className="text-muted-foreground mb-4 leading-relaxed">
                      {isFrench
                        ? lesson.instructor.bioFr
                        : lesson.instructor.bioEn}
                    </p>
                  )}

                  {lesson.instructor.specialties.length > 0 && (
                    <div>
                      <div className="mb-2 flex items-center gap-2">
                        <Award className="text-primary h-4 w-4" />
                        <span className="text-sm font-medium">
                          {t("specialties")}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {lesson.instructor.specialties.map(
                          (specialty, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs"
                            >
                              {specialty}
                            </Badge>
                          ),
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Description */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="border-border/40 from-card/60 to-card/20 border bg-gradient-to-br backdrop-blur-sm">
          <CardHeader>
            <CardTitle>{t("aboutClass")}</CardTitle>
          </CardHeader>
          <CardContent>
            <RenderDescription
              json={JSON.parse(
                isFrench ? lesson.descriptionFr : lesson.descriptionEn,
              )}
            />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
