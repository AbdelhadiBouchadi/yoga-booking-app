"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
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
import { FileText, Loader2Icon, SaveIcon, Upload } from "lucide-react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { tryCatch } from "@/hooks/try-catch";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PdfUploader } from "@/components/file-uploader/PdfUploader";
import {
  downloadDocumentSchema,
  DownloadDocumentSchemaType,
} from "@/lib/validator";
import { updateDownloadDocument } from "@/app/data/admin/menu-download-actions";

interface UpdateDocumentFormProps {
  currentDocument?: {
    id: string;
    name: string;
    url: string;
    fileSize?: number | null;
    mimeType?: string | null;
  } | null;
}

export default function UpdateDocumentForm({
  currentDocument,
}: UpdateDocumentFormProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<DownloadDocumentSchemaType>({
    resolver: zodResolver(downloadDocumentSchema),
    defaultValues: {
      name: currentDocument?.name || "",
      url: currentDocument?.url || "",
      fileSize: currentDocument?.fileSize || undefined,
      mimeType: currentDocument?.mimeType || undefined,
    },
  });

  const onSubmit = (values: DownloadDocumentSchemaType) => {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(
        updateDownloadDocument(values),
      );

      if (error) {
        toast.error("An unexpected error occurred");
        return;
      }

      if (result.status === "success") {
        toast.success("Download document updated successfully");
        form.reset();
        router.refresh();
      } else if (result.status === "error") {
        toast.error(result.message);
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Download Document Settings
            </CardTitle>
            <CardDescription>
              Update the PDF document that users can download from the menu
              section
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Document Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter document name (e.g., Menu, Price List)..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    PDF Document
                  </FormLabel>
                  <FormControl>
                    <PdfUploader
                      value={field.value}
                      onValueChange={field.onChange}
                      fileUrl={currentDocument?.url}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {currentDocument && (
              <div className="bg-muted/50 rounded-lg border p-4">
                <h4 className="mb-2 font-medium">Current Document</h4>
                <div className="text-muted-foreground space-y-1 text-sm">
                  <p>
                    <strong>Name:</strong> {currentDocument.name}
                  </p>
                  <p>
                    <strong>File Size:</strong>{" "}
                    {currentDocument.fileSize
                      ? `${Math.round(currentDocument.fileSize / 1024)} KB`
                      : "Unknown"}
                  </p>
                  <p>
                    <strong>Type:</strong> {currentDocument.mimeType || "PDF"}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? (
            <>
              <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
              Updating...
            </>
          ) : (
            <>
              <SaveIcon className="mr-2 h-4 w-4" />
              Update Document
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
