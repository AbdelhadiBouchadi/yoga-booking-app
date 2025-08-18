import { getActiveDownloadDocument } from "@/app/data/admin/menu-download-actions";
import UpdateDocumentForm from "@/components/admin/menu-document/UpdateDocumentForm";

export default async function DownloadDocumentPage() {
  const currentDocument = await getActiveDownloadDocument();

  return (
    <div className="container mx-auto max-w-2xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Download Document Management</h1>
        <p className="text-muted-foreground mt-2">
          Manage the PDF document that appears in your download menu section
        </p>
      </div>

      <UpdateDocumentForm currentDocument={currentDocument} />
    </div>
  );
}
