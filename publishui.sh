#!/bin/bash

# Loading variables to run NVM
source ~/.nvm/nvm.sh
source ~/.profile
source ~/.bashrc

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"                   # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion" # This loads nvm bash_completion

# default to dev environment
if [[ "$1" == "prod" ]]; then
  sa="actlabsapp"
  rg="actlabs-app"
else
  sa="actlabsdev"
  rg="actlabs-dev"
fi

# Functions must be defined before the trap so they are available on exit
function enablePublicNetworkAccess() {
  # Fetch public network access and default network rule in a single command
  networkSettings=$(az storage account show --name "$sa" -g "$rg" --subscription ACT-CSS-Readiness-NPRD --query "{publicNetworkAccess:publicNetworkAccess, defaultAction:networkRuleSet.defaultAction}" --output json)

  publicNetworkAccess=$(echo "$networkSettings" | jq -r '.publicNetworkAccess')
  defaultAction=$(echo "$networkSettings" | jq -r '.defaultAction')

  # Enable public network access if not already enabled
  if [[ "$publicNetworkAccess" != "Enabled" || "$defaultAction" != "Allow" ]]; then
    az storage account update --name "$sa" -g "$rg" --subscription ACT-CSS-Readiness-NPRD --public-network-access Enabled --default-action Allow >> /dev/null
  fi
}

function disablePublicNetworkAccess() {
  # Fetch public network access and default network rule in a single command
  networkSettings=$(az storage account show --name "$sa" -g "$rg" --subscription ACT-CSS-Readiness-NPRD --query "{publicNetworkAccess:publicNetworkAccess, defaultAction:networkRuleSet.defaultAction}" --output json)

  publicNetworkAccess=$(echo "$networkSettings" | jq -r '.publicNetworkAccess')
  defaultAction=$(echo "$networkSettings" | jq -r '.defaultAction')

  # Disable public network access if not already disabled
  if [[ "$publicNetworkAccess" != "Disabled" || "$defaultAction" != "Deny" ]]; then
    az storage account update --name "$sa" -g "$rg" --subscription ACT-CSS-Readiness-NPRD --public-network-access Disabled --default-action Deny >> /dev/null
  fi
}

# Ensure public network access is disabled on any exit (success or failure)
trap disablePublicNetworkAccess EXIT

npm run build
if [[ "$?" != "0" ]]; then
  echo "Build failed"
  exit 1
fi

enablePublicNetworkAccess
sleep 5s

# Attempt upload and retry if storage is not yet accessible.
# Try up to 18 times (every 10s = ~3 minutes total).
max_attempts=18
attempt=1
while [ "$attempt" -le "$max_attempts" ]; do
  ts=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
  echo "[$ts] Upload attempt $attempt/$max_attempts to storage account ${sa}"

  az storage blob upload-batch -d '$web' --account-name ${sa} -s "./dist" --overwrite --subscription ACT-CSS-Readiness-NPRD --auth-mode login
  rc=$?

  if [ "$rc" -eq 0 ]; then
    ts=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
    echo "[$ts] Upload succeeded on attempt $attempt."
    break
  else
    ts=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
    echo "[$ts] Upload failed on attempt $attempt with exit code $rc."
  fi

  if [ "$attempt" -eq "$max_attempts" ]; then
    ts=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
    echo "[$ts] Reached max attempts ($max_attempts). Aborting upload."
    disablePublicNetworkAccess
    exit 1
  fi

  attempt=$((attempt + 1))
  sleep 10
done