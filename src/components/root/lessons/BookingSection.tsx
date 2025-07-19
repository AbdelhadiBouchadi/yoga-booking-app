"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  createBooking,
  cancelBooking,
} from "@/app/data/bookings/booking-actions";
import { CancellationReason } from "@/generated/prisma";
import { toast } from "sonner";
import { tryCatch } from "@/hooks/try-catch";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Clock,
  Users,
  AlertCircle,
  CheckCircle,
  UserPlus,
  X,
  LogInIcon,
} from "lucide-react";
import { LessonDetailType } from "@/app/data/lessons/lesson-actions";
import { motion } from "framer-motion";

interface BookingSectionProps {
  lesson: NonNullable<LessonDetailType>;
  userBooking?: {
    id: string;
    status: string;
    isWaitingList: boolean;
    position: number | null;
  } | null;
  availableSpots: number;
  totalBookings: number;
  isAuthenticated: boolean;
  userId?: string;
}

export default function BookingSection({
  lesson,
  userBooking,
  availableSpots,
  totalBookings,
  isAuthenticated,
  userId,
}: BookingSectionProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleBookLesson = () => {
    if (!isAuthenticated) {
      router.push("/auth/signin");
      return;
    }

    startTransition(async () => {
      const { data: result, error } = await tryCatch(
        createBooking({
          lessonId: lesson.id,
          userId: userId!,
        }),
      );

      if (error) {
        toast.error("Failed to create booking");
        return;
      }

      if (result.status === "success") {
        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    });
  };

  const handleCancelBooking = () => {
    if (!userBooking) return;

    startTransition(async () => {
      const { data: result, error } = await tryCatch(
        cancelBooking(userBooking.id, CancellationReason.USER_CANCELLED),
      );

      if (error) {
        toast.error("Failed to cancel booking");
        return;
      }

      if (result.status === "success") {
        toast.success("Booking cancelled successfully");
        router.refresh();
      } else {
        toast.error(result.message);
      }
    });
  };

  const canCancelBooking = () => {
    if (
      !userBooking ||
      (userBooking.status !== "CONFIRMED" && userBooking.status !== "PENDING")
    ) {
      return false;
    }

    const cancellationDeadline = new Date(lesson.startTime);
    cancellationDeadline.setHours(
      cancellationDeadline.getHours() - lesson.cancellationDeadlineHours,
    );

    return new Date() < cancellationDeadline;
  };

  const isLessonStarted = new Date() > new Date(lesson.startTime);
  const isLessonFull = availableSpots <= 0;

  const getBookingStatusBadge = () => {
    if (!userBooking) return null;

    switch (userBooking.status) {
      case "CONFIRMED":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            <CheckCircle className="mr-1 h-3 w-3" />
            Confirmed
          </Badge>
        );
      case "PENDING":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
            <Clock className="mr-1 h-3 w-3" />
            {userBooking.isWaitingList
              ? `Waiting List #${userBooking.position}`
              : "Pending"}
          </Badge>
        );
      case "CANCELLED":
        return (
          <Badge variant="destructive">
            <X className="mr-1 h-3 w-3" />
            Cancelled
          </Badge>
        );
      default:
        return null;
    }
  };

  const getCapacityColor = () => {
    const percentage = (totalBookings / lesson.maxCapacity) * 100;
    if (percentage >= 100) return "text-red-600";
    if (percentage >= 80) return "text-orange-600";
    return "text-muted-foreground";
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="sticky top-4"
    >
      <Card className="border-border/40 from-card/60 to-card/20 border bg-gradient-to-br backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Book This Class</span>
            {getBookingStatusBadge()}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Quick Info */}
          <div className="space-y-3">
            <div className="bg-secondary/20 flex items-center gap-3 rounded-lg p-3">
              <Calendar className="text-primary h-4 w-4" />
              <div>
                <p className="text-muted-foreground text-sm">Date & Time</p>
                <p className="font-medium">
                  {new Date(lesson.startTime).toLocaleDateString()} at{" "}
                  {new Date(lesson.startTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>

            <div className="bg-secondary/20 flex items-center gap-3 rounded-lg p-3">
              <Users className="text-primary h-4 w-4" />
              <div className="flex-1">
                <p className="text-muted-foreground text-sm">Capacity</p>
                <div className="flex items-center justify-between">
                  <span className={`font-medium ${getCapacityColor()}`}>
                    {totalBookings}/{lesson.maxCapacity} booked
                  </span>
                  {availableSpots > 0 && (
                    <Badge variant="outline" className="text-xs">
                      {availableSpots} spots left
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Status Alerts */}
          {isLessonStarted && (
            <Alert className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
              <AlertCircle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800 dark:text-orange-200">
                This class has already started and cannot be booked.
              </AlertDescription>
            </Alert>
          )}

          {isLessonFull && !isLessonStarted && !userBooking && (
            <Alert className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
              <UserPlus className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800 dark:text-blue-200">
                This class is full. Join the waiting list and we'll notify you
                if a spot opens up.
              </AlertDescription>
            </Alert>
          )}

          {userBooking?.isWaitingList && (
            <Alert className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950">
              <Clock className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800 dark:text-yellow-200">
                You're on the waiting list (Position: {userBooking.position}).
                We'll notify you if a spot becomes available.
              </AlertDescription>
            </Alert>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            {!userBooking && !isLessonStarted && isAuthenticated && (
              <Button
                onClick={handleBookLesson}
                disabled={isPending}
                className="w-full"
                variant={isLessonFull ? "outline" : "default"}
                size="lg"
              >
                {isPending ? (
                  "Processing..."
                ) : isLessonFull ? (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Join Waiting List
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Book Class
                  </>
                )}
              </Button>
            )}

            {userBooking && canCancelBooking() && (
              <Button
                onClick={handleCancelBooking}
                disabled={isPending}
                variant="destructive"
                className="w-full"
                size="lg"
              >
                {isPending ? (
                  "Cancelling..."
                ) : (
                  <>
                    <X className="mr-2 h-4 w-4" />
                    Cancel Booking
                  </>
                )}
              </Button>
            )}

            {!isAuthenticated && (
              <Button
                onClick={() => router.push("/sign-in")}
                className="w-full"
                size="lg"
              >
                <LogInIcon />
                Sign In to Book
              </Button>
            )}
          </div>

          {/* Cancellation Policy */}
          <div className="text-muted-foreground border-border/20 border-t pt-4 text-xs">
            <p className="font-sm mb-1 text-lg underline underline-offset-1">
              Cancellation Policy
            </p>
            <p>
              You can cancel your booking up to{" "}
              {lesson.cancellationDeadlineHours} hours before the class starts
              for a full refund.
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
