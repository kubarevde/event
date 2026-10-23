#!/bin/sh
# Собирает архив для сервера без доступа к GitHub: образ + docker-compose + скрипты.
# На сервере: tar -xzf event-bundle.tar.gz && cd event && docker load -i images.tar && docker compose up -d --no-build
set -e
cd "$(dirname "$0")/.."
PLATFORM="${PLATFORM:-linux/amd64}"
docker build --platform "$PLATFORM" -t event-landing:latest .
rm -rf dist && mkdir -p dist/event/deploy
docker save event-landing:latest -o dist/event/images.tar
cp docker-compose.yml .env.example dist/event/
cp deploy/backup.sh deploy/restore.sh dist/event/deploy/
tar -czf event-bundle.tar.gz -C dist event
rm -rf dist
echo "Готово: event-bundle.tar.gz"
