import { AdminLessonType } from "@/app/data/admin/get-admin-lessons";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  EyeIcon,
  MoreVerticalIcon,
  PencilLineIcon,
  SchoolIcon,
  TimerIcon,
  Trash2Icon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface AdminLessonCardProps {
  data: AdminLessonType;
}

export function AdminLessonCard({ data }: AdminLessonCardProps) {
  return (
    <Card className="group relative gap-0 py-0">
      {/* Absolute Dropdown */}
      <div className="absolute top-2 right-2 z-10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon">
              <MoreVerticalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/admin/sessions/${data.id}/edit`}>
                <PencilLineIcon />
                Edit Lesson
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/admin/sessions/${data.id}`}>
                <EyeIcon />
                Preview Lesson
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Trash2Icon />
              Delete Lesson
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Image
        src={data.imageUrl}
        alt="Thumbnail Image"
        width={600}
        height={400}
        className="aspect-video h-full w-full rounded-t-lg object-cover"
      />

      <CardContent className="p-4">
        <Link
          href={`/admin/sessions/${data.id}`}
          className="group-hover:text-primary line-clamp-2 w-fit text-lg font-medium transition-colors hover:underline"
        >
          {data.titleEn}
        </Link>

        <p className="text-muted-foreground mt-2 line-clamp-2 text-sm leading-tight">
          {data.shortDescriptionEn}
        </p>

        <div className="mt-4 flex items-center gap-x-5">
          <div className="flex items-center gap-x-2">
            <TimerIcon className="text-primary bg-primary/10 size-6 rounded-md p-1" />
            <p className="text-muted-foreground text-sm">
              {data.duration} minutes
            </p>
          </div>
          <div className="flex items-center gap-x-2">
            <SchoolIcon className="text-primary bg-primary/10 size-6 rounded-md p-1" />
            <p className="text-muted-foreground text-sm">{data.level}</p>
          </div>
        </div>

        <Button asChild className="mt-4 w-full">
          <Link href={`/admin/sessions/${data.id}/edit`}>
            Edit Course
            <PencilLineIcon />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
