#!/bin/bash -e

export RES_REPO=bat-repo
export RES_PARAMS=$1

setupTestEnv() {
  echo "Starting Testing Env setup" $RES_REPO

  pushd /build/IN/$RES_PARAMS
  export $(jq -r '.version.propertyBag.params.secure' version.json)
  popd

  pushd /build/IN/$RES_REPO/gitRepo
  npm install
  npm run test-tokenExchange
  npm run test-getAccounts
 # npm run test-organizationOwner
  npm run test-deleteAccounts
  echo "Completed Testing Env setup" $RES_REPO
}

main() {
  setupTestEnv
}

main
