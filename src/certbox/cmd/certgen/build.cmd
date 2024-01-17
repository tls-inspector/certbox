@echo off

set GOOS=windows
set CGO_ENABLED=no

set GOARCH=amd64
go build -ldflags="-s -w" -trimpath -buildmode=exe -o certgen_win32_x64.exe

set GOARCH=arm64
go build -ldflags="-s -w" -trimpath -buildmode=exe -o certgen_win32_arm64.exe
