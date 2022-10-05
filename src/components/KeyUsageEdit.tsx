import * as React from 'react';
import { KeyUsage } from '../types/types';
import { Checkbox } from './Checkbox';
import { Section } from './Section';
import '../css/Checkbox.scss';

interface KeyUsageEditProps {
    defaultValue: KeyUsage;
    onChange: (request: KeyUsage) => (void);
}
export const KeyUsageEdit: React.FC<KeyUsageEditProps> = (props: KeyUsageEditProps) => {
    const [Usage, setUsage] = React.useState(props.defaultValue);

    React.useEffect(() => {
        if (!Usage) {
            return;
        }

        props.onChange(Usage);
    }, [Usage]);

    const onChangeDigitalSignature = (DigitalSignature: boolean) => {
        setUsage(usage => {
            usage.DigitalSignature = DigitalSignature;
            return { ...usage };
        });
    };

    const onChangeContentCommitment = (ContentCommitment: boolean) => {
        setUsage(usage => {
            usage.ContentCommitment = ContentCommitment;
            return { ...usage };
        });
    };

    const onChangeKeyEncipherment = (KeyEncipherment: boolean) => {
        setUsage(usage => {
            usage.KeyEncipherment = KeyEncipherment;
            return { ...usage };
        });
    };

    const onChangeDataEncipherment = (DataEncipherment: boolean) => {
        setUsage(usage => {
            usage.DataEncipherment = DataEncipherment;
            return { ...usage };
        });
    };

    const onChangeKeyAgreement = (KeyAgreement: boolean) => {
        setUsage(usage => {
            usage.KeyAgreement = KeyAgreement;
            return { ...usage };
        });
    };

    const onChangeCertSign = (CertSign: boolean) => {
        setUsage(usage => {
            usage.CertSign = CertSign;
            return { ...usage };
        });
    };

    const onChangeCRLSign = (CRLSign: boolean) => {
        setUsage(usage => {
            usage.CRLSign = CRLSign;
            return { ...usage };
        });
    };

    const onChangeEncipherOnly = (EncipherOnly: boolean) => {
        setUsage(usage => {
            usage.EncipherOnly = EncipherOnly;
            return { ...usage };
        });
    };

    const onChangeDecipherOnly = (DecipherOnly: boolean) => {
        setUsage(usage => {
            usage.DecipherOnly = DecipherOnly;
            return { ...usage };
        });
    };

    const onChangeServerAuth = (ServerAuth: boolean) => {
        setUsage(usage => {
            usage.ServerAuth = ServerAuth;
            return { ...usage };
        });
    };

    const onChangeClientAuth = (ClientAuth: boolean) => {
        setUsage(usage => {
            usage.ClientAuth = ClientAuth;
            return { ...usage };
        });
    };

    const onChangeCodeSigning = (CodeSigning: boolean) => {
        setUsage(usage => {
            usage.CodeSigning = CodeSigning;
            return { ...usage };
        });
    };

    const onChangeEmailProtection = (EmailProtection: boolean) => {
        setUsage(usage => {
            usage.EmailProtection = EmailProtection;
            return { ...usage };
        });
    };

    const onChangeTimeStamping = (TimeStamping: boolean) => {
        setUsage(usage => {
            usage.TimeStamping = TimeStamping;
            return { ...usage };
        });
    };

    const onChangeOCSPSigning = (OCSPSigning: boolean) => {
        setUsage(usage => {
            usage.OCSPSigning = OCSPSigning;
            return { ...usage };
        });
    };


    return (
        <Section title="Key Usage">
            <div className="checkbox-forest">
                <Checkbox label="Digital Signature" defaultValue={Usage.DigitalSignature} onChange={onChangeDigitalSignature} />
                <Checkbox label="Content Commitment" defaultValue={Usage.ContentCommitment} onChange={onChangeContentCommitment} />
                <Checkbox label="Key Encipherment" defaultValue={Usage.KeyEncipherment} onChange={onChangeKeyEncipherment} />
                <Checkbox label="Data Encipherment" defaultValue={Usage.DataEncipherment} onChange={onChangeDataEncipherment} />
                <Checkbox label="Key Agreement" defaultValue={Usage.KeyAgreement} onChange={onChangeKeyAgreement} />
                <Checkbox label="Certificate Sign" defaultValue={Usage.CertSign} onChange={onChangeCertSign} />
                <Checkbox label="CRL Sign" defaultValue={Usage.CRLSign} onChange={onChangeCRLSign} />
                <Checkbox label="Encipher Only" defaultValue={Usage.EncipherOnly} onChange={onChangeEncipherOnly} />
                <Checkbox label="Decipher Only" defaultValue={Usage.DecipherOnly} onChange={onChangeDecipherOnly} />
                <Checkbox label="Server Authentication" defaultValue={Usage.ServerAuth} onChange={onChangeServerAuth} />
                <Checkbox label="Client Authentication" defaultValue={Usage.ClientAuth} onChange={onChangeClientAuth} />
                <Checkbox label="Code Signing" defaultValue={Usage.CodeSigning} onChange={onChangeCodeSigning} />
                <Checkbox label="Email Protection" defaultValue={Usage.EmailProtection} onChange={onChangeEmailProtection} />
                <Checkbox label="Time Stamping" defaultValue={Usage.TimeStamping} onChange={onChangeTimeStamping} />
                <Checkbox label="OCSP Signing" defaultValue={Usage.OCSPSigning} onChange={onChangeOCSPSigning} />
            </div>
        </Section>
    );
};
