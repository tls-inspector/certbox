import { Calendar } from '../services/Calendar';

export interface Certificate {
    CertificateAuthority: boolean;
    Subject: Name;
    CertificateData: string;
    KeyData: string;
}

export enum KeyType {
	KeyTypeECDSA_256 = 'ecc256',
}

export enum SignatureType {
    SignatureAlgorithmSHA256 = 'sha256',
}

export interface CertificateRequest {
    KeyType: KeyType;
    SignatureAlgorithm: SignatureType;
    Subject: Name;
    Validity: DateRange;
    AlternateNames?: AlternateName[];
    Usage: KeyUsage;
    IsCertificateAuthority?: boolean;
    Imported?: boolean;
}

export const DefaultCertificateRequest = (): CertificateRequest => {
    return {
        KeyType: KeyType.KeyTypeECDSA_256,
        SignatureAlgorithm: SignatureType.SignatureAlgorithmSHA256,
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
            CertSign: true,
        },
        IsCertificateAuthority: true
    };
};

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

export interface ExportedCertificate {
    Files: string[];
}

export interface RuntimeVersions {
    app: string;
    electron: string;
    nodejs: string;
    golang: string;
}
