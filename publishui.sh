#!/bin/bash

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

function log_info() {
  echo -e "${BLUE}[INFO]${NC} $1"
}
function log_success() {
  echo -e "${GREEN}[SUCCESS]${NC} $1"
}
function log_warn() {
  echo -e "${YELLOW}[WARN]${NC} $1"
}
function log_error() {
  echo -e "${RED}[ERROR]${NC} $1"
}

# Loading variables to run NVM
log_info "Loading NVM and environment profiles..."
source ~/.nvm/nvm.sh
source ~/.profile
source ~/.bashrc

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

# default to dev environment
if [[ "$1" == "prod" ]]; then
  sa="actlabsapp"
  rg="actlabs-app"
  log_info "Using production storage account: $sa, resource group: $rg"
else
  sa="actlabsdev"
  rg="actlabs-dev"
  log_info "Using development storage account: $sa, resource group: $rg"
fi

# Track original state to restore later
original_public_access=""
original_default_action=""

function enablePublicNetworkAccess() {
  log_info "Checking current network access for $sa..."
  networkSettings=$(az storage account show --name "$sa" -g "$rg" --subscription ACT-CSS-Readiness-NPRD --query "{publicNetworkAccess:publicNetworkAccess, defaultAction:networkRuleSet.defaultAction}" --output json)
  publicNetworkAccess=$(echo "$networkSettings" | jq -r '.publicNetworkAccess')
  defaultAction=$(echo "$networkSettings" | jq -r '.defaultAction')
  
  # Store original state
  original_public_access="$publicNetworkAccess"
  original_default_action="$defaultAction"
  
  log_info "Original state: publicNetworkAccess=$original_public_access, defaultAction=$original_default_action"
  
  if [[ "$publicNetworkAccess" != "Enabled" || "$defaultAction" != "Allow" ]]; then
    log_info "Enabling public network access for $sa..."
    az storage account update --name "$sa" -g "$rg" --subscription ACT-CSS-Readiness-NPRD --public-network-access Enabled --default-action Allow >> /dev/null
    log_success "Public network access enabled."
  else
    log_info "Public network access already enabled."
  fi
}

function disablePublicNetworkAccess() {
  # Only disable if it was originally disabled
  if [[ "$original_public_access" == "Disabled" || "$original_default_action" == "Deny" ]]; then
    log_info "Restoring original network access state for $sa..."
    az storage account update --name "$sa" -g "$rg" --subscription ACT-CSS-Readiness-NPRD --public-network-access "$original_public_access" --default-action "$original_default_action" >> /dev/null
    log_success "Network access restored to original state."
  else
    log_info "Keeping network access enabled (was originally enabled)."
  fi
}

trap disablePublicNetworkAccess EXIT

log_info "Building UI..."

# build for env
if [[ "$1" == "prod" ]]; then
  npm run build
else 
  npm run build -- --mode development
fi

if [[ "$?" != "0" ]]; then
  log_error "Build failed"
  exit 1
fi

enablePublicNetworkAccess
sleep 5s

max_attempts=18
attempt=1
while [ "$attempt" -le "$max_attempts" ]; do
  ts=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
  log_info "[$ts] Upload attempt $attempt/$max_attempts to storage account ${sa}"
  az storage blob upload-batch -d '$web' --account-name ${sa} -s "./dist" --overwrite --subscription ACT-CSS-Readiness-NPRD --auth-mode login 2>/dev/null
  rc=$?
  if [ "$rc" -eq 0 ]; then
    log_success "[$ts] Upload succeeded on attempt $attempt."
    break
  else
    log_warn "[$ts] Upload failed on attempt $attempt with exit code $rc."
  fi
  if [ "$attempt" -eq "$max_attempts" ]; then
    log_error "[$ts] Reached max attempts ($max_attempts). Aborting upload."
    disablePublicNetworkAccess
    exit 1
  fi
  attempt=$((attempt + 1))
  sleep 10
done