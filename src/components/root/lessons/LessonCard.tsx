"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Star,
  AlertCircle,
  ScrollTextIcon,
} from "lucide-react";
import Link from "next/link";
import { PublishedLessonType } from "@/app/data/lessons/lesson-actions";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LessonCardProps {
  lesson: PublishedLessonType;
}

export default function LessonCard({ lesson }: LessonCardProps) {
  const availableSpots = lesson.maxCapacity - lesson._count.Booking;
  const isAlmostFull = availableSpots <= 3 && availableSpots > 0;
  const isFull = availableSpots <= 0;

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "Advanced":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="group border-border/40 from-card/60 to-card/20 overflow-hidden border bg-gradient-to-br backdrop-blur-sm transition-all duration-300 hover:shadow-xl">
        {/* Image */}
        {lesson.imageUrl && (
          <div className="relative h-48 overflow-hidden">
            <img
              src={lesson.imageUrl}
              alt={lesson.titleEn}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="from-primary/20 absolute inset-0 bg-gradient-to-t to-transparent" />

            {/* Status Badges */}
            <div className="absolute top-3 left-3 flex gap-2">
              {lesson.Category && (
                <Badge
                  variant="secondary"
                  className="bg-secondary/50 text-foreground font-quote backdrop-blur-sm"
                >
                  {lesson.Category.nameEn}
                </Badge>
              )}
            </div>

            <div className="absolute top-3 right-3 flex flex-col gap-2">
              <Badge className={cn(getLevelColor(lesson.level), "font-quote")}>
                {lesson.level}
              </Badge>
              {isFull && (
                <Badge variant="destructive" className="backdrop-blur-sm">
                  <AlertCircle className="mr-1 h-3 w-3" />
                  Full
                </Badge>
              )}
              {isAlmostFull && !isFull && (
                <Badge className="bg-primary/50 text-foreground backdrop-blur-sm">
                  {availableSpots} left
                </Badge>
              )}
            </div>
          </div>
        )}

        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-foreground group-hover:text-primary line-clamp-2 font-mono text-xl font-bold transition-colors">
                {lesson.titleEn}
              </h3>
              <p className="text-muted-foreground mt-1 line-clamp-2 font-serif text-sm">
                {lesson.shortDescriptionEn}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Instructor */}
          {lesson.instructor && (
            <div className="bg-secondary/20 flex items-center gap-3 rounded-lg p-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={lesson.instructor.image || undefined} />
                <AvatarFallback className="bg-primary/10 text-xs">
                  {lesson.instructor.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="text-foreground truncate text-sm font-semibold">
                  {lesson.instructor.name}
                </p>
                {lesson.instructor.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-muted-foreground text-xs">
                      {Number(lesson.instructor.rating).toFixed(1)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="text-primary h-4 w-4" />
              <span className="text-muted-foreground">
                {formatDate(lesson.startTime)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="text-primary h-4 w-4" />
              <span className="text-muted-foreground">
                {formatTime(lesson.startTime)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="text-primary h-4 w-4" />
              <span className="text-muted-foreground truncate">
                {lesson.location}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="text-primary h-4 w-4" />
              <span className="text-muted-foreground">
                {lesson._count.Booking}/{lesson.maxCapacity}
              </span>
            </div>
          </div>

          {/* Duration */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Duration:</span>
            <span className="text-foreground font-medium">
              {lesson.duration} minutes
            </span>
          </div>
        </CardContent>

        <CardFooter className="pt-0">
          <Button
            asChild
            className="group-hover:bg-primary/90 w-full transition-colors"
          >
            <Link href={`/sessions/${lesson.id}`}>
              {isFull ? (
                <>
                  <ScrollTextIcon />
                  <span>Join The Waitlist</span>
                </>
              ) : (
                <>
                  <Calendar />
                  <span>Book Session</span>
                </>
              )}
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
