import * as React from 'react';
import { BlankCertificateRequest, Certificate, CertificateRequest, KeyType, SignatureAlgorithm } from './shared/types';
import { CertificateList } from './components/CertificateList';
import { Calendar } from './services/Calendar';
import { Button } from './components/Button';
import { CertificateEdit } from './components/CertificateEdit';
import { Interop } from './Interop';
import { Footer } from './components/Footer';
import { Icon } from './components/Icon';
import { Validator } from './services/Validator';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Rand } from './services/Rand';
import { Link } from './components/Link';
import { GlobalDialogFrame } from './components/DialogFrame';
import { GlobalMenuFrame } from './components/Menu';
import { AboutDialog } from './components/AboutDialog';
import { OptionsDialog } from './components/OptionsDialog';
import { ImportPasswordDialog } from './components/ImportPasswordDialog';
import { ExportDialog } from './components/ExportDialog';
import './css/App.scss';

interface AppState {
    importedRoot?: Certificate;
    certificates: CertificateRequest[];
    selectedCertificateIdx: number;
    certificateEditKey: string;
}
export const App: React.FC = () => {
    const [State, setState] = React.useState<AppState>({
        certificates: [BlankCertificateRequest(true)],
        selectedCertificateIdx: 0,
        certificateEditKey: Rand.ID(),
    });
    const [InvalidCertificates, setInvalidCertificates] = React.useState<{ [index: number]: string }>({});
    const [NewVersionURL, setNewVersionURL] = React.useState<string>();
    const [LoadingInterop, SetIsLoadingInterop] = React.useState(true);
    const [InteropError, SetInteropError] = React.useState(false);
    const [IsLoading, setIsLoading] = React.useState(false);

    const importedCertificate = (certificate: Certificate) => {
        setState(state => {
            const certificates = state.certificates;
            certificates[0] = {
                KeyType: KeyType.KeyTypeECDSA_256,
                SignatureAlgorithm: SignatureAlgorithm.SignatureAlgorithmSHA256,
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

    React.useEffect(() => {
        Interop.init().then(() => {
            SetIsLoadingInterop(false);
        }).catch(() => {
            SetInteropError(true);
            SetIsLoadingInterop(false);
        });

        if (Interop.isDesktop) {
            Interop.checkForUpdates().then(newerVersionURL => {
                if (newerVersionURL) {
                    setNewVersionURL(newerVersionURL);
                }
            });
        }

        Interop.onImportedCertificate(certificate => {
            importedCertificate(certificate);
        });

        Interop.onGetImportPassword(() => {
            return new Promise((resolve, reject) => {
                if (!GlobalDialogFrame.dialogOpen()) {
                    GlobalDialogFrame.showDialog(<ImportPasswordDialog onSubmit={(password, cancelled) => {
                        if (cancelled) {
                            reject();
                        } else if (password) {
                            resolve(password);
                        }
                    }} />);
                }
            });
        });

        Interop.onShowAboutDialog(() => {
            if (!GlobalDialogFrame.dialogOpen()) {
                GlobalDialogFrame.showDialog(<AboutDialog />);
            }
        });

        Interop.onShowOptionsDialog(() => {
            if (!GlobalDialogFrame.dialogOpen()) {
                GlobalDialogFrame.showDialog(<OptionsDialog />);
            }
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
        setInvalidCertificates(invalidCertificates => {
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

    // desktop only
    const didShowCertificateContextMenu = (idx: number) => {
        const certificate = State.certificates[idx];
        if (certificate.IsCertificateAuthority) {
            Interop.showCertificateContextMenu(true);
        } else {
            Interop.showCertificateContextMenu(false).then(action => {
                switch (action) {
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
                    case 'clone':
                        Interop.cloneCertificate().then(request => {
                            if (!request) {
                                return;
                            }

                            setState(state => {
                                state.certificates[idx] = request;
                                state.certificateEditKey = Rand.ID();
                                return { ...state };
                            });
                        });
                        break;
                    case 'duplicate':
                        setState(state => {
                            const copyCertificate = JSON.parse(JSON.stringify(certificate)) as CertificateRequest;
                            state.certificates.push(copyCertificate);
                            return { ...state };
                        });
                        break;
                }
            });
        }
    };

    // web only
    const certificateMenuAction = (idx: number, action: 'import' | 'duplicate' | 'clone' | 'delete') => {
        switch (action) {
            case 'import':
                Interop.importCertificate();
                break;
            case 'duplicate':
                setState(state => {
                    const copyCertificate = JSON.parse(JSON.stringify(state.certificates[idx])) as CertificateRequest;
                    state.certificates.push(copyCertificate);
                    return { ...state };
                });
                break;
            case 'clone':
                webCloneCertificate(idx);
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

    const webCloneCertificate = async (idx: number) => {
        Interop.cloneCertificate().then(certificate => {
            setState(state => {
                state.certificates[idx] = certificate;
                state.certificateEditKey = Rand.ID();
                return { ...state };
            });
        });
    };

    const addButtonClick = () => {
        setState(state => {
            const newLength = state.certificates.push(BlankCertificateRequest(false));
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
            state.certificates[0] = BlankCertificateRequest(true);
            state.certificateEditKey = Rand.ID();
            return { ...state };
        });
    };

    const generateCertificateClick = () => {
        if (GlobalDialogFrame.dialogOpen()) {
            return;
        }

        const dismissed = () => {
            setIsLoading(false);
        };

        setIsLoading(true);
        GlobalDialogFrame.showDialog(<ExportDialog requests={State.certificates} importedRoot={State.importedRoot} dismissed={dismissed} />);
    };

    const addButtonDisabled = () => {
        return State.certificates.length > 128;
    };

    const newVersionBanner = () => {
        if (!NewVersionURL) {
            return null;
        }

        return (<div className="new-version">
            <strong>A newer version is available</strong>
            <Link url={NewVersionURL}>Click here to view</Link>
        </div>);
    };

    if (LoadingInterop) {
        return (
            <Icon.Label icon={<Icon.Spinner pulse/>} label="Loading..." />
        );
    }

    if (InteropError) {
        return (
            <div id="main">
                <div className="dialog">
                    <div className="dialog-title">
                        Certbox Error
                    </div>
                    <div className="dialog-body">
                        <p>Certbox uses a WebAssembly (WASM) module to provide cryptographic functions. Some browsers, notably Microsoft Edge, may disable WASM as part of their enhanced security setting.</p>
                        <p>Please ensure that WebAssembly is not disabled for <u>web.certbox.io</u>.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (<ErrorBoundary>
        <div id="main">
            <div className="certificate-list">
                {newVersionBanner()}
                <CertificateList certificates={State.certificates} selectedIdx={State.selectedCertificateIdx} onClick={didClickCertificate} onShowContextMenu={didShowCertificateContextMenu} menuAction={certificateMenuAction} invalidCertificates={InvalidCertificates} />
                <div className="certificate-list-footer">
                    <Button onClick={addButtonClick} disabled={addButtonDisabled()}>
                        <Icon.Label icon={<Icon.PlusCircle />} label="Add Certificate" />
                    </Button>
                </div>
            </div>
            <div className="certificate-view">
                <CertificateEdit defaultValue={State.certificates[State.selectedCertificateIdx]} onChange={didChangeCertificate} onCancelImport={didCancelImport} key={State.certificateEditKey} />
            </div>
            <Footer onClick={generateCertificateClick} disabled={Object.keys(InvalidCertificates).length > 0 || IsLoading} />
        </div>
        <GlobalDialogFrame />
        <GlobalMenuFrame />
    </ErrorBoundary>);
};
