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
  networkSettings=$(az storage account show --name "$sa" -g "$rg" --subscription "$subscription_id" --query "{publicNetworkAccess:publicNetworkAccess, defaultAction:networkRuleSet.defaultAction}" --output json 2>>$LOG_FILE)

  publicNetworkAccess=$(echo "$networkSettings" | jq -r '.publicNetworkAccess')
  defaultAction=$(echo "$networkSettings" | jq -r '.defaultAction')

  # Enable public network access if not already enabled
  if [[ "$publicNetworkAccess" != "Enabled" || "$defaultAction" != "Allow" ]]; then
    az storage account update --name "$sa" -g "$rg" --subscription "$subscription_id" --public-network-access Enabled --default-action Allow >>$LOG_FILE 2>&1
  fi
}

function disablePublicNetworkAccess() {
  # Fetch public network access and default network rule in a single command
  networkSettings=$(az storage account show --name "$sa" -g "$rg" --subscription "$subscription_id" --query "{publicNetworkAccess:publicNetworkAccess, defaultAction:networkRuleSet.defaultAction}" --output json 2>>$LOG_FILE)

  publicNetworkAccess=$(echo "$networkSettings" | jq -r '.publicNetworkAccess')
  defaultAction=$(echo "$networkSettings" | jq -r '.defaultAction')

  # Disable public network access if not already disabled
  if [[ "$publicNetworkAccess" != "Disabled" || "$defaultAction" != "Deny" ]]; then
    az storage account update --name "$sa" -g "$rg" --subscription "$subscription_id" --public-network-access Disabled --default-action Deny >>$LOG_FILE 2>&1
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

cd dist && az storage blob upload-batch -d '$web' --account-name ${sa} -s "." --overwrite --subscription ACT-CSS-Readiness-NPRD --auth-mode login

# if published to default storage account. Purge the endpoint.
if [[ "$sa" == "actlabsapp" ]]; then
  az cdn endpoint purge --subscription ACT-CSS-Readiness-NPRD -g ${rg} -n actlabs --profile-name actlabs --content-paths "/*"
fi

# if published to default storage account. Purge the endpoint.
if [[ "$sa" == "actlabsdev" ]]; then
  az cdn endpoint purge --subscription ACT-CSS-Readiness-NPRD -g ${rg} -n actlabs --profile-name actlabs --content-paths "/*"
fi