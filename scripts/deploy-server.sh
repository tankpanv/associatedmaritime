#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

APP_NAME="associatedmaritime"
ENV_FILE="$ROOT/.env.server"
ENV_EXAMPLE="$ROOT/.env.server.example"
BACKEND_SERVICE="${APP_NAME}-backend.service"
FRONTEND_SERVICE="${APP_NAME}-frontend.service"
APP_USER=""

say() { printf '[server-deploy] %s\n' "$1"; }
die() { printf '[server-deploy] %s\n' "$1" >&2; exit 1; }

random_hex() {
  if command -v openssl >/dev/null 2>&1; then
    openssl rand -hex "$1"
  else
    head -c "$1" /dev/urandom | od -An -tx1 | tr -d ' \n'
  fi
}

require_root() {
  if [ "${EUID:-$(id -u)}" -ne 0 ]; then
    exec sudo -E bash "$0" "$@"
  fi
}

ensure_node() {
  local major=""
  if command -v node >/dev/null 2>&1; then
    major="$(node -p 'process.versions.node.split(".")[0]')"
  fi

  if [ -n "$major" ] && [ "$major" -ge 20 ]; then
    say "Node.js $(node -v) is already available"
    return
  fi

  if ! command -v apt-get >/dev/null 2>&1; then
    die "Automatic Node.js installation currently supports Ubuntu/Debian only"
  fi

  say "Installing Node.js 22"
  apt-get update
  apt-get install -y ca-certificates curl gnupg build-essential
  curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
  apt-get install -y nodejs
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
}

load_env() {
  set -a
  . "$ENV_FILE"
  set +a

  FRONTEND_PORT="${FRONTEND_PORT:-3037}"
  BACKEND_PORT="${BACKEND_PORT:-8047}"
  BACKEND_URL="${BACKEND_URL:-http://127.0.0.1:${BACKEND_PORT}}"
}

detect_app_user() {
  APP_USER="$(stat -c '%U' "$ROOT")"
}

run_as_app_user() {
  if [ "${APP_USER}" = "root" ]; then
    "$@"
  else
    sudo -u "$APP_USER" "$@"
  fi
}

install_dependencies() {
  say "Installing npm dependencies"
  run_as_app_user npm ci --no-audit --no-fund
}

prepare_build() {
  say "Building frontend"
  run_as_app_user env BACKEND_URL="$BACKEND_URL" npm run build

  mkdir -p "$ROOT/.next/standalone/.next"
  rm -rf "$ROOT/.next/standalone/.next/static"
  cp -r "$ROOT/.next/static" "$ROOT/.next/standalone/.next/static"
  rm -rf "$ROOT/.next/standalone/public"
  cp -r "$ROOT/public" "$ROOT/.next/standalone/public"
}

install_service_files() {
  cat >/etc/systemd/system/"$BACKEND_SERVICE" <<EOF
[Unit]
Description=Associated Maritime backend
After=network.target

[Service]
Type=simple
User=${APP_USER}
WorkingDirectory=${ROOT}
EnvironmentFile=${ENV_FILE}
Environment=NODE_ENV=production
ExecStart=/usr/bin/env node ${ROOT}/server/backend.cjs
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
EOF

  cat >/etc/systemd/system/"$FRONTEND_SERVICE" <<EOF
[Unit]
Description=Associated Maritime frontend
After=network.target ${BACKEND_SERVICE}
Requires=${BACKEND_SERVICE}

[Service]
Type=simple
User=${APP_USER}
WorkingDirectory=${ROOT}
EnvironmentFile=${ENV_FILE}
Environment=NODE_ENV=production
Environment=HOSTNAME=0.0.0.0
Environment=PORT=${FRONTEND_PORT}
ExecStart=/usr/bin/env node ${ROOT}/.next/standalone/server.js
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
EOF

  systemctl daemon-reload
  systemctl enable "$BACKEND_SERVICE" "$FRONTEND_SERVICE"
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

start_services() {
  systemctl restart "$BACKEND_SERVICE"
  systemctl restart "$FRONTEND_SERVICE"
}

cmd_install() {
  require_root install
  ensure_node
  ensure_env_file
  load_env
  detect_app_user
  mkdir -p "$ROOT/data" "$ROOT/data/careers" "$ROOT/data/outbox"
  install_dependencies
  prepare_build
  install_service_files
  start_services
  wait_http "http://127.0.0.1:${BACKEND_PORT}/health" "backend" 60
  wait_http "http://127.0.0.1:${FRONTEND_PORT}/" "frontend" 90
  say "Deployment complete"
  say "Frontend: http://$(hostname -I | awk '{print $1}'):${FRONTEND_PORT}"
  say "Admin:    http://$(hostname -I | awk '{print $1}'):${BACKEND_PORT}/admin"
}

cmd_rebuild() {
  require_root rebuild
  [ -f "$ENV_FILE" ] || die "Missing $ENV_FILE"
  ensure_node
  load_env
  detect_app_user
  install_dependencies
  prepare_build
  start_services
  wait_http "http://127.0.0.1:${BACKEND_PORT}/health" "backend" 60
  wait_http "http://127.0.0.1:${FRONTEND_PORT}/" "frontend" 90
}

cmd_restart() {
  require_root restart
  systemctl restart "$BACKEND_SERVICE" "$FRONTEND_SERVICE"
}

cmd_stop() {
  require_root stop
  systemctl stop "$FRONTEND_SERVICE" "$BACKEND_SERVICE"
}

cmd_status() {
  systemctl status "$BACKEND_SERVICE" "$FRONTEND_SERVICE" --no-pager
}

cmd_logs() {
  journalctl -u "$BACKEND_SERVICE" -u "$FRONTEND_SERVICE" -f -n 200
}

case "${1:-install}" in
  install) shift; cmd_install "$@" ;;
  rebuild) shift; cmd_rebuild "$@" ;;
  restart) shift; cmd_restart "$@" ;;
  stop) shift; cmd_stop "$@" ;;
  status) shift; cmd_status "$@" ;;
  logs) shift; cmd_logs "$@" ;;
  *)
    cat <<'EOF'
usage: bash scripts/deploy-server.sh [install|rebuild|restart|stop|status|logs]

  install  install Node.js if needed, npm ci, build, register systemd, enable boot start
  rebuild  reinstall dependencies, rebuild, restart services
  restart  restart systemd services
  stop     stop systemd services
  status   show systemd service status
  logs     follow service logs
EOF
    exit 1
    ;;
esac
