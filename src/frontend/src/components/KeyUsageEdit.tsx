import * as React from 'react';
import { KeyUsage } from '../shared/types';
import { Checkbox } from './Checkbox';
import { Section } from './Section';
import { Button } from './Button';
import { Dialog } from './Dialog';
import { GlobalDialogFrame } from './DialogFrame';
import { Input } from './Input';
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
            return {...usage};
        });
    };

    const onChangeContentCommitment = (ContentCommitment: boolean) => {
        setUsage(usage => {
            usage.ContentCommitment = ContentCommitment;
            return {...usage};
        });
    };

    const onChangeKeyEncipherment = (KeyEncipherment: boolean) => {
        setUsage(usage => {
            usage.KeyEncipherment = KeyEncipherment;
            return {...usage};
        });
    };

    const onChangeDataEncipherment = (DataEncipherment: boolean) => {
        setUsage(usage => {
            usage.DataEncipherment = DataEncipherment;
            return {...usage};
        });
    };

    const onChangeKeyAgreement = (KeyAgreement: boolean) => {
        setUsage(usage => {
            usage.KeyAgreement = KeyAgreement;
            return {...usage};
        });
    };

    const onChangeCertSign = (CertSign: boolean) => {
        setUsage(usage => {
            usage.CertSign = CertSign;
            return {...usage};
        });
    };

    const onChangeCRLSign = (CRLSign: boolean) => {
        setUsage(usage => {
            usage.CRLSign = CRLSign;
            return {...usage};
        });
    };

    const onChangeEncipherOnly = (EncipherOnly: boolean) => {
        setUsage(usage => {
            usage.EncipherOnly = EncipherOnly;
            return {...usage};
        });
    };

    const onChangeDecipherOnly = (DecipherOnly: boolean) => {
        setUsage(usage => {
            usage.DecipherOnly = DecipherOnly;
            return {...usage};
        });
    };

    const onChangeServerAuth = (ServerAuth: boolean) => {
        setUsage(usage => {
            usage.ServerAuth = ServerAuth;
            return {...usage};
        });
    };

    const onChangeClientAuth = (ClientAuth: boolean) => {
        setUsage(usage => {
            usage.ClientAuth = ClientAuth;
            return {...usage};
        });
    };

    const onChangeCodeSigning = (CodeSigning: boolean) => {
        setUsage(usage => {
            usage.CodeSigning = CodeSigning;
            return {...usage};
        });
    };

    const onChangeEmailProtection = (EmailProtection: boolean) => {
        setUsage(usage => {
            usage.EmailProtection = EmailProtection;
            return {...usage};
        });
    };

    const onChangeTimeStamping = (TimeStamping: boolean) => {
        setUsage(usage => {
            usage.TimeStamping = TimeStamping;
            return {...usage};
        });
    };

    const onChangeOCSPSigning = (OCSPSigning: boolean) => {
        setUsage(usage => {
            usage.OCSPSigning = OCSPSigning;
            return {...usage};
        });
    };

    const customEkuClick = () => {
        const onChange = (oids?: string[]) => {
            if (!oids) {
                return;
            }

            setUsage(usage => {
                usage.CustomEKUs = oids;
                return {...usage};
            });
        };

        GlobalDialogFrame.showDialog(<CustomEkuDialog defaultValue={Usage.CustomEKUs} onChange={onChange}/>);
    };

    const customEkuLabel = () => {
        if (!Usage.CustomEKUs) {
            return null;
        }

        return (<span>{ Usage.CustomEKUs.length } value{ Usage.CustomEKUs.length == 1 ? '' : 's' }</span>);
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
            <div className="eku-custom">
                <Button small onClick={customEkuClick}>Custom</Button>
                { customEkuLabel() }
            </div>
        </Section>
    );
};

interface CustomEkuDialogProps {
    defaultValue: string[];
    onChange: (request?: string[]) => (void);
}
const CustomEkuDialog: React.FC<CustomEkuDialogProps> = (props: CustomEkuDialogProps) => {
    const [CustomEKUs, SetCustomEKUs] = React.useState(props.defaultValue || []);

    const changeEKUAtIdx = (idx: number) => {
        return (eku: string) => {
            SetCustomEKUs(ekus => {
                ekus[idx] = eku;
                return [...ekus];
            });
        };
    };

    const addButtonClick = () => {
        SetCustomEKUs(ekus => {
            return [...ekus, ''];
        });
    };

    const removeButtonClick = () => {
        SetCustomEKUs(ekus => {
            ekus.splice(ekus.length-1, 1);
            return [...ekus];
        });
    };

    const removeButtonEnabled = () => {
        return CustomEKUs.length > 0;
    };

    const buttons = [
        {
            label: 'Discard',
            onClick: () => {
                props.onChange();
                return Promise.resolve(true);
            }
        },
        {
            label: 'Apply',
            onClick: () => {
                const ekus = [...CustomEKUs];
                for (let i = ekus.length-1; i >= 0; i--) {
                    const valid = ekus[i].length > 0 && ekus[i].match(/[^0-9\\.]+/) == null;
                    if (valid) {
                        continue;
                    }
                    ekus.splice(i, 1);
                }
                props.onChange(ekus.length > 0 ? ekus : null);
                return Promise.resolve(true);
            }
        }
    ];

    return (
        <Dialog title="Custom Extended Key Usage" buttons={buttons}>
            {
                CustomEKUs.map((eku, idx) => {
                    return (<Input key={idx} type="oid" placeholder="1.3.6.1.5.5.7.3.1" label="OID" defaultValue={eku} onChange={changeEKUAtIdx(idx)} required />);
                })
            }
            <Button small onClick={addButtonClick}>+</Button>
            <Button small onClick={removeButtonClick} disabled={!removeButtonEnabled()}>-</Button>
        </Dialog>
    );
};