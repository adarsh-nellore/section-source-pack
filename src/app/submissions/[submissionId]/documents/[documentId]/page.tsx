import { Suspense } from "react";
import { DocumentWorkspace } from "@/components/screens/document-workspace/DocumentWorkspace";

function DocumentPageInner({
  params,
}: {
  params: { submissionId: string; documentId: string };
}) {
  return (
    <DocumentWorkspace
      submissionId={params.submissionId}
      documentId={params.documentId}
    />
  );
}

export default async function DocumentWorkspacePage({
  params,
}: {
  params: Promise<{ submissionId: string; documentId: string }>;
}) {
  const resolved = await params;
  return (
    <Suspense fallback={null}>
      <DocumentPageInner params={resolved} />
    </Suspense>
  );
}
