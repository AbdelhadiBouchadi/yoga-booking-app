"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  updateBookingStatus,
  markAttendance,
} from "@/app/data/bookings/booking-actions";
import { BookingStatus } from "@/generated/prisma";
import { toast } from "sonner";
import { tryCatch } from "@/hooks/try-catch";
import { AdminBookingType } from "@/app/data/bookings/get-bookings";

interface AdminBookingsListProps {
  initialBookings: AdminBookingType[];
}

export default function AdminBookingsList({
  initialBookings,
}: AdminBookingsListProps) {
  const [bookings, setBookings] = useState(initialBookings);
  const [isPending, startTransition] = useTransition();

  const handleStatusUpdate = (bookingId: string, status: BookingStatus) => {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(
        updateBookingStatus(bookingId, { status }),
      );

      if (error) {
        toast.error("Failed to update status");
        return;
      }

      if (result.status === "success") {
        toast.success("Status updated successfully");
        setBookings((prev) =>
          prev.map((booking) =>
            booking.id === bookingId ? { ...booking, status } : booking,
          ),
        );
      } else {
        toast.error(result.message);
      }
    });
  };

  const handleMarkAttendance = (bookingIds: string[], attended: boolean) => {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(
        markAttendance({ bookingIds, attended }),
      );

      if (error) {
        toast.error("Failed to mark attendance");
        return;
      }

      if (result.status === "success") {
        toast.success("Attendance marked successfully");
        setBookings((prev) =>
          prev.map((booking) =>
            bookingIds.includes(booking.id)
              ? { ...booking, attendanceMarked: true, attended }
              : booking,
          ),
        );
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <div className="space-y-6">
      {bookings.map((booking) => (
        <Card key={booking.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                {booking.lesson.titleEn}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Select
                  value={booking.status}
                  onValueChange={(value) =>
                    handleStatusUpdate(booking.id, value as BookingStatus)
                  }
                  disabled={isPending}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                    <SelectItem value="NO_SHOW">No Show</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <p className="text-muted-foreground text-sm">Student</p>
                <p className="font-medium">{booking.user.name}</p>
                <p className="text-muted-foreground text-sm">
                  {booking.user.email}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Lesson Time</p>
                <p className="font-medium">
                  {new Date(booking.lesson.startTime).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Attendance</p>
                {booking.attendanceMarked ? (
                  <Badge variant={booking.attended ? "default" : "destructive"}>
                    {booking.attended ? "Present" : "Absent"}
                  </Badge>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleMarkAttendance([booking.id], true)}
                      disabled={isPending}
                    >
                      Present
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleMarkAttendance([booking.id], false)}
                      disabled={isPending}
                    >
                      Absent
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
