import { Certificate, CertificateRequest } from '../types/types';
import { Rand } from './Rand';

export interface WasmError {
    Error: string;
}

export interface PingParameters {
    Nonce: string;
}

export interface PingResponse {
    Nonce: string;
}

export interface ImportRootCertificateResponse {
    Certificate: Certificate;
}

export interface CloneCertificateResponse {
    Certificate: CertificateRequest;
}

export interface ExportCertificateParameters {
    Requests: CertificateRequest[];
    ImportedRoot?: Certificate;
    Format: string;
    Password?: string;
}

export interface ExportedFile {
    Name: string;
    Mime: string;
    Data: string;
}

export interface ExportCertificateResponse {
    Files: ExportedFile[];
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
    ExportCertificate: (...args: string[]) => string;
    GetVersion: (...args: string[]) => string;
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

    public static ImportRootCertificate(data: Uint8Array, password: string): ImportRootCertificateResponse {
        const response = JSON.parse(this.wasm.ImportRootCertificate(Array.prototype.slice.call(data), password));
        if ((response as WasmError).Error) {
            throw new Error((response as WasmError).Error);
        }
        return response as ImportRootCertificateResponse;
    }

    public static CloneCertificate(data: Uint8Array): CloneCertificateResponse {
        const response = JSON.parse(this.wasm.CloneCertificate(Array.prototype.slice.call(data)));
        if ((response as WasmError).Error) {
            throw new Error((response as WasmError).Error);
        }
        return response as CloneCertificateResponse;
    }

    public static ExportCertificate(params: ExportCertificateParameters): ExportCertificateResponse {
        const response = JSON.parse(this.wasm.ExportCertificate(JSON.stringify(params)));
        if ((response as WasmError).Error) {
            throw new Error((response as WasmError).Error);
        }
        return response as ExportCertificateResponse;
    }

    public static GetVersion(): string {
        return this.wasm.GetVersion();
    }

    public static ZipFiles(params: ZipFilesParameters): ZipFilesResponse {
        const response = JSON.parse(this.wasm.ZipFiles(JSON.stringify(params)));
        if ((response as WasmError).Error) {
            throw new Error((response as WasmError).Error);
        }
        return response as ZipFilesResponse;
    }
}
