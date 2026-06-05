#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

ENV_FILE="$ROOT/.env.production"
ENV_EXAMPLE="$ROOT/.env.production.example"

say() { printf '[deploy] %s\n' "$1"; }
die() { printf '[deploy] %s\n' "$1" >&2; exit 1; }

random_hex() {
  if command -v openssl >/dev/null 2>&1; then
    openssl rand -hex "$1"
  else
    head -c "$1" /dev/urandom | od -An -tx1 | tr -d ' \n'
  fi
}

ensure_root() {
  if [ "${EUID:-$(id -u)}" -ne 0 ]; then
    exec sudo -E bash "$0" "$@"
  fi
}

ensure_docker() {
  if command -v docker >/dev/null 2>&1 && docker compose version >/dev/null 2>&1; then
    say "Docker and Docker Compose are already installed"
    return
  fi

  if ! command -v apt-get >/dev/null 2>&1; then
    die "Automatic install currently supports Ubuntu/Debian with apt-get"
  fi

  say "Installing Docker and Docker Compose"
  apt-get update
  apt-get install -y ca-certificates curl gnupg
  install -m 0755 -d /etc/apt/keyrings
  if [ ! -f /etc/apt/keyrings/docker.asc ]; then
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
    chmod a+r /etc/apt/keyrings/docker.asc
  fi

  . /etc/os-release
  echo \
    "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu ${VERSION_CODENAME} stable" \
    >/etc/apt/sources.list.d/docker.list

  apt-get update
  apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
  systemctl enable --now docker
}

ensure_env_file() {
  if [ -f "$ENV_FILE" ]; then
    say "Using existing $(basename "$ENV_FILE")"
    return
  fi

  [ -f "$ENV_EXAMPLE" ] || die "Missing $ENV_EXAMPLE"
  cp "$ENV_EXAMPLE" "$ENV_FILE"

  local admin_pass admin_secret
  admin_pass="$(random_hex 12)"
  admin_secret="$(random_hex 32)"

  sed -i "s/^ADMIN_PASS=.*/ADMIN_PASS=${admin_pass}/" "$ENV_FILE"
  sed -i "s/^ADMIN_SECRET=.*/ADMIN_SECRET=${admin_secret}/" "$ENV_FILE"

  say "Created $(basename "$ENV_FILE") with generated admin credentials"
  say "Admin user: admin"
  say "Admin pass: ${admin_pass}"
  say "Please review $(basename "$ENV_FILE") before exposing the site publicly"
}

load_env() {
  set -a
  . "$ENV_FILE"
  set +a
  FRONTEND_PORT="${FRONTEND_PORT:-3037}"
  BACKEND_PORT="${BACKEND_PORT:-8047}"
}

wait_http() {
  local url="$1" label="$2" tries="${3:-60}"
  for _ in $(seq 1 "$tries"); do
    if curl -fsS -m 5 "$url" >/dev/null 2>&1; then
      say "$label is ready: $url"
      return 0
    fi
    sleep 2
  done
  die "$label did not become ready: $url"
}

compose() {
  docker compose --env-file "$ENV_FILE" "$@"
}

cmd_up() {
  ensure_root up
  ensure_docker
  ensure_env_file
  load_env
  mkdir -p "$ROOT/data"
  say "Building and starting containers"
  compose up -d --build
  wait_http "http://127.0.0.1:${BACKEND_PORT}/health" "backend" 60
  wait_http "http://127.0.0.1:${FRONTEND_PORT}/" "frontend" 90
  say "Deployment complete"
  say "Frontend: http://$(hostname -I | awk '{print $1}'):${FRONTEND_PORT}"
  say "Admin:    http://$(hostname -I | awk '{print $1}'):${BACKEND_PORT}/admin"
}

cmd_down() {
  [ -f "$ENV_FILE" ] || die "Missing $ENV_FILE"
  compose down
}

cmd_restart() {
  [ -f "$ENV_FILE" ] || die "Missing $ENV_FILE"
  compose down
  compose up -d --build
}

cmd_logs() {
  [ -f "$ENV_FILE" ] || die "Missing $ENV_FILE"
  compose logs -f --tail=200
}

cmd_status() {
  [ -f "$ENV_FILE" ] || die "Missing $ENV_FILE"
  compose ps
}

case "${1:-up}" in
  up) shift; cmd_up "$@" ;;
  down) shift; cmd_down "$@" ;;
  restart) shift; cmd_restart "$@" ;;
  logs) shift; cmd_logs "$@" ;;
  status) shift; cmd_status "$@" ;;
  *)
    cat <<'EOF'
usage: bash scripts/deploy-prod.sh [up|down|restart|logs|status]

  up       install Docker if needed, create .env.production, build, start
  down     stop and remove containers
  restart  rebuild and restart containers
  logs     follow deployment logs
  status   show container status
EOF
    exit 1
    ;;
esac
