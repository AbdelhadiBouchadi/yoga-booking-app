"use client";

import React, { useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon, Plus, Globe2Icon } from "lucide-react";
import { useForm } from "react-hook-form";
import { categorySchema, CategorySchemaType } from "@/lib/validator";
import { tryCatch } from "@/hooks/try-catch";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { createCategory } from "@/app/data/admin/category-actions";

interface CreateCategoryDialogProps {
  children?: React.ReactNode;
  onCategoryAdded?: (newCategory: {
    id: string;
    nameEn: string;
    nameFr: string;
    createdAt: Date;
    updatedAt: Date;
  }) => void;
}

export default function CreateCategoryDialog({
  children,
  onCategoryAdded,
}: CreateCategoryDialogProps) {
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = React.useState(false);

  const form = useForm<CategorySchemaType>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      nameEn: "",
      nameFr: "",
    },
  });

  const onSubmit = (values: CategorySchemaType, e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    startTransition(async () => {
      const { data: result, error } = await tryCatch(createCategory(values));

      if (error) {
        toast.error("An unexpected error occurred");
        return;
      }

      if (result.status === "success") {
        toast.success("Category created successfully");
        form.reset();
        setOpen(false);

        if (onCategoryAdded && result.data) {
          onCategoryAdded(result.data);
        }
      } else if (result.status === "error") {
        toast.error(result.message);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Category
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Globe2Icon className="h-5 w-5" />
            Create New Category
          </DialogTitle>
          <DialogDescription>
            Add a new category for lessons. Fill in both English and French
            details.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit((values) => onSubmit(values, e))(e);
            }}
            className="space-y-6"
          >
            {/* Category Names */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="nameEn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <span className="bg-primary/20 text-primary rounded px-2 py-1 text-xs">
                        EN
                      </span>
                      Name (English)
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter English name..."
                        className="h-11"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="nameFr"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <span className="bg-primary/20 text-primary rounded px-2 py-1 text-xs">
                        FR
                      </span>
                      Name (French)
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Entrez le nom français..."
                        className="h-11"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            {/* Submit Button */}
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Category
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
