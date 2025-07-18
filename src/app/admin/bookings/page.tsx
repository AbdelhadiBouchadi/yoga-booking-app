import { requireAdmin } from "@/app/data/admin/require-admin";
import {
  getAdminBookings,
  getBookingStats,
} from "@/app/data/bookings/get-bookings";
import AdminBookingsList from "@/components/admin/booking/AdminBookingsList";
import BookingStats from "@/components/admin/booking/BookingStats";

export default async function AdminBookingsPage() {
  // Ensure user is admin and fetch data on server side
  await requireAdmin();

  const [bookings, stats] = await Promise.all([
    getAdminBookings(),
    getBookingStats(),
  ]);

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Booking Management</h1>
        <p className="text-muted-foreground">
          Manage all lesson bookings and attendance
        </p>
      </div>

      <BookingStats initialStats={stats} />
      <AdminBookingsList initialBookings={bookings} />
    </div>
  );
}
