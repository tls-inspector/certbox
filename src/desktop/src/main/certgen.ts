import { Certificate, CertificateRequest } from '../shared/types';
import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
import { log } from './log';

enum CertGenActions {
    Ping = 'PING',
    ImportRootCertificate = 'IMPORT_ROOT_CERTIFICATE',
    CloneCertificate = 'CLONE_CERTIFICATE',
    GenerateCertificates = 'GENERATE_CERTIFICATES',
    ExportCertificates = 'EXPORT_CERTIFICATES',
    GetVersion = 'GET_VERSION',
    ConvertPEMtoDER = 'CONVERT_PEM_DER',
    ConvertDERtoPEM = 'CONVERT_DER_PEM',
    ExtractPKCS12 = 'EXTRACT_P12',
    CreatePKCS12 = 'CREATE_PKCS12',
}

export class certgen {
    public static certgenExePath: string = undefined;

    private static async runCertgen(action: CertGenActions, config: unknown): Promise<string> {
        return new Promise((resolve, reject) => {
            let process: ChildProcessWithoutNullStreams;
            try {
                log.debug(certgen.certgenExePath, [action]);
                process = spawn(certgen.certgenExePath, [action]);
            } catch (err) {
                log.error('Error spawning process', err);
                reject(err);
                return;
            }

            let output = '';
            process.stdout.on('data', data => {
                log.debug('stdout', data.toString());
                output += data;
            });

            let error = '';
            process.stderr.on('data', data => {
                log.error('stderr', data.toString());
                error += data;
            });

            process.on('close', code => {
                if (code === 0) {
                    resolve(output);
                } else {
                    log.error('Certgen error', { code: code, error: error });
                    reject(error.trim());
                }
            });

            process.stdin.write(JSON.stringify(config));
            process.stdin.end();
        });
    }

    public static async test(): Promise<void> {
        const config = {
            Nonce: 'certgen_'+Math.random()
        };

        interface pingRespone {
            OK: boolean;
            Nonce: string;
        }

        return this.runCertgen(CertGenActions.Ping, config).then(output => {
            const response = JSON.parse(output) as pingRespone;
            if (!response.OK || response.Nonce !== config.Nonce) {
                throw new Error('Invalid response from certgen backend');
            }
        });
    }

    public static async importRootCertificate(data: string, password: string): Promise<Certificate> {
        const config = {
            Data: data,
            Password: password,
        };

        log.debug('Importing certificate', config);
        return this.runCertgen(CertGenActions.ImportRootCertificate, config).then(output => {
            return JSON.parse(output) as Certificate;
        });
    }

    public static async cloneCertificate(data: string): Promise<CertificateRequest> {
        const config = {
            Data: data,
        };

        log.debug('Clone certificate', config);
        return this.runCertgen(CertGenActions.CloneCertificate, config).then(output => {
            return JSON.parse(output) as CertificateRequest;
        });
    }

    public static async generateCertificates(requests: CertificateRequest[], importedRoot: Certificate): Promise<Certificate[]> {
        const config = {
            Requests: requests,
            ImportedRoot: importedRoot,
        };

        log.debug('Generating certificate', config);
        return this.runCertgen(CertGenActions.GenerateCertificates, config).then(output => {
            return JSON.parse(output) as Certificate[];
        });
    }

    public static async exportCertificates(exportDir: string, certificates: Certificate[], format: string, password: string): Promise<string[]> {
        const config = {
            ExportDir: exportDir,
            Certificates: certificates,
            Format: format,
            Password: password,
        };

        log.debug('Exporting certificate', config);
        return this.runCertgen(CertGenActions.ExportCertificates, config).then(output => {
            return JSON.parse(output) as string[];
        });
    }

    public static async getVersion(): Promise<string> {
        interface responseType {
            Version: string;
        }

        return this.runCertgen(CertGenActions.GetVersion, {}).then(output => {
            const response = JSON.parse(output) as responseType;
            return response.Version;
        });
    }
}