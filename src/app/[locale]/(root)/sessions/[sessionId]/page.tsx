import {
  getLessonById,
  getLessonBookings,
} from "@/app/data/lessons/lesson-actions";
import { requireAuth } from "@/app/data/require-auth";
import BookingSection from "@/components/root/lessons/BookingSection";
import LessonDetails from "@/components/root/lessons/LessonDetails";
import { notFound } from "next/navigation";

type Params = Promise<{ sessionId: string }>;

export default async function LessonPage({ params }: { params: Params }) {
  const { sessionId } = await params;

  // Fetch lesson and user session in parallel
  const [lesson, session] = await Promise.all([
    getLessonById(sessionId),
    requireAuth().catch(() => null), // Don't require auth, but get it if available
  ]);

  if (!lesson) {
    notFound();
  }

  // Get bookings for this lesson (only if user is authenticated)
  const bookings = session ? await getLessonBookings(sessionId) : [];

  // Check if current user has already booked this lesson
  const userBooking = session
    ? bookings.find((booking) => booking.userId === session.user.id)
    : null;

  const availableSpots = lesson.maxCapacity - lesson._count.Booking;

  return (
    <div className="from-background to-secondary/10 min-h-screen bg-gradient-to-b">
      <div className="container mx-auto px-4 py-8 md:px-6">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main lesson details */}
          <div className="lg:col-span-2">
            <LessonDetails lesson={lesson} />
          </div>

          {/* Booking sidebar */}
          <div className="lg:col-span-1">
            <BookingSection
              lesson={lesson}
              userBooking={userBooking}
              availableSpots={availableSpots}
              totalBookings={lesson._count.Booking}
              isAuthenticated={!!session}
              userId={session?.user.id}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
