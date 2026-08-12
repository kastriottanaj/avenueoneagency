#!/usr/bin/env bash
#
# Deploy the current main branch. Run as the app user:
#
#     sudo -u avenue /srv/avenueoneagency/deploy/deploy.sh
#
# Pulls, installs dependencies, rebuilds the frontend, collects static files,
# migrates, and restarts gunicorn.

set -euo pipefail

APP_NAME="avenueoneagency"
APP_DIR="/srv/${APP_NAME}"
ENV_FILE="/etc/${APP_NAME}/env"
VENV="${APP_DIR}/venv"
BRANCH="${BRANCH:-main}"

log() { printf '\n\033[1;34m==>\033[0m %s\n' "$*"; }

cd "${APP_DIR}"

if [[ ! -r "${ENV_FILE}" ]]; then
    echo "Cannot read ${ENV_FILE}. Run this as the app user (sudo -u avenue ...)." >&2
    exit 1
fi

# Export everything in the env file for manage.py.
set -a
# shellcheck disable=SC1090
source "${ENV_FILE}"
set +a

log "Fetching ${BRANCH}"
git fetch --prune origin
git checkout "${BRANCH}"
git pull --ff-only origin "${BRANCH}"
echo "    now at $(git rev-parse --short HEAD) — $(git log -1 --pretty=%s)"

if [[ ! -d "${VENV}" ]]; then
    log "Creating virtualenv"
    python3 -m venv "${VENV}"
fi

log "Installing Python dependencies"
"${VENV}/bin/pip" install --upgrade pip --quiet
"${VENV}/bin/pip" install -r requirements.txt --quiet

log "Building the frontend"
cd "${APP_DIR}/frontend"
npm ci --no-audit --no-fund
npm run build
cd "${APP_DIR}"

log "Collecting static files"
"${VENV}/bin/python" manage.py collectstatic --noinput

log "Applying migrations"
"${VENV}/bin/python" manage.py migrate --noinput

log "Restarting gunicorn"
sudo systemctl restart gunicorn

# Give the workers a moment to bind before checking.
sleep 3
log "Health check"

probe() {
    curl --fail --silent --show-error --max-time 15 \
        --unix-socket "/run/gunicorn/${APP_NAME}.sock" \
        --header 'Host: avenueoneagency.com' \
        --header 'X-Forwarded-Proto: https' \
        "http://localhost$1"
}

# /healthz verifies the database and the frontend build; / verifies the
# React app is actually being served.
if ! probe /healthz; then
    echo "    /healthz failed — check: journalctl -u gunicorn -n 50 --no-pager" >&2
    exit 1
fi

if ! probe / >/dev/null; then
    echo "    / failed — check: journalctl -u gunicorn -n 50 --no-pager" >&2
    exit 1
fi

echo "    app is healthy"

log "Deploy finished"
