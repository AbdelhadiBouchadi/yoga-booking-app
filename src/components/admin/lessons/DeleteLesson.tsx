"use client";

import { deleteLesson } from "@/app/admin/sessions/actions";
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
import { Loader2Icon, Trash2Icon, XIcon } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

interface DeleteLessonProps {
  lessonId: string;
}

export function DeleteLesson({ lessonId }: DeleteLessonProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();

  async function onSubmit() {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(deleteLesson(lessonId));

      if (error) {
        toast.error("An unexpected error occured");
        return;
      }

      if (result.status === "success") {
        toast.success("Lesson deleted successfully");

        setOpen(false);
      } else if (result.status === "error") {
        toast.error(result.message);
        setOpen(false);
      }
    });
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <Trash2Icon />
          Delete Workshop
        </DropdownMenuItem>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure ?</AlertDialogTitle>
          <AlertDialogDescription>
            This action is irreversible . If you delete the workshop , you will
            lose all its data forever
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            Cancel
            <XIcon />
          </AlertDialogCancel>
          <Button
            variant="destructive"
            className="bg-destructive/30"
            onClick={onSubmit}
            disabled={isPending}
          >
            {isPending ? (
              <>
                Deleting
                <Loader2Icon className="animate-spin" />
              </>
            ) : (
              <>
                Delete
                <Trash2Icon />
              </>
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
