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
  const cov = getDb()
    .prepare(
      `SELECT COUNT(*) AS total, SUM(CASE WHEN country IS NOT NULL THEN 1 ELSE 0 END) AS withGeo
       FROM events WHERE type = 'pageview' AND ts >= ?`
    )
    .get(Date.now() - 7 * 86_400_000) as { total: number; withGeo: number | null };
  const geoPct = cov.total ? Math.round(((cov.withGeo ?? 0) / cov.total) * 100) : 100;
  const geoWarning = cov.total >= 10 && geoPct < 50 ? geoPct : null;

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

      {geoWarning && (
        <p className="mb-4 rounded-md border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm text-amber-800">
          География определилась только у {geoWarning}% визитов за последние 7 дней. Скорее всего, до сайта не доходит
          реальный IP посетителей —{" "}
          <Link href="/admin/diagnostics" className="font-medium underline">
            откройте диагностику
          </Link>
          .
        </p>
      )}

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

      <div className="mt-6 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        <Card title="Города" className="xl:col-span-1">
          {s.cities.length === 0 ? (
            <p className="py-4 text-sm text-slate-400">Нет данных. Город определяется по IP посетителя.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-slate-500">
                  <th className="pb-2 font-medium">Город</th>
                  <th className="pb-2 text-right font-medium">Посетители</th>
                  <th className="pb-2 text-right font-medium">Заявки</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {s.cities.map((c) => (
                  <tr key={c.label}>
                    <td className="py-1.5 text-slate-700">{c.label}</td>
                    <td className="py-1.5 text-right tabular-nums text-slate-900">{c.visitors}</td>
                    <td className="py-1.5 text-right tabular-nums text-slate-900">{c.submissions || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
        <Card title="Регионы">
          <BarList items={s.regions} empty="Нет данных" />
        </Card>
        <Card title="Страны">
          <BarList items={s.countries} empty="Нет данных" />
        </Card>
      </div>
      <p className="mt-2 text-xs text-slate-400">
        Город и регион определяются по IP (точность по городу около 70–80%). IP-адреса не сохраняются.{" "}
        <a href="https://db-ip.com" target="_blank" rel="noopener noreferrer" className="underline">
          IP Geolocation by DB-IP
        </a>
      </p>

      <Card title="Активность по часам (время площадки)" className="mt-6">
        <HourStrip hours={s.hours} />
      </Card>
    </div>
  );
}
