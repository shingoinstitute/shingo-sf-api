#!/bin/bash

TAG=$1
PORT=$2

if [ -z "$1" ]; then
    TAG="local"
fi
if [ -z "$2" ]; then
    PORT=3000;
fi

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

docker build --tag shingo-sf-api:${TAG} .

docker network create shingo-dev-net

docker kill shingo-redis
docker rm shingo-redis

docker run -itd                                             \
    --name shingo-redis                                     \
    --volume $(pwd)/build/redis:/data                       \
    --network shingo-dev-net                                \
    redis redis-server

docker kill shingo-sf-api
docker rm shingo-sf-api

docker run -itd                 \
    -e SF_USER=${SF_USER}       \
    -e SF_PASS=${SF_PASS}       \
    -e SF_ENV=${SF_ENV}         \
    -e SF_URL=${SF_URL}         \
    --name shingo-sf-api        \
    --network shingo-dev-net    \
    --volume $(pwd):/code       \
    shingo-sf-api:${TAG}