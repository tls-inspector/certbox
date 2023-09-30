#!/bin/bash
set -e

VERSION=$(git describe)
BUILD_ID=$(date -u +"%Y%m%d%H%M%S")

if [[ $(uname) == 'Linux' ]]; then
    CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -ldflags="-s -w -X 'main.Version=${VERSION}' -X 'main.BuildId=${BUILD_ID}'" -trimpath -buildmode=exe -o certgen_linux_x64
    CGO_ENABLED=0 GOOS=linux GOARCH=arm64 go build -ldflags="-s -w -X 'main.Version=${VERSION}' -X 'main.BuildId=${BUILD_ID}'" -trimpath -buildmode=exe -o certgen_linux_arm64
fi

if [[ $(uname) == 'Darwin' ]]; then
    CGO_ENABLED=0 GOOS=darwin GOARCH=amd64 go build -ldflags="-s -w -X 'main.Version=${VERSION}' -X 'main.BuildId=${BUILD_ID}'" -trimpath -buildmode=exe -o certgen_darwin_x64
    CGO_ENABLED=0 GOOS=darwin GOARCH=arm64 go build -ldflags="-s -w -X 'main.Version=${VERSION}' -X 'main.BuildId=${BUILD_ID}'" -trimpath -buildmode=exe -o certgen_darwin_arm64
fi
