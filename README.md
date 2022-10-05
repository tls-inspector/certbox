# CertBox

CertBox is a web-based application for generating X.509 certificates.

## Building

### Requirements

- Golang (latest)
- node.js LTS & NPM

### Build WebAssembly Module

```
cd certgen
./build.sh
```

### Build Web Application

**For Development**

```
npm i
npx webpack --config webpack.js
```

**For Release**

```
npm i
NODE_ENV=production npx webpack --config webpack.js --mode production
```
