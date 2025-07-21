import { getPublishedLessons } from "@/app/data/lessons/lesson-actions";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import LessonCard, {
  LessonCardSkeleton,
} from "@/components/root/lessons/LessonCard";
import { Suspense } from "react";
import { SessionsHero } from "@/components/root/lessons/SessionsHero";
import { getTranslations } from "next-intl/server";

export default async function LessonsPage() {
  const lessons = await getPublishedLessons();
  const t = await getTranslations("sessions.grid");

  return (
    <div className="from-background to-secondary/10 min-h-screen bg-gradient-to-b">
      {/* Hero Section */}
      <SessionsHero />

      {/* Lessons Grid */}
      <section className="pb-20">
        <div className="container mx-auto px-4 md:px-6">
          {lessons.length === 0 ? (
            <Card className="mx-auto max-w-md">
              <CardContent className="py-12 text-center">
                <Calendar className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                <h3 className="mb-2 text-lg font-semibold">
                  {t("noClasses.title")}
                </h3>
                <p className="text-muted-foreground">
                  {t("noClasses.description")}
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <h2 className="text-foreground font-sans text-2xl font-bold">
                    {t("title")}
                  </h2>
                  <p className="text-muted-foreground">
                    {lessons.length}{" "}
                    {lessons.length === 1
                      ? t("classCount.single")
                      : t("classCount.multiple")}
                  </p>
                </div>
                <Badge variant="secondary" className="font-quote text-sm">
                  {t("updated")}
                </Badge>
              </div>

              <Suspense fallback={<LessonCardsGrid />}>
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {lessons.map((lesson) => (
                    <LessonCard key={lesson.id} lesson={lesson} />
                  ))}
                </div>
              </Suspense>
            </>
          )}
        </div>
      </section>
    </div>
  );
}

function LessonCardsGrid() {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <LessonCardSkeleton key={i} />
      ))}
    </div>
  );
}
