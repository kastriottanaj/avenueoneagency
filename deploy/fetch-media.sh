#!/usr/bin/env bash
#
# Download any uploaded media referenced by the database but missing from
# MEDIA_ROOT, pulling it from the currently-live site.
#
# Render's filesystem is ephemeral and render.yaml mounts no disk, so images
# uploaded through the Django admin live only on the running instance and are
# not in git. Run this on the Hetzner box after importing the database and
# BEFORE the DNS cutover, while SOURCE still resolves to Render:
#
#     sudo -u avenue SOURCE=https://avenueoneagency.com \
#         /srv/avenueoneagency/deploy/fetch-media.sh
#
# Re-runnable: files already present are skipped.

set -euo pipefail

APP_NAME="avenueoneagency"
APP_DIR="/srv/${APP_NAME}"
ENV_FILE="/etc/${APP_NAME}/env"
SOURCE="${SOURCE:-https://avenueoneagency.com}"

set -a
# shellcheck disable=SC1090
source "${ENV_FILE}"
set +a

cd "${APP_DIR}"

# Ask Django for every non-empty FileField/ImageField value across all models,
# so this keeps working if new image fields are added later.
paths="$("${APP_DIR}/venv/bin/python" manage.py shell -c '
from django.apps import apps
from django.db.models import FileField

for model in apps.get_models():
    names = [f.name for f in model._meta.get_fields() if isinstance(f, FileField)]
    if not names:
        continue
    for obj in model.objects.all().iterator():
        for name in names:
            value = getattr(obj, name)
            if value:
                print(value.name)
')"

if [[ -z "${paths}" ]]; then
    echo "No media referenced by the database."
    exit 0
fi

media_root="${APP_DIR}/media"
downloaded=0
skipped=0
failed=0

while IFS= read -r rel; do
    [[ -z "${rel}" ]] && continue
    target="${media_root}/${rel}"
    if [[ -f "${target}" ]]; then
        skipped=$((skipped + 1))
        continue
    fi
    mkdir -p "$(dirname "${target}")"
    if curl --fail --silent --show-error --location --max-time 60 \
            --output "${target}" "${SOURCE}/media/${rel}"; then
        echo "  downloaded ${rel}"
        downloaded=$((downloaded + 1))
    else
        rm -f "${target}"
        echo "  MISSING   ${rel} (not served by ${SOURCE})" >&2
        failed=$((failed + 1))
    fi
done <<< "${paths}"

echo
echo "downloaded=${downloaded} already-present=${skipped} missing=${failed}"

if [[ "${failed}" -gt 0 ]]; then
    echo
    echo "Missing files are referenced by the database but no longer exist on the" >&2
    echo "source server — most likely lost to an earlier Render redeploy. Re-upload" >&2
    echo "them through the Django admin after the cutover." >&2
fi
