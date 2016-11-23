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
  echo "Completed Testing Env setup" $RES_REPO
}

runTests() {
  echo "Starting to run test cases"
  pushd /build/IN/$RES_REPO/gitRepo
  npm run test-tokenExchange
  npm run test-getAccounts
  npm run test-deleteAccounts
  popd

  pushd /build/IN/$RES_REPO/gitRepo/tests
  export CONFIG_CONTENT=$(cat config.json)
  echo $CONFIG_CONTENT
  popd
  echo "Successfully ran the test cases"
}

main() {
  setupTestEnv
  runTests
}

main
