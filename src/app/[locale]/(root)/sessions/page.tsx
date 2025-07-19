import { getPublishedLessons } from "@/app/data/lessons/lesson-actions";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, Star } from "lucide-react";
import LessonCard from "@/components/root/lessons/LessonCard";

export default async function LessonsPage() {
  const lessons = await getPublishedLessons();

  return (
    <div className="from-background to-secondary/10 min-h-screen bg-gradient-to-b">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto max-w-4xl text-center">
            <div className="border-primary/20 bg-primary/10 text-muted-foreground mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium backdrop-blur-sm">
              <Star className="text-primary fill-primary h-4 w-4" />
              Find Your Perfect Practice
            </div>

            <h1 className="from-foreground via-foreground/90 to-foreground/80 mb-6 bg-gradient-to-r bg-clip-text font-mono text-5xl font-bold tracking-tight text-transparent sm:text-6xl md:text-7xl">
              Yoga
              <span className="from-primary to-primary/70 block bg-gradient-to-r bg-clip-text text-transparent">
                Classes
              </span>
            </h1>

            <p className="text-muted-foreground mx-auto mb-8 max-w-2xl font-serif text-xl md:text-2xl">
              Discover transformative yoga sessions led by expert instructors.
              Book your spot and begin your wellness journey today.
            </p>

            <div className="text-muted-foreground flex flex-wrap justify-center gap-4 font-serif text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="text-primary h-4 w-4" />
                <span>Flexible Scheduling</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="text-primary h-4 w-4" />
                <span>Small Class Sizes</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="text-primary h-4 w-4" />
                <span>Expert Instructors</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lessons Grid */}
      <section className="pb-20">
        <div className="container mx-auto px-4 md:px-6">
          {lessons.length === 0 ? (
            <Card className="mx-auto max-w-md">
              <CardContent className="py-12 text-center">
                <Calendar className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                <h3 className="mb-2 text-lg font-semibold">
                  No Classes Available For The Moment
                </h3>
                <p className="text-muted-foreground">
                  Check back soon for new yoga sessions!
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <h2 className="text-foreground font-sans text-2xl font-bold">
                    Available Classes
                  </h2>
                  <p className="text-muted-foreground">
                    {lessons.length}{" "}
                    {lessons.length === 1 ? "class" : "classes"} available
                  </p>
                </div>
                <Badge variant="secondary" className="font-quote text-sm">
                  Updated daily
                </Badge>
              </div>

              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {lessons.map((lesson) => (
                  <LessonCard key={lesson.id} lesson={lesson} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
