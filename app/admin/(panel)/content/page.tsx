import ContentEditor from "@/components/admin/ContentEditor";
import { getContent, listForms } from "@/lib/store";

export default function ContentPage() {
  const content = getContent();
  const forms = listForms().map((f) => ({ id: f.id, name: f.name }));
  return <ContentEditor initial={content} forms={forms} />;
}
