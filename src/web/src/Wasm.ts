import { Certificate, CertificateRequest, RuntimeVersions, ExportedFile } from './shared/types';
import { Rand } from './services/Rand';

export interface WasmError {
    Error: string;
}

export interface PingParameters {
    Nonce: string;
}

export interface PingResponse {
    Nonce: string;
}

export interface GenerateCertificatesParameters {
    Requests: CertificateRequest[];
    ImportedRoot?: Certificate;
}

export interface ExportCertificateParameters {
    Certificates: Certificate[];
    Format: string;
    Password?: string;
}

export interface ZipFilesParameters {
    Files: ExportedFile[];
}

export interface ZipFilesResponse {
    File: ExportedFile;
}

interface WasmBridge {
    Ping: (...args: string[]) => string;
    ImportRootCertificate: (data: number[], password: string) => string;
    CloneCertificate: (data: number[]) => string;
    GenerateCertificates: (...args: string[]) => string;
    ExportCertificates: (...args: string[]) => string;
    GetVersion: (...args: string[]) => string;
    GetVersions: (...args: string[]) => string;
    ZipFiles: (...args: string[]) => string;
}

export class Wasm {
    private static wasm: WasmBridge = window as unknown as WasmBridge;

    public static Init(): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const go = new (window as any).Go();
                WebAssembly.instantiateStreaming(fetch('wasm/certgen.wasm'), go.importObject).then((result) => {
                    go.run(result.instance);
                    const nonce = 'wasm-' + Rand.ID();
                    const reply = Wasm.Ping({ Nonce: nonce });
                    if (reply.Nonce !== nonce) {
                        throw new Error('bad nonce');
                    }
                    resolve();
                });
            } catch (ex) {
                reject(ex);
            }
        });
    }

    public static Ping(params: PingParameters): PingResponse {
        const response = JSON.parse(this.wasm.Ping(JSON.stringify(params)));
        if ((response as WasmError).Error) {
            throw new Error((response as WasmError).Error);
        }
        return response as PingResponse;
    }

    public static ImportRootCertificate(data: Uint8Array, password: string): Certificate {
        const response = JSON.parse(this.wasm.ImportRootCertificate(Array.prototype.slice.call(data), password));
        if ((response as WasmError).Error) {
            throw new Error((response as WasmError).Error);
        }
        return response as Certificate;
    }

    public static CloneCertificate(data: Uint8Array): CertificateRequest {
        const response = JSON.parse(this.wasm.CloneCertificate(Array.prototype.slice.call(data)));
        if ((response as WasmError).Error) {
            throw new Error((response as WasmError).Error);
        }
        return response as CertificateRequest;
    }

    public static GenerateCertificates(params: GenerateCertificatesParameters): Certificate[] {
        const response = JSON.parse(this.wasm.GenerateCertificates(JSON.stringify(params)));
        if ((response as WasmError).Error) {
            throw new Error((response as WasmError).Error);
        }
        return response as Certificate[];
    }

    public static ExportCertificates(params: ExportCertificateParameters): ExportedFile[] {
        const response = JSON.parse(this.wasm.ExportCertificates(JSON.stringify(params)));
        if ((response as WasmError).Error) {
            throw new Error((response as WasmError).Error);
        }
        return response as ExportedFile[];
    }

    public static GetVersion(): string {
        return this.wasm.GetVersion();
    }

    public static GetVersions(): RuntimeVersions {
        return JSON.parse(this.wasm.GetVersions()) as RuntimeVersions;
    }

    public static ZipFiles(params: ZipFilesParameters): ZipFilesResponse {
        const response = JSON.parse(this.wasm.ZipFiles(JSON.stringify(params)));
        if ((response as WasmError).Error) {
            throw new Error((response as WasmError).Error);
        }
        return response as ZipFilesResponse;
    }
}
