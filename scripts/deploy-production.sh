#!/usr/bin/env sh
set -eu

COMPOSE_FILE="docker-compose.production.yml"
ENV_FILE=".env.production"
HEALTH_URL="http://127.0.0.1:3001/api/health"

if [ ! -f "$ENV_FILE" ]; then
  echo "Missing $ENV_FILE. Copy .env.production.example and set production secrets."
  exit 1
fi

git pull --ff-only origin main

OLD_IMAGE="$(docker inspect --format='{{.Image}}' batumtech-app 2>/dev/null || true)"

docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" build app
docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" up -d postgres
docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" up -d --no-deps app

attempt=1
while [ "$attempt" -le 20 ]; do
  if curl --fail --silent --show-error "$HEALTH_URL" >/dev/null; then
    echo "Deployment healthy."
    docker image prune -f --filter "until=168h"
    exit 0
  fi
  sleep 3
  attempt=$((attempt + 1))
done

echo "Health check failed."
docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" logs --tail=100 app

if [ -n "$OLD_IMAGE" ]; then
  echo "Rolling back to previous application image."
  docker tag "$OLD_IMAGE" batumtech-web:current
  docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" up -d --no-deps --force-recreate app
fi

exit 1
