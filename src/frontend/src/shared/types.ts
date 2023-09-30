import { Calendar } from '../services/Calendar';

export interface Certificate {
    CertificateAuthority: boolean;
    Subject: Name;
    CertificateData: string;
    KeyData: string;
}

export enum KeyType {
	KeyTypeRSA_2048 = 'rsa2048',
	KeyTypeRSA_4096 = 'rsa4096',
	KeyTypeRSA_8192 = 'rsa8192',
	KeyTypeECDSA_256 = 'ecc256',
	KeyTypeECDSA_384 = 'ecc384',
}

export enum SignatureAlgorithm {
    SignatureAlgorithmSHA256 = 'sha256',
    SignatureAlgorithmSHA384 = 'sha384',
    SignatureAlgorithmSHA512 = 'sha512',
}

export interface CertificateRequest {
    KeyType: KeyType;
    SignatureAlgorithm: SignatureAlgorithm;
    Subject: Name;
    Validity: DateRange;
    AlternateNames?: AlternateName[];
    Usage: KeyUsage;
    IsCertificateAuthority?: boolean;
    Imported?: boolean;
}

export function BlankCertificateRequest(isRoot: boolean): CertificateRequest {
    const request: CertificateRequest = {
        KeyType: KeyType.KeyTypeECDSA_256,
        SignatureAlgorithm: SignatureAlgorithm.SignatureAlgorithmSHA256,
        Subject: {
            Organization: '',
            City: '',
            Province: '',
            Country: '',
            CommonName: '',
        },
        Validity: {
            NotBefore: Calendar.now(),
            NotAfter: Calendar.addDays(365),
        },
        AlternateNames: [],
        Usage: {
            DigitalSignature: true,
            CertSign: true
        },
        IsCertificateAuthority: true
    };

    if (!isRoot) {
        request.AlternateNames = [
            {
                Type: AlternateNameType.DNS,
                Value: ''
            }
        ];
        request.Usage = {
            DigitalSignature: true,
            KeyEncipherment: true,
            ServerAuth: true,
            ClientAuth: true,
        };
        request.IsCertificateAuthority = false;
    }

    return request;
}

export interface Name {
    Organization: string;
    City: string;
    Province: string;
    Country: string;
    CommonName: string;
}

export interface DateRange {
    NotBefore: string;
    NotAfter: string;
}

export interface AlternateName {
    Type: AlternateNameType;
    Value: string
}

export enum AlternateNameType {
    DNS = 'dns',
    Email = 'email',
    IP = 'ip',
    URI = 'uri',
}

export interface ExportParams {
    Format: ExportFormatType;
    Password: string;
}

export enum ExportFormatType {
    PKCS12 = 'PKCS12',
    PEM = 'PEM',
    DER = 'DER',
}

export interface KeyUsage {
    // Basic
    DigitalSignature?: boolean;
    ContentCommitment?: boolean;
    KeyEncipherment?: boolean;
    DataEncipherment?: boolean;
    KeyAgreement?: boolean;
    CertSign?: boolean;
    CRLSign?: boolean;
    EncipherOnly?: boolean;
    DecipherOnly?: boolean;

    // Extended
    ServerAuth?: boolean;
    ClientAuth?: boolean;
    CodeSigning?: boolean;
    EmailProtection?: boolean;
    TimeStamping?: boolean;
    OCSPSigning?: boolean;
    CustomEKUs?: string[];
}

export interface RuntimeVersions {
    app: string;
    electron: string;
    nodejs: string;
    golang: string;
}

export interface ExportedFile {
    Name: string;
    Mime: string;
    Data: string;
}
