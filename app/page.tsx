import { cookies } from "next/headers";
import Landing from "@/components/site/Landing";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";
import { getContent, getDraft, listForms } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function Home({ searchParams }: { searchParams: Promise<{ edit?: string }> }) {
  const isAdmin = await verifySessionToken((await cookies()).get(SESSION_COOKIE)?.value);
  const editing = isAdmin && (await searchParams).edit === "1";
  const draft = editing ? getDraft() : null;
  const content = draft ? draft.content : getContent();
  const forms = listForms().map((f) => ({ id: f.id, name: f.name, schema: f.schema }));

  return (
    <Landing
      content={content}
      editing={editing}
      hasChanges={draft?.hasChanges ?? false}
      forms={forms}
      isAdmin={isAdmin}
    />
  );
}
