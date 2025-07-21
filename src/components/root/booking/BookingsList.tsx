"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  X,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { cancelBooking } from "@/app/data/bookings/booking-actions";
import { CancellationReason } from "@/generated/prisma";
import { toast } from "sonner";
import { tryCatch } from "@/hooks/try-catch";
import { motion } from "framer-motion";
import Link from "next/link";
import { UserBookingType } from "@/app/data/bookings/get-bookings";
import { useLocale, useTranslations } from "next-intl";
import { useBookingStatusFormatter } from "@/lib/enum-formatters";

interface BookingsListProps {
  initialBookings: UserBookingType[];
}

export default function BookingsList({ initialBookings }: BookingsListProps) {
  const [bookings, setBookings] = useState(initialBookings);
  const [isPending, startTransition] = useTransition();
  const t = useTranslations("bookings.bookingsList");
  const locale = useLocale();
  const isFrench = locale === "fr";
  const formatBookingStatus = useBookingStatusFormatter();

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

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return {
          color:
            "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
          icon: CheckCircle,
        };
      case "PENDING":
        return {
          color:
            "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
          icon: Clock,
        };
      case "CANCELLED":
        return {
          color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
          icon: X,
        };
      case "COMPLETED":
        return {
          color:
            "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
          icon: CheckCircle,
        };
      default:
        return {
          color:
            "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
          icon: AlertCircle,
        };
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

  const isLessonPassed = (booking: UserBookingType) => {
    return new Date() > new Date(booking.lesson.endTime);
  };

  const shouldShowRebookOption = (booking: UserBookingType) => {
    return booking.status === "CANCELLED" && isLessonPassed(booking);
  };

  const formatDateTime = (date: Date) => {
    return isFrench
      ? new Date(date).toLocaleDateString("fr-FR", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : new Date(date).toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
  };

  if (bookings.length === 0) {
    return (
      <Card className="border-border/40 from-card/60 to-card/20 border bg-gradient-to-br backdrop-blur-sm">
        <CardContent className="py-12 text-center">
          <Calendar className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
          <h3 className="mb-2 text-lg font-semibold">
            {t("noBookings.title")}
          </h3>
          <p className="text-muted-foreground mb-4">
            {t("noBookings.description")}
          </p>
          <Button asChild>
            <Link href="/sessions">{t("noBookings.bookNow")}</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {bookings.map((booking, index) => {
        const statusConfig = getStatusConfig(booking.status);
        const StatusIcon = statusConfig.icon;

        return (
          <motion.div
            key={booking.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="border-border/40 from-card/60 to-card/20 border bg-gradient-to-br backdrop-blur-sm transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">
                    {isFrench ? booking.lesson.titleFr : booking.lesson.titleEn}
                  </CardTitle>
                  <Badge className={statusConfig.color}>
                    <StatusIcon className="mr-1 h-3 w-3" />
                    {formatBookingStatus(booking.status)}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent>
                <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Calendar className="text-primary h-4 w-4" />
                      <div>
                        <p className="text-muted-foreground text-sm">
                          {t("dateTime")}
                        </p>
                        <p className="font-medium">
                          {formatDateTime(booking.lesson.startTime)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <MapPin className="text-primary h-4 w-4" />
                      <div>
                        <p className="text-muted-foreground text-sm">
                          {t("location")}
                        </p>
                        <p className="font-medium">{booking.lesson.location}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <User className="text-primary h-4 w-4" />
                      <div>
                        <p className="text-muted-foreground text-sm">
                          {t("instructor")}
                        </p>
                        <p className="font-medium">
                          {booking.lesson.instructor?.name}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {booking.isWaitingList && (
                  <div className="mb-4 rounded-lg border border-yellow-200 bg-yellow-50 p-3 dark:border-yellow-800 dark:bg-yellow-950/50">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-yellow-600" />
                      <p className="text-sm text-yellow-800 dark:text-yellow-200">
                        {t("waitlist")}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  {canCancelBooking(booking) && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleCancelBooking(booking.id)}
                      disabled={isPending}
                    >
                      <X className="mr-2 h-4 w-4" />
                      {t("cancel")}
                    </Button>
                  )}

                  {booking.status === "CANCELLED" && (
                    <div className="text-muted-foreground bg-muted rounded p-2 text-sm">
                      <p>{t("cancelled")}</p>
                      {booking.cancellationReason && (
                        <p className="text-xs">
                          {t("cancelReason")}:{" "}
                          {booking.cancellationReason
                            .replace("_", " ")
                            .toLowerCase()}
                        </p>
                      )}
                      {booking.cancelledAt && (
                        <p className="text-xs">
                          {t("cancelTime")}:{" "}
                          {new Date(booking.cancelledAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  )}

                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/sessions/${booking.lesson.id}`}>
                      {t("viewClass")}
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
