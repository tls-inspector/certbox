#!/bin/bash
set -e

cd desktop
ncu -u && npm i && npm audit fix
cd ../

cd web
ncu -u && npm i && npm audit fix
cd ../
