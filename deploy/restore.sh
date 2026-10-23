#!/bin/sh
# Восстановление данных сайта из архива: ./deploy/restore.sh backups/site-....tar.gz
set -e
cd "$(dirname "$0")/.."
[ -f "$1" ] || { echo "Укажите файл бэкапа"; exit 1; }
docker compose stop app
docker compose run --rm --no-deps -T --entrypoint sh app -c \
  "rm -rf /app/storage/* && tar -xzf - -C /app/storage" < "$1"
docker compose start app
echo "Данные восстановлены из $1"
