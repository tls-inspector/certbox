@echo off

set GOOS=windows
set GOARCH=amd64
set CGO_ENABLED=no

go build -ldflags="-s -w" -trimpath -buildmode=exe -o certgen_win32_x64.exe
