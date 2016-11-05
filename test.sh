#!/bin/bash -e

export RES_REPO=bat-repo
export RES_PARAMS=$1

setupTestEnv() {
  echo "Starting Testing Env setup" $RES_REPO
#  pushd /build/IN/$RES_REPO/gitRepo
#  npm install
#  popd

  pushd /build/IN/$RES_PARAMS
  cat params | jq -r '.version.propertyBag.params.secure'
  jq -r '.version.propertyBag.params.secure' params
  #params > avi.txt
  #. avi.txt
  #echo $API_URL
  popd
  echo "Completed Testing Env setup" $RES_REPO
}

main() {
  setupTestEnv
}

main
