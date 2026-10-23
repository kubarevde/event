import { notFound } from "next/navigation";
import FormBuilder from "@/components/admin/FormBuilder";
import { getContent, getForm, submissionCounts } from "@/lib/store";

export default async function FormPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const form = getForm(id);
  if (!form) notFound();
  return (
    <FormBuilder
      key={form.id}
      id={form.id}
      initialName={form.name}
      initialSchema={form.schema}
      isLanding={getContent().registration.formId === form.id}
      submissionCount={submissionCounts()[form.id] ?? 0}
    />
  );
}
