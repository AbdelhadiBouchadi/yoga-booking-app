"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { tryCatch } from "@/hooks/try-catch";
import { CopyPlusIcon, Loader2Icon, XIcon } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { duplicateLessonForNextWeek } from "@/app/admin/sessions/[sessionId]/edit/actions";

interface DuplicateLessonProps {
  lessonId: string;
  triggerType?: "menu-item" | "button";
}

export function DuplicateLesson({
  lessonId,
  triggerType = "menu-item",
}: DuplicateLessonProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  async function onSubmit() {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(
        duplicateLessonForNextWeek(lessonId),
      );

      if (error) {
        toast.error("An unexpected error occurred");
        return;
      }

      if (result.status === "success") {
        toast.success(result.message);
        setOpen(false);
        // Redirect to sessions page after duplicating from the edit form
        if (triggerType === "button") {
          router.push("/admin/sessions");
        }
      } else if (result.status === "error") {
        toast.error(result.message);
        setOpen(false);
      }
    });
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        {/* Render differently based on the prop! */}
        {triggerType === "menu-item" ? (
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <CopyPlusIcon className="mr-2 h-4 w-4" />
            Move to Next Week
          </DropdownMenuItem>
        ) : (
          <Button variant="outline" type="button" className="w-full">
            <CopyPlusIcon className="mr-2 h-4 w-4" />
            Duplicate for Next Week
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Duplicate for next week?</AlertDialogTitle>
          <AlertDialogDescription>
            This will archive the current session, mark its active bookings as
            completed, and create a fresh session with zero bookings scheduled
            for exactly 7 days from now.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            Cancel
            <XIcon className="ml-2 h-4 w-4" />
          </AlertDialogCancel>
          <Button onClick={onSubmit} disabled={isPending}>
            {isPending ? (
              <>
                Duplicating
                <Loader2Icon className="ml-2 h-4 w-4 animate-spin" />
              </>
            ) : (
              <>
                Confirm
                <CopyPlusIcon className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
