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

npm run build
if [[ "$?" != "0" ]]; then
  echo "Build failed"
  exit 1
fi

cd dist && az storage blob upload-batch -d '$web' --account-name ${sa} -s "." --overwrite --subscription ACT-CSS-Readiness-NPRD --auth-mode login

# if published to default storage account. Purge the endpoint.
if [[ "$sa" == "actlabsapp" ]]; then
  az cdn endpoint purge --subscription ACT-CSS-Readiness-NPRD -g ${rg} -n actlabs --profile-name actlabs --content-paths "/*"
fi

# if published to default storage account. Purge the endpoint.
if [[ "$sa" == "actlabsdev" ]]; then
  az cdn endpoint purge --subscription ACT-CSS-Readiness-NPRD -g ${rg} -n actlabs --profile-name actlabs --content-paths "/*"
fi
