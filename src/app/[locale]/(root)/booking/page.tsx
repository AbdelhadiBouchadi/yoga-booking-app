import { getUserBookings } from "@/app/data/bookings/get-bookings";
import { requireAuth } from "@/app/data/require-auth";
import BookingsList from "@/components/root/booking/BookingsList";
import { Calendar, Clock } from "lucide-react";

export default async function BookingsPage() {
  // Fetch data on server side
  await requireAuth();
  const bookings = await getUserBookings();

  return (
    <div className="from-background to-secondary/10 min-h-screen bg-gradient-to-b">
      <div className="container mx-auto px-4 py-8 md:px-6">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-3">
            <div className="bg-primary/10 rounded-lg p-2">
              <Calendar className="text-primary h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">My Bookings</h1>
              <p className="text-muted-foreground">
                Manage your yoga class bookings and view upcoming sessions
              </p>
            </div>
          </div>

          {bookings.length > 0 && (
            <div className="text-muted-foreground flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{bookings.length} total bookings</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span>
                  {bookings.filter((b) => b.status === "CONFIRMED").length}{" "}
                  confirmed
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                <span>
                  {bookings.filter((b) => b.status === "PENDING").length}{" "}
                  pending
                </span>
              </div>
            </div>
          )}
        </div>

        <BookingsList initialBookings={bookings} />
      </div>
    </div>
  );
}
