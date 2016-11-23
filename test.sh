#!/bin/bash -e

export RES_REPO=bat-repo
export RES_PARAMS=$1

setupTestEnv() {
  echo "Starting Testing Env setup" $RES_REPO
  pushd /build/IN/$RES_REPO/gitRepo
  npm install
  popd

  pushd /build/IN/$RES_PARAMS
  export $(jq -r '.version.propertyBag.params.secure' version.json)
  echo $GITHUB_ACCESS_TOKEN_OWNER
  popd

  pushd /build/IN/$RES_REPO/gitRepo
  npm run test-roles --API_URL $API_URL
  popd
  echo "Completed Testing Env setup" $RES_REPO
}

main() {
  setupTestEnv
}

main
