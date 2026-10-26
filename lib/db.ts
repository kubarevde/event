import "server-only";
import Database from "better-sqlite3";
import fs from "fs";
import path from "path";

export const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), "storage");
export const UPLOADS_DIR = path.join(DATA_DIR, "uploads");

const MIGRATIONS = [
  `CREATE TABLE settings (
     key TEXT PRIMARY KEY,
     value TEXT NOT NULL,
     updated_at INTEGER NOT NULL
   );
   CREATE TABLE forms (
     id TEXT PRIMARY KEY,
     name TEXT NOT NULL,
     schema TEXT NOT NULL,
     created_at INTEGER NOT NULL,
     updated_at INTEGER NOT NULL
   );
   CREATE TABLE submissions (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     form_id TEXT NOT NULL,
     data TEXT NOT NULL,
     status TEXT NOT NULL DEFAULT 'new',
     note TEXT NOT NULL DEFAULT '',
     visitor_id TEXT,
     utm_source TEXT,
     utm_medium TEXT,
     utm_campaign TEXT,
     referrer_host TEXT,
     created_at INTEGER NOT NULL
   );
   CREATE INDEX submissions_form ON submissions(form_id, created_at);
   CREATE TABLE events (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     ts INTEGER NOT NULL,
     type TEXT NOT NULL,
     path TEXT,
     visitor_id TEXT NOT NULL,
     session_id TEXT NOT NULL,
     referrer_host TEXT,
     utm_source TEXT,
     utm_medium TEXT,
     utm_campaign TEXT,
     device TEXT,
     browser TEXT,
     os TEXT,
     meta TEXT
   );
   CREATE INDEX events_ts ON events(ts);
   CREATE INDEX events_type_ts ON events(type, ts);`,
  `ALTER TABLE events ADD COLUMN country TEXT;
   ALTER TABLE events ADD COLUMN region TEXT;
   ALTER TABLE events ADD COLUMN city TEXT;
   ALTER TABLE submissions ADD COLUMN country TEXT;
   ALTER TABLE submissions ADD COLUMN region TEXT;
   ALTER TABLE submissions ADD COLUMN city TEXT;`,
];

function open() {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  const db = new Database(path.join(DATA_DIR, "site.db"));
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  const version = db.pragma("user_version", { simple: true }) as number;
  for (let i = version; i < MIGRATIONS.length; i++) {
    db.transaction(() => {
      db.exec(MIGRATIONS[i]);
      db.pragma(`user_version = ${i + 1}`);
    })();
  }
  return db;
}

const globalForDb = globalThis as unknown as { __siteDb?: Database.Database };

export function getDb(): Database.Database {
  if (!globalForDb.__siteDb) globalForDb.__siteDb = open();
  return globalForDb.__siteDb;
}

export function getSetting<T>(key: string): T | undefined {
  const row = getDb().prepare("SELECT value FROM settings WHERE key = ?").get(key) as
    | { value: string }
    | undefined;
  return row ? (JSON.parse(row.value) as T) : undefined;
}

export function setSetting(key: string, value: unknown) {
  getDb()
    .prepare(
      `INSERT INTO settings (key, value, updated_at) VALUES (?, ?, ?)
       ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`
    )
    .run(key, JSON.stringify(value), Date.now());
}
