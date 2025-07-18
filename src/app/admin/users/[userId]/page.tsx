import React from "react";
import { getUserById } from "../actions";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  IconArrowLeft,
  IconCalendar,
  IconCreditCard,
  IconMail,
  IconShield,
  IconStar,
  IconUser,
  IconTrendingUp,
  IconActivity,
  IconClock,
} from "@tabler/icons-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import GeneratedAvatar from "@/components/generated-avatar";

type Params = Promise<{ userId: string }>;

export default async function UserPage({ params }: { params: Params }) {
  const { userId } = await params;

  const user = await getUserById(userId);

  if (!user) {
    notFound();
  }

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return "default";
      case "completed":
        return "secondary";
      case "cancelled":
        return "destructive";
      case "pending":
        return "outline";
      default:
        return "outline";
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return "destructive";
      case "instructor":
        return "secondary";
      default:
        return "outline";
    }
  };

  const completedBookings = user.bookings.filter(
    (booking) => booking.status.toLowerCase() === "completed",
  ).length;

  const upcomingBookings = user.bookings.filter(
    (booking) =>
      booking.status.toLowerCase() === "confirmed" &&
      new Date(booking.lesson.startTime) > new Date(),
  ).length;

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto max-w-7xl px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Button variant="outline" size="sm" asChild className="w-fit">
              <Link href="/admin/users">
                <IconArrowLeft className="mr-2 h-4 w-4" />
                Back to Users
              </Link>
            </Button>
          </div>
          <div className="space-y-2">
            <h1 className="text-foreground text-3xl font-bold tracking-tight">
              User Profile
            </h1>
            <p className="text-muted-foreground text-lg">
              Comprehensive overview of {user.name}'s account and activity
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* User Profile Sidebar */}
          <div className="lg:col-span-4 xl:col-span-12">
            <Card className="sticky top-6">
              <CardContent className="p-6">
                <div className="flex flex-col items-center space-y-4 text-center">
                  {/* Avatar */}
                  <div className="relative">
                    {user.image ? (
                      <Avatar className="ring-background h-24 w-24 shadow-lg ring-4">
                        <AvatarImage src={user.image} alt={user.name} />
                        <AvatarFallback className="text-lg font-semibold">
                          {getUserInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <div className="ring-background rounded-full shadow-lg ring-4">
                        <GeneratedAvatar
                          seed={user.name}
                          variant="initials"
                          className="h-24 w-24"
                        />
                      </div>
                    )}
                  </div>

                  {/* User Info */}
                  <div className="space-y-2">
                    <h2 className="text-foreground text-2xl font-bold">
                      {user.name}
                    </h2>
                    <Badge
                      variant={getRoleBadgeVariant(user.role || "user")}
                      className="px-3 py-1 text-sm"
                    >
                      {user.role || "User"}
                    </Badge>
                  </div>

                  <Separator />

                  {/* Contact Info */}
                  <div className="w-full space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <IconMail className="text-muted-foreground h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{user.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <IconCalendar className="text-muted-foreground h-4 w-4 flex-shrink-0" />
                      <span>
                        Joined {format(new Date(user.createdAt), "MMM d, yyyy")}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <IconActivity className="text-muted-foreground h-4 w-4 flex-shrink-0" />
                      <span>{user.sessions.length} active sessions</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="space-y-6 lg:col-span-8 xl:col-span-12">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <Card className="relative overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <p className="text-muted-foreground text-sm font-medium">
                        Total Bookings
                      </p>
                      <p className="text-foreground text-3xl font-bold">
                        {user.bookings.length}
                      </p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
                      <IconCreditCard className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-sm">
                    <IconTrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-muted-foreground">All time</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <p className="text-muted-foreground text-sm font-medium">
                        Completed
                      </p>
                      <p className="text-foreground text-3xl font-bold">
                        {completedBookings}
                      </p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                      <IconShield className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">
                      {user.bookings.length > 0
                        ? `${Math.round((completedBookings / user.bookings.length) * 100)}% completion rate`
                        : "No bookings yet"}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <p className="text-muted-foreground text-sm font-medium">
                        Reviews Given
                      </p>
                      <p className="text-foreground text-3xl font-bold">
                        {user.reviews.length}
                      </p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/20">
                      <IconStar className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">
                      {user.reviews.length > 0
                        ? `Avg: ${(user.reviews.reduce((sum, review) => sum + review.rating, 0) / user.reviews.length).toFixed(1)}/5`
                        : "No reviews yet"}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <p className="text-muted-foreground text-sm font-medium">
                        Upcoming
                      </p>
                      <p className="text-foreground text-3xl font-bold">
                        {upcomingBookings}
                      </p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/20">
                      <IconClock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Next 30 days</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
              {/* Recent Bookings */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2">
                    <IconCreditCard className="h-5 w-5" />
                    Recent Bookings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {user.bookings.length === 0 ? (
                    <div className="py-8 text-center">
                      <IconCreditCard className="text-muted-foreground mx-auto mb-4 h-12 w-12 opacity-50" />
                      <p className="text-muted-foreground">
                        No bookings found for this user.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {user.bookings.slice(0, 5).map((booking, index) => (
                        <div key={booking.id}>
                          <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0 flex-1">
                              <p className="text-foreground truncate font-medium">
                                {booking.lesson.titleEn}
                              </p>
                              <p className="text-muted-foreground mt-1 text-sm">
                                {format(
                                  new Date(booking.lesson.startTime),
                                  "MMM d, yyyy 'at' h:mm a",
                                )}
                              </p>
                            </div>
                            <Badge
                              variant={getStatusBadgeVariant(booking.status)}
                              className="flex-shrink-0"
                            >
                              {booking.status}
                            </Badge>
                          </div>
                          {index < Math.min(user.bookings.length - 1, 4) && (
                            <Separator className="mt-4" />
                          )}
                        </div>
                      ))}
                      {user.bookings.length > 5 && (
                        <div className="pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                          >
                            View All Bookings ({user.bookings.length})
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recent Reviews */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2">
                    <IconStar className="h-5 w-5" />
                    Recent Reviews
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {user.reviews.length === 0 ? (
                    <div className="py-8 text-center">
                      <IconStar className="text-muted-foreground mx-auto mb-4 h-12 w-12 opacity-50" />
                      <p className="text-muted-foreground">
                        No reviews found for this user.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {user.reviews.slice(0, 3).map((review, index) => (
                        <div key={review.id}>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1">
                                  {[...Array(5)].map((_, i) => (
                                    <IconStar
                                      key={i}
                                      className={`h-4 w-4 ${
                                        i < review.rating
                                          ? "fill-yellow-400 text-yellow-400"
                                          : "text-muted-foreground"
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-sm font-medium">
                                  {review.rating}/5
                                </span>
                              </div>
                              <span className="text-muted-foreground text-xs">
                                {format(new Date(review.createdAt), "MMM d")}
                              </span>
                            </div>
                            {review.comment && (
                              <p className="text-muted-foreground text-sm leading-relaxed">
                                "{review.comment}"
                              </p>
                            )}
                            <div className="text-muted-foreground text-xs">
                              {review.lesson
                                ? `${review.lesson.titleEn}`
                                : "General Review"}{" "}
                              • {review.instructor.name}
                            </div>
                          </div>
                          {index < Math.min(user.reviews.length - 1, 2) && (
                            <Separator className="mt-4" />
                          )}
                        </div>
                      ))}
                      {user.reviews.length > 3 && (
                        <div className="pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                          >
                            View All Reviews ({user.reviews.length})
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
