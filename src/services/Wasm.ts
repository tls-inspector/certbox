import { Certificate, CertificateRequest } from '../types/types';
import { Rand } from './Rand';

export interface WasmError {
    error: string;
}

export interface PingParameters {
    nonce: string;
}

export interface PingResponse {
    nonce: string;
}

export interface ImportRootCertificateResponse {
    certificate: Certificate;
}

export interface CloneCertificateResponse {
    certificate: CertificateRequest;
}

export interface ExportCertificateParameters {
    requests: CertificateRequest[];
    imported_root?: Certificate;
    format: string;
    password?: string;
}

export interface ExportedFile {
    name: string;
    mime: string;
    data: string;
}

export interface ExportCertificateResponse {
    files: ExportedFile[];
}

export interface ZipFilesParameters {
    files: ExportedFile[];
}

export interface ZipFilesResponse {
    file: ExportedFile;
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
                    const reply = Wasm.Ping({ nonce: nonce });
                    if (reply.nonce !== nonce) {
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
        if ((response as WasmError).error) {
            throw new Error((response as WasmError).error);
        }
        return response as PingResponse;
    }

    public static ImportRootCertificate(data: Uint8Array, password: string): ImportRootCertificateResponse {
        const response = JSON.parse(this.wasm.ImportRootCertificate(Array.prototype.slice.call(data), password));
        if ((response as WasmError).error) {
            throw new Error((response as WasmError).error);
        }
        return response as ImportRootCertificateResponse;
    }

    public static CloneCertificate(data: Uint8Array): CloneCertificateResponse {
        const response = JSON.parse(this.wasm.CloneCertificate(Array.prototype.slice.call(data)));
        if ((response as WasmError).error) {
            throw new Error((response as WasmError).error);
        }
        return response as CloneCertificateResponse;
    }

    public static ExportCertificate(params: ExportCertificateParameters): ExportCertificateResponse {
        const response = JSON.parse(this.wasm.ExportCertificate(JSON.stringify(params)));
        if ((response as WasmError).error) {
            throw new Error((response as WasmError).error);
        }
        return response as ExportCertificateResponse;
    }

    public static GetVersion(): string {
        return this.wasm.GetVersion();
    }

    public static ZipFiles(params: ZipFilesParameters): ZipFilesResponse {
        const response = JSON.parse(this.wasm.ZipFiles(JSON.stringify(params)));
        if ((response as WasmError).error) {
            throw new Error((response as WasmError).error);
        }
        return response as ZipFilesResponse;
    }
}
