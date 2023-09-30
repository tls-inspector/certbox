#!/bin/bash
set -e
set -x

ARCH='x64'
if [[ $(uname -m) == "aarch64" ]]; then
    ARCH='arm64'
fi
NODE_VERSION=$(curl -sS https://nodejs.org/download/release/index.json | jq -r '.[0].version')

wget https://nodejs.org/dist/${NODE_VERSION}/node-${NODE_VERSION}-linux-${ARCH}.tar.xz
xz --decompress node-${NODE_VERSION}-linux-${ARCH}.tar.xz
tar -xf node-${NODE_VERSION}-linux-${ARCH}.tar
rm node-${NODE_VERSION}-linux-${ARCH}.tar
mv node-${NODE_VERSION}-linux-${ARCH} /usr/share/node
ln -s /usr/share/node/bin/node /usr/bin/node
ln -s /usr/share/node/lib/node_modules/npm/bin/npm-cli.js /usr/bin/npm
ln -s /usr/share/node/lib/node_modules/npm/bin/npx-cli.js /usr/bin/npx
