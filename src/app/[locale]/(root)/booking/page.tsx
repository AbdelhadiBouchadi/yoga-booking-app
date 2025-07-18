import { getUserBookings } from "@/app/data/bookings/get-bookings";
import { requireAuth } from "@/app/data/require-auth";
import BookingsList from "@/components/root/booking/BookingsList";

export default async function BookingsPage() {
  // Fetch data on server side
  await requireAuth();
  const bookings = await getUserBookings();

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Bookings</h1>
        <p className="text-muted-foreground">
          Manage your yoga lesson bookings
        </p>
      </div>

      <BookingsList initialBookings={bookings} />
    </div>
  );
}
