> [!CAUTION]
> **CertBox is being discontinued**  
> The CertBox web and desktop app will no longer be available after September 1st 2025

---

# CertBox

**[Access CertBox Online »](https://web.certbox.io)**  
**[Download CertBox Desktop »](https://certbox.io/desktop.html)**  

CertBox is a X.509 certificate toolbox on your desktop or in your browser. It allows you to easily generate entire certificate chains, issue certificates from existing roots, clone certificates, and more.

CertBox uses a Golang backend for all cryptographic operations. On the web, this is accessed through a WASM module. On the desktop, this is a companion application.

## Building

Requirements:

- Golang (most recent version)
- NodeJS (most recent mainline release)
- Docker/Podman _(Linux only)_

### CertBox Desktop

```bash
cd src/desktop
node release.js
```

Packaged executables will be in the `package` directory.

### CertBox Web

```bash
cd src/web
node release.js
```

Compiled web application will be in the `dist` directory.
