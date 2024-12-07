#!/bin/bash

if [ -z "${CACHE_KEY}" ]; then
    CACHE_KEY=badbeef
fi

rm -rf "dist"
cd ../certbox/cmd/certgen
./wasm.sh
cd ../../../web
npm --prefer-offline ci
NODE_ENV=production CACHE_KEY=${CACHE_KEY} npx webpack --mode production --config webpack.js
