import SubmissionsTable, { type Row } from "@/components/admin/SubmissionsTable";
import { PageHeader } from "@/components/admin/ui";
import { formatDateTime, resolveRange } from "@/lib/ranges";
import { getContent, listForms, listSubmissions } from "@/lib/store";

type SP = Promise<{ form?: string; status?: string; range?: string }>;

export default async function SubmissionsPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const { utcOffset } = getContent().event;
  const forms = listForms();
  const names = new Map(forms.map((f) => [f.id, f.name]));
  const range = sp.range ? resolveRange({ range: sp.range }, utcOffset) : null;

  const rows: Row[] = listSubmissions({
    formId: sp.form || undefined,
    status: sp.status || undefined,
    from: range?.from,
    to: range?.to,
  }).map((s) => ({
    id: s.id,
    formId: s.formId,
    formName: names.get(s.formId) ?? "—",
    date: formatDateTime(s.createdAt, utcOffset),
    status: s.status,
    note: s.note,
    data: s.data,
    source: [s.utmSource && `utm: ${[s.utmSource, s.utmMedium, s.utmCampaign].filter(Boolean).join(" / ")}`, s.referrerHost]
      .filter(Boolean)
      .join(" · "),
  }));

  return (
    <div>
      <PageHeader title="Заявки" description="Нажмите на строку, чтобы увидеть все ответы и оставить комментарий." />
      <SubmissionsTable
        key={JSON.stringify(sp)}
        rows={rows}
        forms={forms.map((f) => ({ id: f.id, name: f.name, fields: f.schema.fields }))}
        filters={{ form: sp.form ?? "", status: sp.status ?? "", range: sp.range ?? "" }}
      />
    </div>
  );
}
