#!/bin/sh
set -e
set -x

cd /build_root
npm init -y
npm i --save electron-installer-redhat
patch /build_root/node_modules/electron-installer-redhat/resources/spec.ejs /spec.patch
node package_rpm.js