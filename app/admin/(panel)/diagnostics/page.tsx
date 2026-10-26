import { headers } from "next/headers";
import { Card, PageHeader } from "@/components/admin/ui";
import { getDb } from "@/lib/db";
import { geoStatus, lookupGeo } from "@/lib/geo";
import { ipCandidates, resolveClientIp } from "@/lib/ip";

export const dynamic = "force-dynamic";

function Ok({ ok, children }: { ok: boolean; children: React.ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ${ok ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
      {ok ? "✓" : "✕"} {children}
    </span>
  );
}

export default async function DiagnosticsPage() {
  const h = await headers();
  const req = { headers: h } as Parameters<typeof resolveClientIp>[0];
  const resolved = resolveClientIp(req);
  const candidates = ipCandidates(req);
  const geo = lookupGeo(resolved.ip);
  const db = geoStatus();
  const rawHeaders = [...h.entries()].filter(([k]) => /ip|forward|client|real|via/i.test(k));

  const since = Date.now() - 7 * 86_400_000;
  const coverage = getDb()
    .prepare(
      `SELECT COUNT(*) AS total, SUM(CASE WHEN country IS NOT NULL THEN 1 ELSE 0 END) AS withGeo
       FROM events WHERE type = 'pageview' AND ts >= ?`
    )
    .get(since) as { total: number; withGeo: number | null };
  const withGeo = coverage.withGeo ?? 0;
  const pct = coverage.total ? Math.round((withGeo / coverage.total) * 100) : 0;
  const customHeader = process.env.CLIENT_IP_HEADER || "";

  return (
    <div className="max-w-4xl">
      <PageHeader
        title="Диагностика"
        description="Проверка определения IP и географии. Данные ниже — для вашего текущего запроса: он прошёл ту же цепочку WAF → nginx → сайт, что и запросы посетителей."
      />

      <div className="grid gap-6">
        <Card title="Итог">
          <dl className="grid gap-3 text-sm sm:grid-cols-[220px_1fr]">
            <dt className="text-slate-500">Ваш IP, как его видит сайт</dt>
            <dd className="font-mono">
              {resolved.ip} {resolved.source && <span className="text-slate-400">(из {resolved.source})</span>}
            </dd>
            <dt className="text-slate-500">География по этому IP</dt>
            <dd>
              {geo.country ? (
                [geo.city, geo.region, geo.country].filter(Boolean).join(", ")
              ) : (
                <Ok ok={false}>не определена</Ok>
              )}
            </dd>
            <dt className="text-slate-500">Визиты с географией за 7 дней</dt>
            <dd>
              {withGeo} из {coverage.total} ({pct}%)
            </dd>
            <dt className="text-slate-500">База городов</dt>
            <dd className="flex flex-wrap gap-2">
              {db.map((d) => (
                <Ok key={d.family} ok={d.loaded}>
                  IP{d.family} {d.loaded ? `${Math.round(d.size / 1e6)} МБ` : `нет файла ${d.file}`}
                </Ok>
              ))}
            </dd>
            <dt className="text-slate-500">CLIENT_IP_HEADER</dt>
            <dd className="font-mono">{customHeader || "не задан"}</dd>
          </dl>
        </Card>

        <Card title="Адреса, найденные в заголовках (в порядке проверки)">
          {candidates.length === 0 ? (
            <p className="text-sm text-red-700">
              Ни в одном заголовке нет IP-адреса. Скорее всего, nginx не передаёт заголовки: добавьте в его конфиг
              <code className="mx-1 rounded bg-slate-100 px-1">proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;</code>
            </p>
          ) : (
            <table className="w-full text-sm">
              <thead className="text-left text-xs text-slate-500">
                <tr>
                  <th className="pb-2 font-medium">Заголовок</th>
                  <th className="pb-2 font-medium">Адрес</th>
                  <th className="pb-2 font-medium">Тип</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {candidates.map((c, i) => (
                  <tr key={i} className={c.ip === resolved.ip && c.source === resolved.source ? "bg-emerald-50/60" : ""}>
                    <td className="py-1.5 font-mono text-xs">{c.source}</td>
                    <td className="py-1.5 font-mono text-xs">{c.ip}</td>
                    <td className="py-1.5 text-xs">{c.public ? "публичный" : "внутренний — пропускается"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <p className="mt-3 text-xs text-slate-500">
            Сайт берёт первый публичный адрес. Если выбран адрес WAF, а не ваш, узнайте у провайдера WAF, в каком заголовке
            он передаёт IP клиента, и укажите его в .env: <code className="rounded bg-slate-100 px-1">CLIENT_IP_HEADER=имя-заголовка</code>.
          </p>
        </Card>

        <Card title="Заголовки запроса, связанные с IP">
          {rawHeaders.length === 0 ? (
            <p className="text-sm text-slate-500">Таких заголовков нет.</p>
          ) : (
            <pre className="overflow-x-auto rounded-md bg-slate-900 p-3 text-xs text-slate-100">
              {rawHeaders.map(([k, v]) => `${k}: ${v}`).join("\n")}
            </pre>
          )}
        </Card>
      </div>
    </div>
  );
}
