#!/usr/bin/env bash
# Local entry point: same gates as CI, in the same order.
set -euo pipefail
cd "$(dirname "$0")/.."

echo "==> Validating collection and traceability"
npm run --silent lint:collection

echo "==> Waiting for the API"
for attempt in 1 2 3; do
  code=$(curl -s -o /dev/null -w '%{http_code}' --max-time 30 \
    "https://restful-booker.herokuapp.com/ping" || true)
  echo "    attempt $attempt: GET /ping -> $code"
  [ "$code" = "201" ] && break
  [ "$attempt" = "3" ] && { echo "API is not answering with 201"; exit 1; }
  sleep 5
done

echo "==> Running the collection"
# Keep going to the summary even when assertions fail, then exit with Newman's code.
set +e
npm test
newman_exit=$?
set -e

echo "==> Summary"
npm run --silent report:summary || true

exit "$newman_exit"
