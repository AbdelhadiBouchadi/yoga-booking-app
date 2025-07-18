import { getAdminLesson } from "@/app/data/admin/get-admin-lesson";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  CalendarIcon,
  ClockIcon,
  EditIcon,
  MapPinIcon,
  SchoolIcon,
  UsersIcon,
  AlertCircleIcon,
  ImageIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { RenderDescription } from "@/components/admin/rich-text-editor/RenderDescription";

type Params = Promise<{ sessionId: string }>;

export default async function LessonPage({ params }: { params: Params }) {
  const { sessionId } = await params;
  const data = await getAdminLesson(sessionId);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Published":
        return "bg-green-100 text-green-800 border-green-200";
      case "Draft":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Archived":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "Intermediate":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "Advanced":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  return (
    <div className="mx-auto space-y-8">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Badge className={getStatusColor(data!.status)} variant="outline">
              {data!.status}
            </Badge>
            <Badge className={getLevelColor(data!.level)} variant="outline">
              {data!.level}
            </Badge>
          </div>
          <h1 className="text-foreground text-3xl font-bold tracking-tight">
            {data!.titleEn}
          </h1>
          <p className="text-muted-foreground text-lg">{data!.titleFr}</p>
        </div>
        <Button asChild size="lg" className="shrink-0">
          <Link href={`/admin/sessions/${data!.id}/edit`}>
            <EditIcon className="mr-2 h-4 w-4" />
            Edit Lesson
          </Link>
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-8 lg:col-span-2">
          {/* Hero Image */}
          {data!.imageUrl ? (
            <Card className="overflow-hidden">
              <div className="relative aspect-video">
                <Image
                  src={data!.imageUrl}
                  alt={data!.titleEn}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </Card>
          ) : (
            <Card className="border-dashed">
              <CardContent className="flex aspect-video items-center justify-center">
                <div className="text-center">
                  <ImageIcon className="text-muted-foreground mx-auto h-12 w-12" />
                  <p className="text-muted-foreground mt-2 text-sm">
                    No image uploaded
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Short Description */}
          <Card>
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-foreground mb-2 font-medium">English</h4>
                <p className="text-muted-foreground leading-relaxed">
                  {data!.shortDescriptionEn}
                </p>
              </div>
              <Separator />
              <div>
                <h4 className="text-foreground mb-2 font-medium">Français</h4>
                <p className="text-muted-foreground leading-relaxed">
                  {data!.shortDescriptionFr}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Full Description */}
          <Card>
            <CardHeader>
              <CardTitle>Detailed Description</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="text-foreground mb-3 font-medium">English</h4>
                <RenderDescription json={JSON.parse(data!.descriptionEn)} />
              </div>
              <Separator />
              <div>
                <h4 className="text-foreground mb-3 font-medium">Français</h4>
                <RenderDescription json={JSON.parse(data!.descriptionFr)} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Schedule & Location */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Schedule & Location
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <CalendarIcon className="text-muted-foreground mt-0.5 h-4 w-4" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">Start Time</p>
                  <p className="text-muted-foreground text-sm">
                    {format(new Date(data!.startTime), "PPP 'at' p")}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <ClockIcon className="text-muted-foreground mt-0.5 h-4 w-4" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">End Time</p>
                  <p className="text-muted-foreground text-sm">
                    {format(new Date(data!.endTime), "PPP 'at' p")}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPinIcon className="text-muted-foreground mt-0.5 h-4 w-4" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">Location</p>
                  <p className="text-muted-foreground text-sm">
                    {data!.location}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lesson Details */}
          <Card>
            <CardHeader>
              <CardTitle>Lesson Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ClockIcon className="text-muted-foreground h-4 w-4" />
                  <span className="text-sm font-medium">Duration</span>
                </div>
                <span className="text-muted-foreground text-sm">
                  {data!.duration} minutes
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UsersIcon className="text-muted-foreground h-4 w-4" />
                  <span className="text-sm font-medium">Max Capacity</span>
                </div>
                <span className="text-muted-foreground text-sm">
                  {data!.maxCapacity} students
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <SchoolIcon className="text-muted-foreground h-4 w-4" />
                  <span className="text-sm font-medium">Level</span>
                </div>
                <Badge className={getLevelColor(data!.level)} variant="outline">
                  {data!.level}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircleIcon className="text-muted-foreground h-4 w-4" />
                  <span className="text-sm font-medium">Cancellation</span>
                </div>
                <span className="text-muted-foreground text-sm">
                  {data!.cancellationDeadlineHours}h before
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild className="w-full" variant="outline">
                <Link href={`/admin/sessions/${data!.id}/edit`}>
                  <EditIcon className="mr-2 h-4 w-4" />
                  Edit Lesson
                </Link>
              </Button>
              <Button className="w-full" variant="outline">
                <UsersIcon className="mr-2 h-4 w-4" />
                View Bookings
              </Button>
              <Button className="w-full" variant="outline">
                <CalendarIcon className="mr-2 h-4 w-4" />
                Duplicate Lesson
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
