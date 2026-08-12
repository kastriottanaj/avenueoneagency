#!/usr/bin/env bash
#
# Nightly database backup. Installed by bootstrap.sh to
# /usr/local/bin/avenueoneagency-backup and run from /etc/cron.d as the
# postgres user (which authenticates via the local peer socket, so no
# password is needed here).
#
# Restore with:
#   pg_restore --clean --if-exists --no-owner --no-privileges \
#       -d avenueoneagency /var/backups/avenueoneagency/<file>.dump

set -euo pipefail

DB_NAME="avenueoneagency"
BACKUP_DIR="/var/backups/${DB_NAME}"
RETENTION_DAYS=14
STAMP="$(date -u +%Y%m%d-%H%M%S)"
TARGET="${BACKUP_DIR}/${DB_NAME}-${STAMP}.dump"

mkdir -p "${BACKUP_DIR}"

pg_dump --format=custom --compress=9 --file="${TARGET}" "${DB_NAME}"
chmod 600 "${TARGET}"

find "${BACKUP_DIR}" -name "${DB_NAME}-*.dump" -mtime "+${RETENTION_DAYS}" -delete

echo "$(date -u +%FT%TZ) backed up ${DB_NAME} to ${TARGET} ($(du -h "${TARGET}" | cut -f1))"
