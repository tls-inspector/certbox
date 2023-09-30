#!/bin/sh
set -e
set -x

cd /build_root
npm init -y
npm i --save electron-installer-debian
node package_deb.js