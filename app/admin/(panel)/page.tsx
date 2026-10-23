import { Download } from "lucide-react";
import Link from "next/link";
import { BarList, DailyBars, HourStrip } from "@/components/admin/Charts";
import { Card, PageHeader, btnCls } from "@/components/admin/ui";
import { getStats } from "@/lib/analytics";
import { utcOffsetMinutes } from "@/lib/content";
import { getDb } from "@/lib/db";
import { RANGE_OPTIONS, resolveRange } from "@/lib/ranges";
import { getContent } from "@/lib/store";

type SP = Promise<{ range?: string }>;

function Tile({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 font-heading text-2xl font-semibold tabular-nums text-slate-900">{value}</p>
      {hint && <p className="mt-0.5 text-xs text-slate-400">{hint}</p>}
    </div>
  );
}

const pct = (a: number, b: number) => (b ? `${((a / b) * 100).toFixed(1)}%` : "—");

export default async function DashboardPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const { utcOffset } = getContent().event;
  const earliest = (getDb().prepare("SELECT MIN(ts) AS t FROM events").get() as { t: number | null }).t ?? undefined;
  const range = resolveRange({ range: sp.range ?? "30" }, utcOffset, earliest);
  const s = getStats(range.from, range.to, utcOffsetMinutes(utcOffset));
  const t = s.totals;

  return (
    <div>
      <PageHeader
        title="Статистика"
        description="Собственная аналитика сайта: без внешних счётчиков, боты и администратор не учитываются."
        actions={
          <>
            <div className="flex rounded-md border border-slate-300 bg-white p-0.5">
              {RANGE_OPTIONS.map((r) => (
                <Link
                  key={r.value}
                  href={`/admin?range=${r.value}`}
                  className={`rounded px-3 py-1.5 text-sm ${
                    range.key === r.value ? "bg-tgu-brand text-white" : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {r.label}
                </Link>
              ))}
            </div>
            <a href={`/api/admin/stats/export?range=${range.key}`} className={btnCls.secondary}>
              <Download className="h-4 w-4" />
              Отчёт CSV
            </a>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <Tile label="Посетители" value={t.visitors} hint="уникальные" />
        <Tile label="Визиты" value={t.sessions} />
        <Tile label="Просмотры" value={t.pageviews} />
        <Tile label="Заявки" value={t.submissions} />
        <Tile label="Конверсия в заявку" value={pct(t.submissions, t.visitors)} hint="от посетителей" />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Card title="Посетители по дням">
          <DailyBars data={s.days.map((d) => ({ day: d.day, value: d.visitors }))} label="посетители" />
        </Card>
        <Card title="Заявки по дням">
          <DailyBars data={s.days.map((d) => ({ day: d.day, value: d.submissions }))} label="заявки" />
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        <Card title="Воронка">
          <BarList
            items={[
              { label: "Визиты", value: t.sessions, hint: "100%" },
              { label: "Нажали «Подать заявку»", value: t.ctaClicks, hint: pct(t.ctaClicks, t.sessions) },
              { label: "Долистали до формы", value: t.formViews, hint: pct(t.formViews, t.sessions) },
              { label: "Начали заполнять", value: t.formStarts, hint: pct(t.formStarts, t.sessions) },
              { label: "Отправили заявку", value: t.submissions, hint: pct(t.submissions, t.sessions) },
            ]}
          />
        </Card>
        <Card title="Источники переходов">
          <BarList items={s.referrers} />
        </Card>
        <Card title="UTM-метки (source / medium / campaign)">
          <BarList items={s.utm} empty="Переходов по ссылкам с UTM-метками не было" />
        </Card>
        <Card title="Устройства">
          <BarList items={s.devices} />
        </Card>
        <Card title="Браузеры">
          <BarList items={s.browsers} />
        </Card>
        <Card title="Операционные системы">
          <BarList items={s.os} />
        </Card>
      </div>

      <Card title="Активность по часам (время площадки)" className="mt-6">
        <HourStrip hours={s.hours} />
      </Card>
    </div>
  );
}
