import * as React from 'react';
import { AlternateNameType, Certificate, CertificateRequest, DefaultCertificateRequest, KeyType } from './types/types';
import { CertificateList } from './components/CertificateList';
import { Calendar } from './services/Calendar';
import { Button } from './components/Button';
import { CertificateEdit } from './components/CertificateEdit';
import { Icon } from './components/Icon';
import { Validator } from './services/Validator';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Rand } from './services/Rand';
import { GlobalDialogFrame } from './components/DialogFrame';
import { GlobalMenuFrame } from './components/MenuFrame';
import { ImportPasswordDialog } from './components/ImportPasswordDialog';
import { ExportDialog } from './components/ExportDialog';
import { Wasm } from './services/Wasm';
import { Filesystem } from './services/Filesystem';
import { WasmErrorDialog } from './components/ErrorDialog';
import { Footer } from './components/Footer';
import './css/App.scss';

const blankRequest = (isRoot: boolean): CertificateRequest => {
    const request: CertificateRequest = DefaultCertificateRequest();

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
};

interface AppState {
    importedRoot?: Certificate;
    certificates: CertificateRequest[];
    selectedCertificateIdx: number;
    certificateEditKey: string;
}
export const App: React.FC = () => {
    const [State, setState] = React.useState<AppState>({
        certificates: [blankRequest(true)],
        selectedCertificateIdx: 0,
        certificateEditKey: Rand.ID(),
    });
    const [InvalidCertificates, SetInvalidCertificates] = React.useState<{ [index: number]: string }>({});
    const [IsLoading, SetIsLoading] = React.useState(true);
    const [WasmFailed, SetWasmFailed] = React.useState(false);

    React.useEffect(() => {
        Wasm.Init().then(() => {
            SetIsLoading(false);
        }, () => {
            SetWasmFailed(true);
        });
    }, []);

    React.useEffect(() => {
        validateCertificates();
    }, [State]);

    const didClickCertificate = (idx: number) => {
        setState(state => {
            state.selectedCertificateIdx = idx;
            state.certificateEditKey = Rand.ID();
            return { ...state };
        });
    };

    const validateCertificates = () => {
        SetInvalidCertificates(invalidCertificates => {
            invalidCertificates = {};
            State.certificates.forEach((certificate, idx) => {
                if (certificate.Imported) {
                    return;
                }

                const invalidReason = Validator.CertificateRequest(certificate);
                if (!invalidReason) {
                    return;
                }

                invalidCertificates[idx] = invalidReason;
            });

            return { ...invalidCertificates };
        });
    };

    const importRoot = async () => {
        let p12Data: Uint8Array;
        try {
            p12Data = await Filesystem.ReadFile('.p12,.pfx,application/x-pkcs12');
        } catch {
            return;
        }

        const loadCertificate = (certificate: Certificate) => {
            setState(state => {
                const certificates = state.certificates;
                certificates[0] = {
                    KeyType: KeyType.KeyTypeECDSA_256,
                    Subject: certificate.Subject,
                    Validity: {
                        NotBefore: Calendar.now(),
                        NotAfter: Calendar.addDays(365),
                    },
                    AlternateNames: [],
                    Usage: {},
                    IsCertificateAuthority: true,
                    Imported: true
                };
                state.certificates = certificates;
                state.importedRoot = certificate;
                state.certificateEditKey = Rand.ID();
                return { ...state };
            });
        };

        GlobalDialogFrame.showDialog(<ImportPasswordDialog onImport={loadCertificate} p12Data={p12Data}/>);
    };

    const cloneCertificate = async (idx: number) => {
        const pemData = await Filesystem.ReadFile('.cer,.crt,.pem,.txt,application/x-pem-file');
        const response = Wasm.CloneCertificate(pemData);
        setState(state => {
            state.certificates[idx] = response.certificate;
            state.certificateEditKey = Rand.ID();
            return { ...state };
        });
    };

    const certificateMenuAction = (idx: number, action: 'import' | 'duplicate' | 'clone' | 'delete') => {
        switch (action) {
            case 'import':
                importRoot();
                break;
            case 'duplicate':
                setState(state => {
                    const copyCertificate = JSON.parse(JSON.stringify(state.certificates[idx])) as CertificateRequest;
                    state.certificates.push(copyCertificate);
                    return { ...state };
                });
                break;
            case 'clone':
                cloneCertificate(idx);
                break;
            case 'delete':
                setState(state => {
                    let selectedCertificateIdx = state.selectedCertificateIdx;
                    if (idx <= state.selectedCertificateIdx) {
                        selectedCertificateIdx--;
                    }
                    state.certificates.splice(idx, 1);
                    state.selectedCertificateIdx = selectedCertificateIdx;
                    state.certificateEditKey = Rand.ID();
                    return { ...state };
                });
                break;
        }
    };

    const addButtonClick = () => {
        setState(state => {
            const newLength = state.certificates.push(blankRequest(false));
            state.selectedCertificateIdx = newLength - 1;
            state.certificateEditKey = Rand.ID();
            return { ...state };
        });
    };

    const didChangeCertificate = (certificate: CertificateRequest) => {
        setState(state => {
            state.certificates[state.selectedCertificateIdx] = certificate;
            return { ...state };
        });
    };

    const didCancelImport = () => {
        setState(state => {
            state.certificates[0] = blankRequest(true);
            state.certificateEditKey = Rand.ID();
            return { ...state };
        });
    };

    const generateCertificateClick = () => {
        if (GlobalDialogFrame.dialogOpen()) {
            return;
        }

        GlobalDialogFrame.showDialog(<ExportDialog requests={State.certificates} importedRoot={State.importedRoot} />);
    };

    const addButtonDisabled = () => {
        return State.certificates.length > 128;
    };

    if (WasmFailed) {
        return (
            <div className="dialog-backdrop">
                <WasmErrorDialog />
            </div>
        );
    }

    if (IsLoading) {
        return (<ErrorBoundary><Icon.Label icon={<Icon.Spinner pulse />} label="Loading..." /></ErrorBoundary>);
    }

    return (<ErrorBoundary>
        <div id="main">
            <div className="certificate-list">
                <CertificateList certificates={State.certificates} selectedIdx={State.selectedCertificateIdx} onClick={didClickCertificate} menuAction={certificateMenuAction} invalidCertificates={InvalidCertificates} />
                <div className="certificate-list-footer">
                    <Button onClick={addButtonClick} disabled={addButtonDisabled()}>
                        <Icon.Label icon={<Icon.PlusCircle />} label="Add Certificate" />
                    </Button>
                </div>
            </div>
            <div className="certificate-view">
                <CertificateEdit defaultValue={State.certificates[State.selectedCertificateIdx]} onChange={didChangeCertificate} onCancelImport={didCancelImport} key={State.certificateEditKey} />
            </div>
            <Footer onClick={generateCertificateClick} disabled={Object.keys(InvalidCertificates).length > 0} />
        </div>
        <GlobalDialogFrame />
        <GlobalMenuFrame />
    </ErrorBoundary>);
};
