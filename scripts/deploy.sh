#!/usr/bin/env sh

set -eu

DEPLOY_PATH="${1:-/opt/weathermeal/frontend}"

if [ ! -d "$DEPLOY_PATH" ]; then
  echo "Deployment path does not exist: $DEPLOY_PATH" >&2
  exit 1
fi

cd "$DEPLOY_PATH"

if ! command -v docker >/dev/null 2>&1; then
  echo "Docker is not installed on the server" >&2
  exit 1
fi

docker compose up --build -d
