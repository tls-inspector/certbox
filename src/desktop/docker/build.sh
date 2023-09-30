#!/bin/sh
set -e

VERSION=${1:?Version Required}

cd deb
./build.sh
cd ../
cd rpm
./build.sh
cd ../

mv deb/*.deb ../package/artifacts/
mv rpm/*.rpm ../package/artifacts/
