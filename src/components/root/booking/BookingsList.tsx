"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, User } from "lucide-react";
import { cancelBooking } from "@/app/data/bookings/booking-actions";
import { CancellationReason } from "@/generated/prisma";
import { toast } from "sonner";
import { tryCatch } from "@/hooks/try-catch";
import { UserBookingType } from "@/app/data/bookings/get-bookings";

interface BookingsListProps {
  initialBookings: UserBookingType[];
}

export default function BookingsList({ initialBookings }: BookingsListProps) {
  const [bookings, setBookings] = useState(initialBookings);
  const [isPending, startTransition] = useTransition();

  const handleCancelBooking = (bookingId: string) => {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(
        cancelBooking(bookingId, CancellationReason.USER_CANCELLED),
      );

      if (error) {
        toast.error("Failed to cancel booking");
        return;
      }

      if (result.status === "success") {
        toast.success("Booking cancelled successfully");
        // Update local state
        setBookings((prev) =>
          prev.map((booking) =>
            booking.id === bookingId
              ? { ...booking, status: "CANCELLED" as any }
              : booking,
          ),
        );
      } else {
        toast.error(result.message);
      }
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      case "COMPLETED":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const canCancelBooking = (booking: UserBookingType) => {
    if (booking.status !== "CONFIRMED" && booking.status !== "PENDING") {
      return false;
    }

    const cancellationDeadline = new Date(booking.lesson.startTime);
    cancellationDeadline.setHours(
      cancellationDeadline.getHours() -
        booking.lesson.cancellationDeadlineHours,
    );

    return new Date() < cancellationDeadline;
  };

  return (
    <div className="space-y-6">
      {bookings.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">No bookings found</p>
          </CardContent>
        </Card>
      ) : (
        bookings.map((booking) => (
          <Card key={booking.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  {booking.lesson.titleEn}
                </CardTitle>
                <Badge className={getStatusColor(booking.status)}>
                  {booking.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex items-center gap-2">
                  <Calendar className="text-muted-foreground h-4 w-4" />
                  <span>
                    {new Date(booking.lesson.startTime).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="text-muted-foreground h-4 w-4" />
                  <span>
                    {new Date(booking.lesson.startTime).toLocaleTimeString()} -
                    {new Date(booking.lesson.endTime).toLocaleTimeString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="text-muted-foreground h-4 w-4" />
                  <span>{booking.lesson.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="text-muted-foreground h-4 w-4" />
                  <span>{booking.lesson.instructor?.name}</span>
                </div>
              </div>

              {booking.isWaitingList && (
                <div className="mb-4 rounded-md border border-yellow-200 bg-yellow-50 p-3">
                  <p className="text-sm text-yellow-800">
                    You're on the waiting list (Position: {booking.position})
                  </p>
                </div>
              )}

              <div className="flex gap-2">
                {canCancelBooking(booking) && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleCancelBooking(booking.id)}
                    disabled={isPending}
                  >
                    Cancel Booking
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
