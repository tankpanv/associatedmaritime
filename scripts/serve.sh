#!/usr/bin/env bash
# One-command process manager for the associatedmaritime replica.
#   ./scripts/serve.sh start | stop | restart | status | logs [be|fe] | dev
# Ports come from .env (FRONTEND_PORT / BACKEND_PORT). PIDs + logs live in .run/.
set -uo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

# --- config -----------------------------------------------------------------
set -a; [ -f .env ] && . ./.env; set +a
FRONTEND_PORT="${FRONTEND_PORT:-3037}"
BACKEND_PORT="${BACKEND_PORT:-8047}"
RUN="$ROOT/.run"; mkdir -p "$RUN"
FE_PID="$RUN/frontend.pid"; FE_LOG="$RUN/frontend.log"
BE_PID="$RUN/backend.pid";  BE_LOG="$RUN/backend.log"
NEXT="$ROOT/node_modules/.bin/next"
NODE_BIN="${NODE_BIN:-}"
if [ -z "$NODE_BIN" ] && [ -x "$HOME/.nvm/versions/node/v22.16.0/bin/node" ]; then
  NODE_BIN="$HOME/.nvm/versions/node/v22.16.0/bin/node"
fi
NODE_BIN="${NODE_BIN:-node}"

c_g(){ printf '\033[32m%s\033[0m' "$1"; }; c_r(){ printf '\033[31m%s\033[0m' "$1"; }
c_y(){ printf '\033[33m%s\033[0m' "$1"; }

pid_on_port(){ ss -ltnp 2>/dev/null | grep -oE "pid=[0-9]+" | head -1 >/dev/null; \
  ss -ltnp 2>/dev/null | awk -v p=":$1" '$4 ~ p {print}' | grep -oE 'pid=[0-9]+' | head -1 | cut -d= -f2; }
listening(){ ss -ltn 2>/dev/null | grep -q ":$1 "; }
alive(){ [ -n "${1:-}" ] && kill -0 "$1" 2>/dev/null; }

wait_health(){ # url, label, tries
  local url="$1" label="$2" n="${3:-40}"
  for _ in $(seq 1 "$n"); do
    if curl -s -m 3 -o /dev/null "$url"; then echo "  $label $(c_g ready)"; return 0; fi
    sleep 0.5
  done
  echo "  $label $(c_r 'did not become ready')"; return 1
}

# --- start/stop one service -------------------------------------------------
start_be(){
  if listening "$BACKEND_PORT"; then echo "backend: port $BACKEND_PORT already in use"; return 0; fi
  BACKEND_PORT="$BACKEND_PORT" nohup setsid bash -c 'exec "$0" "$1"' "$NODE_BIN" "$ROOT/server/backend.cjs" >"$BE_LOG" 2>&1 &
  echo $! >"$BE_PID"; echo "backend  -> pid $(cat "$BE_PID"), port $BACKEND_PORT, log .run/backend.log"
}
start_fe_bg(){
  if listening "$FRONTEND_PORT"; then echo "frontend: port $FRONTEND_PORT already in use"; return 0; fi
  nohup setsid bash -c 'exec "$0" dev -p "$1"' "$NEXT" "$FRONTEND_PORT" >"$FE_LOG" 2>&1 &
  echo $! >"$FE_PID"; echo "frontend -> pid $(cat "$FE_PID"), port $FRONTEND_PORT, log .run/frontend.log"
}
kill_svc(){ # pidfile, port, pattern, label
  local pf="$1" port="$2" pat="$3" label="$4" pid="" killed=0
  [ -f "$pf" ] && pid="$(cat "$pf" 2>/dev/null)"
  if alive "$pid"; then kill "$pid" 2>/dev/null; killed=1; fi
  # fallbacks: by port, then by command pattern
  local pp; pp="$(pid_on_port "$port")"; if alive "$pp"; then kill "$pp" 2>/dev/null; killed=1; fi
  pkill -f "$pat" 2>/dev/null && killed=1
  rm -f "$pf"
  [ "$killed" = 1 ] && echo "$label $(c_y stopped)" || echo "$label was not running"
}

# --- commands ---------------------------------------------------------------
cmd_start(){
  start_be; start_fe_bg
  echo "waiting for health..."
  wait_health "http://localhost:$BACKEND_PORT/health" "backend " 40
  wait_health "http://localhost:$FRONTEND_PORT/" "frontend" 60
  echo; cmd_status
}
cmd_stop(){
  kill_svc "$FE_PID" "$FRONTEND_PORT" "next dev -p $FRONTEND_PORT" "frontend"
  kill_svc "$BE_PID" "$BACKEND_PORT" "server/backend.cjs" "backend "
}
cmd_restart(){ cmd_stop; sleep 1; cmd_start; }
cmd_status(){
  echo "service   port   state    health"
  printf "backend   %-6s " "$BACKEND_PORT"
  if listening "$BACKEND_PORT"; then printf "%-8s " "$(c_g up)"; else printf "%-8s " "$(c_r down)"; fi
  curl -s -m 2 "http://localhost:$BACKEND_PORT/health" 2>/dev/null | grep -q '"ok":true' \
    && echo "$(c_g ok)" || echo "$(c_r '-')"
  printf "frontend  %-6s " "$FRONTEND_PORT"
  if listening "$FRONTEND_PORT"; then printf "%-8s " "$(c_g up)"; else printf "%-8s " "$(c_r down)"; fi
  curl -s -m 4 -o /dev/null -w '%{http_code}' "http://localhost:$FRONTEND_PORT/" 2>/dev/null \
    | grep -qE '200|30' && echo "$(c_g 'home ok')" || echo "$(c_r '-')"
  echo; echo "open: http://localhost:$FRONTEND_PORT/"
}
cmd_logs(){ case "${1:-both}" in
    be|backend) tail -n 60 -f "$BE_LOG" ;;
    fe|frontend) tail -n 60 -f "$FE_LOG" ;;
    *) tail -n 40 -f "$BE_LOG" "$FE_LOG" ;;
  esac; }
cmd_dev(){ # backend in bg, frontend in foreground (Ctrl-C stops fe; trap stops be)
  start_be
  wait_health "http://localhost:$BACKEND_PORT/health" "backend " 40
  trap 'echo; kill_svc "$BE_PID" "$BACKEND_PORT" "server/backend.cjs" "backend "' INT TERM EXIT
  echo "frontend (foreground) on http://localhost:$FRONTEND_PORT  — Ctrl-C to stop both"
  # no exec: keep the trap alive so backend is cleaned up when the frontend exits
  "$NEXT" dev -p "$FRONTEND_PORT"
}

cmd_prod(){ # bare-metal production: backend + Next standalone server (run `npm run build` first)
  if [ ! -f "$ROOT/.next/standalone/server.js" ]; then
    echo "$(c_r 'no build found') — run: npm run build"; exit 1
  fi
  # Next standalone does not include these — copy them in.
  cp -r "$ROOT/.next/static" "$ROOT/.next/standalone/.next/static" 2>/dev/null
  cp -r "$ROOT/public" "$ROOT/.next/standalone/public" 2>/dev/null
  if ! listening "$BACKEND_PORT"; then
    BACKEND_PORT="$BACKEND_PORT" nohup setsid bash -c 'exec "$0" "$1"' "$NODE_BIN" "$ROOT/server/backend.cjs" >"$BE_LOG" 2>&1 &
    echo $! >"$BE_PID"; echo "backend  -> pid $(cat "$BE_PID"), port $BACKEND_PORT"
  fi
  wait_health "http://localhost:$BACKEND_PORT/health" "backend " 40
  echo "frontend (prod, foreground) on http://localhost:$FRONTEND_PORT  — Ctrl-C to stop both"
  trap 'kill_svc "$BE_PID" "$BACKEND_PORT" "server/backend.cjs" "backend "' INT TERM EXIT
  PORT="$FRONTEND_PORT" HOSTNAME=0.0.0.0 NODE_ENV=production "$NODE_BIN" "$ROOT/.next/standalone/server.js"
}

case "${1:-}" in
  start) cmd_start ;;
  prod) cmd_prod ;;
  stop) cmd_stop ;;
  restart) cmd_restart ;;
  status) cmd_status ;;
  logs) shift; cmd_logs "${1:-both}" ;;
  dev) cmd_dev ;;
  *) echo "usage: $0 {start|stop|restart|status|logs [be|fe]|dev}"; exit 1 ;;
esac
