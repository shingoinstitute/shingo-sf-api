#!/bin/bash

TAG="${TAG:-latest}"
NETWORK="${NETWORK:-shingo-net}"
IMG_NAME="shingo-sf-api"
CONT_NAME="shingo-sf-api"
SF_ENV=${SF_ENV:?"Must set SF_ENV"}
SF_URL=${SF_URL:?"Must set SF_URL"}
SF_USER=${SF_USER:?"Must set SF_USER"}
SF_PASS=${SF_PASS:?"Must set SF_PASS"}
PORT=${PORT:-80}

if [[ "$TAG" = "test" ]]; then
  CONT_NAME+="-test"
fi

NAME="${NAME:-$CONT_NAME}"

docker run -itd           \
    --name "$NAME"        \
    --network "$NETWORK"  \
    --publish "$PORT":80  \
    -e SF_URL="$SF_URL"   \
    -e SF_ENV="$SF_ENV"   \
    -e SF_USER="$SF_USER" \
    -e SF_PASS="$SF_PASS" \
    docker.shingo.org/"$IMG_NAME":"$TAG"
