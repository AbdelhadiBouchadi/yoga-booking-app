import { getPublishedLessons } from "@/app/data/lessons/lesson-actions";
import { requireAdmin } from "@/app/data/admin/require-admin";
import { Calendar } from "lucide-react";
import ScheduleCalendar from "@/components/admin/schedule/SchedulaCalendar";

export default async function AdminSchedulePage() {
  // Require admin access
  await requireAdmin();

  // Fetch lessons data
  const lessons = await getPublishedLessons();

  return (
    <div className="from-background to-secondary/10 min-h-screen rounded-lg bg-gradient-to-b">
      <div className="container mx-auto px-4 py-8 md:px-6">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-3">
            <div className="bg-primary/10 rounded-lg p-2">
              <Calendar className="text-primary h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Schedule Management</h1>
              <p className="text-muted-foreground">
                View and manage all yoga class schedules in calendar format
              </p>
            </div>
          </div>

          {lessons.length > 0 && (
            <div className="text-muted-foreground flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                <span>Beginner</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                <span>Intermediate</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-rose-500"></div>
                <span>Advanced</span>
              </div>
              <div className="flex items-center gap-2">
                <span>{lessons.length} classes scheduled</span>
              </div>
            </div>
          )}
        </div>

        {/* Calendar */}
        <ScheduleCalendar lessons={lessons} />
      </div>
    </div>
  );
}
