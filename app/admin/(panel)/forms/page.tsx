import Link from "next/link";
import NewFormButton from "@/components/admin/NewFormButton";
import { Card, PageHeader } from "@/components/admin/ui";
import { formatDateTime } from "@/lib/ranges";
import { getContent, listForms, submissionCounts } from "@/lib/store";

export default function FormsPage() {
  const content = getContent();
  const forms = listForms();
  const counts = submissionCounts();

  return (
    <div>
      <PageHeader
        title="Формы"
        description="Конструктор форм заявок. На лендинге показывается форма, выбранная в «Контент сайта → Регистрация»."
        actions={<NewFormButton />}
      />
      <Card>
        <div className="-m-5 divide-y divide-slate-100">
          {forms.map((f) => (
            <Link key={f.id} href={`/admin/forms/${f.id}`} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-5 py-4 hover:bg-slate-50">
              <span className="font-medium text-slate-900">{f.name}</span>
              {content.registration.formId === f.id && (
                <span className="rounded bg-tgu-brand/10 px-1.5 py-0.5 text-xs font-medium text-tgu-brand">на лендинге</span>
              )}
              <span className="text-sm text-slate-500">{f.schema.fields.length} полей</span>
              <span className="ml-auto text-sm text-slate-500">
                {counts[f.id] ?? 0} заявок · изменена {formatDateTime(f.updatedAt, content.event.utcOffset)}
              </span>
            </Link>
          ))}
          {forms.length === 0 && <p className="px-5 py-8 text-center text-sm text-slate-500">Форм пока нет</p>}
        </div>
      </Card>
    </div>
  );
}
