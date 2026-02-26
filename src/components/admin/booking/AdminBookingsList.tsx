"use client";

import { useState, useTransition, useMemo } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  updateBookingStatus,
  markAttendance,
} from "@/app/data/bookings/booking-actions";
import { BookingStatus } from "@/generated/prisma";
import { toast } from "sonner";
import { tryCatch } from "@/hooks/try-catch";
import { AdminBookingType } from "@/app/data/bookings/get-bookings";
import { CalendarIcon, UsersIcon } from "lucide-react";

interface AdminBookingsListProps {
  initialBookings: AdminBookingType[];
}

export default function AdminBookingsList({
  initialBookings,
}: AdminBookingsListProps) {
  const [bookings, setBookings] = useState(initialBookings);
  const [isPending, startTransition] = useTransition();

  // Filtering States
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
  const [selectedLessonId, setSelectedLessonId] = useState<string>("all");

  // --- Filtering Logic ---
  const now = new Date();

  // 1. Extract unique lessons from the bookings to populate our Select dropdowns
  const uniqueLessons = useMemo(() => {
    const lessonsMap = new Map();
    bookings.forEach((b) => {
      if (!lessonsMap.has(b.lesson.id)) {
        lessonsMap.set(b.lesson.id, b.lesson);
      }
    });
    return Array.from(lessonsMap.values());
  }, [bookings]);

  // 2. Split lessons into Upcoming and Past categories
  const upcomingLessons = uniqueLessons.filter(
    (l) => new Date(l.startTime) >= now,
  );
  const pastLessons = uniqueLessons.filter((l) => new Date(l.startTime) < now);

  // 3. Determine which list of lessons to show in the dropdown based on the active tab
  const activeLessonsOptions =
    activeTab === "upcoming" ? upcomingLessons : pastLessons;

  // 4. Finally, filter the actual bookings to display on the screen
  const displayedBookings = bookings.filter((b) => {
    const isUpcoming = new Date(b.lesson.startTime) >= now;

    // Check Tab Match
    if (activeTab === "upcoming" && !isUpcoming) return false;
    if (activeTab === "past" && isUpcoming) return false;

    // Check Lesson Match
    if (selectedLessonId !== "all" && b.lesson.id !== selectedLessonId)
      return false;

    return true;
  });

  // --- Server Actions ---
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

  // Reset the selected lesson when switching tabs so it doesn't try to filter an upcoming lesson in the past tab
  const handleTabChange = (value: string) => {
    setActiveTab(value as "upcoming" | "past");
    setSelectedLessonId("all");
  };

  return (
    <div className="space-y-6">
      {/* Tab & Filter Header */}
      <div className="bg-card flex flex-col gap-4 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-[400px]"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upcoming">Upcoming Sessions</TabsTrigger>
            <TabsTrigger value="past">Past / Archived</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex w-full items-center gap-3 sm:w-auto">
          <CalendarIcon className="text-muted-foreground h-4 w-4" />
          <Select value={selectedLessonId} onValueChange={setSelectedLessonId}>
            <SelectTrigger className="w-full sm:w-[280px]">
              <SelectValue placeholder="Filter by Session" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sessions in this tab</SelectItem>
              {activeLessonsOptions.map((lesson) => (
                <SelectItem key={lesson.id} value={lesson.id}>
                  {lesson.titleEn} -{" "}
                  {new Date(lesson.startTime).toLocaleDateString()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results Meta */}
      <div className="text-muted-foreground flex items-center gap-2 text-sm">
        <UsersIcon className="h-4 w-4" />
        Showing {displayedBookings.length} booking
        {displayedBookings.length !== 1 && "s"}
      </div>

      {/* Bookings List */}
      <div className="grid grid-cols-1 gap-6">
        {displayedBookings.length === 0 ? (
          <div className="text-muted-foreground rounded-lg border border-dashed py-12 text-center">
            No bookings found for the selected filters.
          </div>
        ) : (
          displayedBookings.map((booking) => (
            <Card
              key={booking.id}
              className={
                booking.status === "CANCELLED" ? "bg-muted/50 opacity-75" : ""
              }
            >
              <CardHeader className="pb-3">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                  <div>
                    <CardTitle className="text-lg">
                      {booking.lesson.titleEn}
                    </CardTitle>
                    <p className="text-muted-foreground mt-1 text-sm">
                      {new Date(booking.lesson.startTime).toLocaleString(
                        undefined,
                        {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        },
                      )}
                    </p>
                  </div>
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
                <div className="bg-secondary/20 grid grid-cols-1 gap-4 rounded-lg p-4 md:grid-cols-2 lg:grid-cols-3">
                  <div>
                    <p className="text-muted-foreground mb-1 text-sm font-medium">
                      Student
                    </p>
                    <p className="font-medium">{booking.user.name}</p>
                    <p className="text-muted-foreground text-sm">
                      {booking.user.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1 text-sm font-medium">
                      Booking Date
                    </p>
                    <p className="text-sm">
                      {new Date(booking.bookedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-2 text-sm font-medium">
                      Attendance Status
                    </p>
                    {booking.attendanceMarked ? (
                      <Badge
                        variant={booking.attended ? "default" : "destructive"}
                        className="text-xs"
                      >
                        {booking.attended ? "Present" : "Absent"}
                      </Badge>
                    ) : (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() =>
                            handleMarkAttendance([booking.id], true)
                          }
                          disabled={isPending || booking.status === "CANCELLED"}
                        >
                          Present
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            handleMarkAttendance([booking.id], false)
                          }
                          disabled={isPending || booking.status === "CANCELLED"}
                        >
                          Absent
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
