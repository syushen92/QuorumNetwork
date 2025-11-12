#!/usr/bin/env bash
set -euo pipefail

# ================================
# Required:
#   NETWORK     Hardhat network name (e.g., quorum)
#
# Optional:
#   CONTRACTS        Comma-separated list of contracts to sync
#                    (default: all from addresses.<network>.json)
#   ENV_KEY_MODE     "plain" (default) → RECORD_STORAGE_ADDRESS
#                    "with_network"   → RECORD_STORAGE_ADDRESS_QUORUM
#
# Example:
#   NETWORK=quorum ./sync-contracts.sh
#   NETWORK=quorum CONTRACTS=RecordStorage ./sync-contracts.sh
#   NETWORK=quorum ENV_KEY_MODE=with_network ./sync-contracts.sh
# ================================

NETWORK="${NETWORK:-}"
CONTRACTS="${CONTRACTS:-}"
ENV_KEY_MODE="${ENV_KEY_MODE:-plain}"

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Project paths
ADDR_FILE="${ROOT_DIR}/build/addresses.${NETWORK}.json"

CHAIN_SVC_DIR="${ROOT_DIR}/../CarbonManager/chain-service"
ENV_FILE="${CHAIN_SVC_DIR}/.env"
ABI_DIR="${CHAIN_SVC_DIR}/contracts"

# ---------------------------------
# Validation
# ---------------------------------
if [[ -z "${NETWORK}" ]]; then
  echo "❌ Missing NETWORK env var"
  exit 1
fi

command -v jq >/dev/null 2>&1 || {
  echo "❌ jq not installed"
  exit 1
}

if [[ ! -f "${ADDR_FILE}" ]]; then
  echo "❌ Cannot find addresses file: ${ADDR_FILE}"
  echo "   → You must deploy contracts first."
  exit 1
fi

mkdir -p "${ABI_DIR}"

# ---------------------------------
# Helpers
# ---------------------------------

# Convert contract name → ENV KEY (e.g., RecordStorage → RECORD_STORAGE)
to_env_name() {
  echo "$1" | sed -E 's/([a-z0-9])([A-Z])/\1_\2/g' | tr '[:lower:]' '[:upper:]'
}

# Insert or update KEY=VALUE in an .env file
upsert_env() {
  local key="$1"
  local val="$2"
  local file="$3"

  if grep -qE "^${key}=" "$file" 2>/dev/null; then
    # macOS/BSD sed needs an explicit backup suffix
    sed -i.bak "s|^${key}=.*$|${key}=${val}|" "$file"
  else
    printf "\n%s=%s\n" "$key" "$val" >> "$file"
  fi
}

# ---------------------------------
# Read address map
# ---------------------------------
ADDR_MAP="$(cat "${ADDR_FILE}")"

# Build a whitespace-separated list of contract names (portable across bash/zsh)
if [[ -n "${CONTRACTS}" ]]; then
  CONTRACT_LIST="$(printf '%s' "${CONTRACTS}" | tr ',' ' ')"
else
  CONTRACT_LIST="$(echo "${ADDR_MAP}" | jq -r 'keys[]' | tr '\n' ' ')"
fi

echo "[*] Network: ${NETWORK}"
echo "[*] Updating env: ${ENV_FILE}"
echo "[*] ABI output:  ${ABI_DIR}"

# Backup .env if exists
cp -n "${ENV_FILE}" "${ENV_FILE}.bak.$(date +%Y%m%d%H%M%S)" 2>/dev/null || true

# ---------------------------------
# Process each contract
# ---------------------------------
for NAME in ${CONTRACT_LIST}; do
  ADDR="$(echo "${ADDR_MAP}" | jq -r --arg n "$NAME" '.[$n] // empty')"

  if [[ -z "${ADDR}" ]]; then
    echo "  - Skip ${NAME}: No address found."
    continue
  fi

  # ----- ENV export
  BASE_ENV_KEY="CONTRACT_ADDRESS"
  case "${ENV_KEY_MODE}" in
    with_network)
      ENV_KEY="${BASE_ENV_KEY}_$(echo "${NETWORK}" | tr '[:lower:]' '[:upper:]')"
      ;;
    *)
      ENV_KEY="${BASE_ENV_KEY}"
      ;;
  esac

  upsert_env "${ENV_KEY}" "${ADDR}" "${ENV_FILE}"
  echo "  - .env updated: ${ENV_KEY}=${ADDR}"

  # ----- Extract ABI from artifacts
  ARTIFACT_JSON="$(find "${ROOT_DIR}/artifacts/contracts" -type f -name "${NAME}.json" ! -path "*/build-info/*" | head -n1 || true)"

  if [[ -z "${ARTIFACT_JSON}" ]]; then
    echo "  - ⚠ ABI not found: ${NAME}.json"
  else
    jq '.abi' "${ARTIFACT_JSON}" > "${ABI_DIR}/${NAME}.json"
    echo "  - ABI saved: contracts/${NAME}.json"
  fi
done

echo "[*] Sync completed"