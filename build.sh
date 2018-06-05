#!/bin/bash

TAG="${TAG:-latest}"

docker build --tag docker.shingo.org/shingo-events:"$TAG" "$@" .
