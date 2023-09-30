#!/bin/bash
set -e

VERSION=$(git describe 2>/dev/null || echo "unknown")
BUILD_ID=$(date -u +"%Y%m%d%H%M%S")

GOOS=js GOARCH=wasm go build -ldflags="-s -w -X 'main.Version=${VERSION}' -X 'main.BuildId=${BUILD_ID}'" -trimpath -o certgen.wasm
