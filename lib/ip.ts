import net from "net";
import type { NextRequest } from "next/server";

// Определение IP посетителя за цепочкой WAF → nginx → Docker.

/** Заголовки, в которых разные WAF и CDN передают адрес клиента одним значением. */
export const CLIENT_IP_HEADERS = ["cf-connecting-ip", "true-client-ip", "x-client-ip", "x-original-client-ip"];

/** "::ffff:1.2.3.4", "1.2.3.4:5678", "[2001:db8::1]:443" → чистый адрес; мусор → null. */
export function normalizeIp(raw: string | null | undefined): string | null {
  if (!raw) return null;
  let v = raw.trim().replace(/^"|"$/g, "");
  const bracket = /^\[([^\]]+)\](?::\d+)?$/.exec(v);
  if (bracket) v = bracket[1];
  else if (/^\d+\.\d+\.\d+\.\d+:\d+$/.test(v)) v = v.replace(/:\d+$/, "");
  v = v.replace(/^::ffff:/i, "");
  return net.isIP(v) ? v : null;
}

export function isPrivateIp(ip: string) {
  return (
    /^(10\.|127\.|192\.168\.|169\.254\.|0\.)/.test(ip) ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(ip) ||
    /^100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\./.test(ip) ||
    /^(::1?$|fc|fd|fe80:)/i.test(ip)
  );
}

export interface IpCandidate {
  source: string;
  ip: string;
  public: boolean;
}

/** Все адреса из заголовков запроса в порядке приоритета. */
export function ipCandidates(req: Pick<NextRequest, "headers">): IpCandidate[] {
  const out: IpCandidate[] = [];
  const add = (source: string, raw: string | null) => {
    for (const part of (raw ?? "").split(",")) {
      const ip = normalizeIp(part);
      if (ip) out.push({ source, ip, public: !isPrivateIp(ip) });
    }
  };
  // Свой заголовок WAF (CLIENT_IP_HEADER) — первым. X-Real-IP часто содержит адрес самого WAF
  // (если в nginx не настроен real_ip), поэтому он проверяется последним.
  const custom = process.env.CLIENT_IP_HEADER?.trim().toLowerCase();
  const generic = ["x-forwarded-for", "x-real-ip"];
  if (custom && !generic.includes(custom)) add(custom, req.headers.get(custom));
  for (const h of CLIENT_IP_HEADERS) if (h !== custom) add(h, req.headers.get(h));
  // X-Forwarded-For: слева — исходный клиент, правее — прокси (WAF, nginx)
  add("x-forwarded-for", req.headers.get("x-forwarded-for"));
  add("x-real-ip", req.headers.get("x-real-ip"));
  return out;
}

/** IP посетителя: первый публичный адрес по приоритету. Внутренние адреса (WAF по частной сети,
 *  шлюз Docker, сам nginx) пропускаются — по ним город не определить. */
export function resolveClientIp(req: Pick<NextRequest, "headers">): { ip: string; source: string | null } {
  const all = ipCandidates(req);
  const best = all.find((c) => c.public) ?? all[0];
  return best ? { ip: best.ip, source: best.source } : { ip: "unknown", source: null };
}
