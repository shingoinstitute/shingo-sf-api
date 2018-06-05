#!/bin/bash

TAG="${TAG:-latest}"
NETWORK="${NETWORK:-shingo-net}"
PORT="${PORT:-80}"

if [ -z "$SF_USER" ]; then
    echo "Need the SF_USER env variable to be defined..."
    exit 1
fi

if [ -z "$SF_PASS" ]; then
    echo "Need the SF_PASS env variable to be defined..."
    exit 1
fi

if [ -z "$SF_ENV" ]; then
    echo "Need the SF_ENV env variable to be defined..."
    exit 1
fi

if [ -z "$SF_URL" ]; then
    echo "Need the SF_URL env variable to be defined..."
    exit 1
fi

docker run -itd           \
    --name shingo-sf-api  \
    --network "$NETWORK"  \
    -e LOG_PATH="/logs"   \
    -v /logs:/logs:rw     \
    docker.shingo.org/shingo-sf-api"$TAG"
