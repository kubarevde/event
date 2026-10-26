import "server-only";
import fs from "fs";
import net from "net";
import path from "path";
import { Reader, type Response } from "maxmind";
import { RU_CITIES, RU_REGIONS } from "./geo-names";
import { isPrivateIp } from "./ip";

// Город и регион по IP из офлайн-базы DB-IP Lite (CC BY 4.0, https://db-ip.com).
// Сам IP не сохраняется — только страна, регион и город.

export interface Geo {
  country: string | null;
  region: string | null;
  city: string | null;
}

type DbipRecord = Response & { city?: string; country_code?: string; state1?: string };

const GEO_DIR =
  process.env.GEOIP_DIR || path.join(process.cwd(), "node_modules", "@ip-location-db", "dbip-city-mmdb");

const readers: { v4?: Reader<DbipRecord> | null; v6?: Reader<DbipRecord> | null } = {};

function reader(family: "v4" | "v6") {
  if (readers[family] === undefined) {
    try {
      const file = path.join(GEO_DIR, `dbip-city-ip${family}.mmdb`);
      readers[family] = new Reader<DbipRecord>(fs.readFileSync(file));
    } catch (e) {
      readers[family] = null; // базы нет (например, при локальной разработке) — география просто не пишется
      console.warn(`[geo] база ${family} не загружена из ${GEO_DIR}:`, (e as Error).message);
    }
  }
  return readers[family];
}

const countryNames = new Intl.DisplayNames(["ru"], { type: "region" });

function regionKey(name: string) {
  // Названия, которые после нормализации совпали бы с другим регионом
  if (/moscow (oblast|region)|moskovskaya/i.test(name)) return "moscow oblast-special";
  if (/altai (krai|kray)|altayskiy/i.test(name)) return "altai krai-special";
  return name
    .toLowerCase()
    .replace(/\(.*?\)/g, " ")
    .replace(/[’'`]/g, "")
    .replace(/–/g, "-")
    .replace(/[^a-z\s-]/g, " ")
    .replace(/\b(oblast|krai|kray|republic|of|the|autonomous|okrug|district|region|city|federal|territory)\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const EMPTY: Geo = { country: null, region: null, city: null };

export function lookupGeo(ip: string): Geo {
  const family = net.isIP(ip);
  if (!family || isPrivateIp(ip)) return EMPTY;
  const rec = reader(family === 4 ? "v4" : "v6")?.get(ip);
  if (!rec?.country_code) return EMPTY;

  let country: string | null = rec.country_code;
  try {
    country = countryNames.of(rec.country_code) ?? rec.country_code;
  } catch {
    // неизвестный код страны — оставляем как есть
  }
  const ru = rec.country_code === "RU";
  const cityRaw = rec.city?.replace(/\s*\(.*\)$/, "").replace(/[’']/g, "").trim() || null;
  const regionRaw = rec.state1?.trim() || null;
  return {
    country,
    region: regionRaw ? (ru ? RU_REGIONS[regionKey(regionRaw)] : undefined) ?? regionRaw : null,
    city: cityRaw ? (ru ? RU_CITIES[cityRaw] : undefined) ?? cityRaw : null,
  };
}


/** Состояние базы для страницы диагностики. */
export function geoStatus() {
  return (["v4", "v6"] as const).map((family) => {
    const file = path.join(GEO_DIR, `dbip-city-ip${family}.mmdb`);
    let size = 0;
    try {
      size = fs.statSync(file).size;
    } catch {
      // нет файла
    }
    return { family, file, size, loaded: size > 0 && reader(family) !== null };
  });
}
