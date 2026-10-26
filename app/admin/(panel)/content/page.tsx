import ContentEditor from "@/components/admin/ContentEditor";
import { getDraft, listForms } from "@/lib/store";

export default function ContentPage() {
  const { content, hasChanges } = getDraft();
  const forms = listForms().map((f) => ({ id: f.id, name: f.name }));
  return <ContentEditor initial={content} initialHasChanges={hasChanges} forms={forms} />;
}
