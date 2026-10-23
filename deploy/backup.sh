#!/bin/sh
# Бэкап данных сайта (база, заявки, статистика, картинки) в ./backups/site-ДАТА.tar.gz
# Сайт при этом не останавливается.
set -e
cd "$(dirname "$0")/.."
mkdir -p backups
FILE="backups/site-$(date +%Y%m%d-%H%M%S).tar.gz"
docker compose exec -T app sh -c '
  set -e
  rm -rf /tmp/backup && mkdir -p /tmp/backup
  node -e "require(\"better-sqlite3\")(\"/app/storage/site.db\").backup(\"/tmp/backup/site.db\").then(() => {})"
  cp -r /app/storage/uploads /tmp/backup/
  tar -czf - -C /tmp/backup .
  rm -rf /tmp/backup
' > "$FILE"
echo "Готово: $FILE"
