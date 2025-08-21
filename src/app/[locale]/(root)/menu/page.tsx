import { getActiveDownloadDocument } from "@/app/data/admin/menu-download-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, FileText } from "lucide-react";
import Link from "next/link";

export default async function MenuPage() {
  const document = await getActiveDownloadDocument();

  if (!document) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <Card className="mx-4 w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-8 text-center">
            <FileText className="text-muted-foreground mb-4 h-16 w-16" />
            <h1 className="mb-2 text-2xl font-semibold">No Menu Available</h1>
            <p className="text-muted-foreground mb-6">
              The menu document is currently not available. Please check back
              later.
            </p>
            <Button asChild>
              <Link href="/">Return Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="bg-background container min-h-screen">
      {/* Header */}
      <div className="bg-card border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="text-primary h-6 w-6" />
              <div>
                <h1 className="text-xl font-semibold">{document.name}</h1>
                {document.description && (
                  <p className="text-muted-foreground text-sm">
                    {document.description}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button asChild variant="outline" size="sm">
                <Link href="/">Back to Home</Link>
              </Button>
              <Button asChild size="sm">
                <a
                  href={document.url}
                  download={document.name}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="mx-auto px-4 py-6">
        <div className="bg-card h-[calc(100vh-140px)] w-full overflow-hidden rounded-lg border">
          <iframe
            src={`${document.url}#toolbar=1&navpanes=1&scrollbar=1`}
            className="h-full w-full"
            title={document.name}
            style={{ border: "none" }}
          />
        </div>
      </div>
    </div>
  );
}
