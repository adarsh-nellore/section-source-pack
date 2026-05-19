import { redirect } from "next/navigation";

export default async function SectionDeepLinkPage({
  params,
  searchParams,
}: {
  params: Promise<{ submissionId: string; documentId: string; sectionId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { submissionId, documentId, sectionId } = await params;
  const sp = await searchParams;
  const qs = new URLSearchParams();
  Object.entries(sp).forEach(([k, v]) => {
    if (typeof v === "string") qs.set(k, v);
  });
  qs.set("section", sectionId);
  qs.delete("pack");
  const q = qs.toString();
  redirect(`/submissions/${submissionId}/documents/${documentId}?${q}`);
}
