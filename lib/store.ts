import "server-only";
import { randomUUID } from "crypto";
import { DEFAULT_CONTENT, mergeWithDefaults, type SiteContent } from "./content";
import { getDb, getSetting, setSetting } from "./db";
import { defaultFormSchema, type FormRecord, type FormSchema, type SubmissionValue } from "./forms";

// ---------- Контент ----------

export function getContent(): SiteContent {
  const saved = getSetting<unknown>("content");
  const content = mergeWithDefaults(DEFAULT_CONTENT, saved);
  // При первом запуске создаём форму заявки и привязываем её к лендингу.
  if (!content.registration.formId) {
    const forms = listForms();
    const form = forms[0] ?? createForm("Заявка на участие", defaultFormSchema(content.event.privacyPolicyUrl));
    content.registration.formId = form.id;
    setSetting("content", content);
  }
  return content;
}

export function saveContent(content: SiteContent) {
  setSetting("content", mergeWithDefaults(DEFAULT_CONTENT, content));
}

// ---------- Формы ----------

type FormRow = { id: string; name: string; schema: string; created_at: number; updated_at: number };

function toForm(row: FormRow): FormRecord {
  return {
    id: row.id,
    name: row.name,
    schema: JSON.parse(row.schema) as FormSchema,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function listForms(): FormRecord[] {
  const rows = getDb().prepare("SELECT * FROM forms ORDER BY created_at").all() as FormRow[];
  return rows.map(toForm);
}

export function getForm(id: string): FormRecord | undefined {
  const row = getDb().prepare("SELECT * FROM forms WHERE id = ?").get(id) as FormRow | undefined;
  return row ? toForm(row) : undefined;
}

export function createForm(name: string, schema: FormSchema): FormRecord {
  const now = Date.now();
  const id = randomUUID().slice(0, 8);
  getDb()
    .prepare("INSERT INTO forms (id, name, schema, created_at, updated_at) VALUES (?, ?, ?, ?, ?)")
    .run(id, name, JSON.stringify(schema), now, now);
  return getForm(id)!;
}

export function updateForm(id: string, name: string, schema: FormSchema) {
  getDb()
    .prepare("UPDATE forms SET name = ?, schema = ?, updated_at = ? WHERE id = ?")
    .run(name, JSON.stringify(schema), Date.now(), id);
}

export function deleteForm(id: string) {
  const db = getDb();
  db.transaction(() => {
    db.prepare("DELETE FROM submissions WHERE form_id = ?").run(id);
    db.prepare("DELETE FROM forms WHERE id = ?").run(id);
  })();
}

export function submissionCounts(): Record<string, number> {
  const rows = getDb()
    .prepare("SELECT form_id, COUNT(*) AS n FROM submissions GROUP BY form_id")
    .all() as { form_id: string; n: number }[];
  return Object.fromEntries(rows.map((r) => [r.form_id, r.n]));
}

// ---------- Заявки ----------

export interface Submission {
  id: number;
  formId: string;
  data: Record<string, SubmissionValue>;
  status: string;
  note: string;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  referrerHost: string | null;
  createdAt: number;
}

type SubmissionRow = {
  id: number;
  form_id: string;
  data: string;
  status: string;
  note: string;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  referrer_host: string | null;
  created_at: number;
};

function toSubmission(row: SubmissionRow): Submission {
  return {
    id: row.id,
    formId: row.form_id,
    data: JSON.parse(row.data),
    status: row.status,
    note: row.note,
    utmSource: row.utm_source,
    utmMedium: row.utm_medium,
    utmCampaign: row.utm_campaign,
    referrerHost: row.referrer_host,
    createdAt: row.created_at,
  };
}

export function listSubmissions(filter: { formId?: string; status?: string; from?: number; to?: number }) {
  const where: string[] = [];
  const args: (string | number)[] = [];
  if (filter.formId) {
    where.push("form_id = ?");
    args.push(filter.formId);
  }
  if (filter.status) {
    where.push("status = ?");
    args.push(filter.status);
  }
  if (filter.from) {
    where.push("created_at >= ?");
    args.push(filter.from);
  }
  if (filter.to) {
    where.push("created_at < ?");
    args.push(filter.to);
  }
  const sql = `SELECT * FROM submissions ${where.length ? `WHERE ${where.join(" AND ")}` : ""} ORDER BY created_at DESC`;
  return (getDb().prepare(sql).all(...args) as SubmissionRow[]).map(toSubmission);
}

export function createSubmission(input: {
  formId: string;
  data: Record<string, SubmissionValue>;
  visitorId: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  referrerHost: string | null;
}) {
  getDb()
    .prepare(
      `INSERT INTO submissions (form_id, data, visitor_id, utm_source, utm_medium, utm_campaign, referrer_host, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      input.formId,
      JSON.stringify(input.data),
      input.visitorId,
      input.utmSource,
      input.utmMedium,
      input.utmCampaign,
      input.referrerHost,
      Date.now()
    );
}

export function updateSubmission(id: number, patch: { status?: string; note?: string }) {
  const db = getDb();
  if (patch.status !== undefined) db.prepare("UPDATE submissions SET status = ? WHERE id = ?").run(patch.status, id);
  if (patch.note !== undefined) db.prepare("UPDATE submissions SET note = ? WHERE id = ?").run(patch.note, id);
}

export function deleteSubmission(id: number) {
  getDb().prepare("DELETE FROM submissions WHERE id = ?").run(id);
}
