#!/bin/sh
set -e

ARCH='x64'
if [[ $(uname -m) == "aarch64" ]]; then
    ARCH='arm64'
fi

podman build -t certificate_factory_deb_build:latest .

rm -rf build_root
mkdir -p build_root/package
cp package_deb.js build_root
cp -r "../../package/Certbox-linux-${ARCH}" build_root/package

podman run --rm --user root -v $(readlink -f build_root):/build_root:z certificate_factory_deb_build:latest

cp build_root/package/artifacts/*.deb .
rm -rf build_root
