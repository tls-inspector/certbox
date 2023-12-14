import * as React from 'react';
import { CertificateExtension } from '../shared/types';
import { Section } from './Section';
import { Button } from './Button';
import { Dialog } from './Dialog';
import { GlobalDialogFrame } from './DialogFrame';
import { Input, NumberInput } from './Input';
import { Icon } from './Icon';
import '../css/Checkbox.scss';
import { Radio } from './Radio';

interface ExtensionsEditProps {
    defaultValue: CertificateExtension[];
    onChange: (request: CertificateExtension[]) => (void);
}
export const ExtensionsEdit: React.FC<ExtensionsEditProps> = (props: ExtensionsEditProps) => {
    const [Extensions, setExtensions] = React.useState(props.defaultValue);

    React.useEffect(() => {
        if (!Extensions) {
            return;
        }

        props.onChange(Extensions);
    }, [Extensions]);

    const editExtension = (idx: number) => {
        return () => {
            const onChange = (extension?: CertificateExtension) => {
                if (!extension) {
                    return;
                }
    
                setExtensions(ext => {
                    ext[idx] = extension;
                    return [...ext];
                });
            };
    
            GlobalDialogFrame.showDialog(<ExtensionDialog defaultValue={Extensions[idx]} onChange={onChange}/>);
        };
    };

    const deleteExtension = (idx: number) => {
        return () => {
            setExtensions(ext => {
                ext.splice(idx, 1);
                return [...ext];
            });
        };
    };

    const addExtensionClick = () => {
        const onChange = (extension?: CertificateExtension) => {
            if (!extension) {
                return;
            }

            setExtensions(ext => {
                ext.push(extension);
                return [...ext];
            });
        };

        GlobalDialogFrame.showDialog(<ExtensionDialog defaultValue={{ OID: '', Value: '' }} onChange={onChange}/>);
    };

    return (
        <Section title="Extensions">
            {
                Extensions.map((ext, idx) => {
                    return (<div key={idx}>
                        <Button small onClick={editExtension(idx)}><Icon.Pencil /></Button>
                        <Button small onClick={deleteExtension(idx)}><Icon.Trash /></Button>
                        <strong>{ext.OID} </strong>
                        <code>{ext.Value as string}</code>
                    </div>);
                })
            }
            <Button small onClick={addExtensionClick}>Add Extension</Button>
        </Section>
    );
};

interface ExtensionDialogProps {
    defaultValue: CertificateExtension;
    onChange: (extension?: CertificateExtension) => (void);
}
const ExtensionDialog: React.FC<ExtensionDialogProps> = (props: ExtensionDialogProps) => {
    const [OID, SetOID] = React.useState(props.defaultValue.OID);
    const [Value, SetValue] = React.useState(props.defaultValue.Value);
    const [ValueType, SetValueType] = React.useState('String');

    React.useEffect(() => {
        switch (typeof props.defaultValue.Value) {
            case 'string':
                if (!Number.isNaN(Date.parse(props.defaultValue.Value))) {
                    SetValueType('Time');
                } else {
                    SetValueType('String');
                }
                break;
            case 'number':
                SetValueType('Number');
                break;
        }
    }, []);

    const changeOID = (oid: string) => {
        SetOID(oid);
    };

    const changeValueType = (valueType: string) => {
        SetValue('');
        SetValueType(valueType);
    };
    
    const changeStringValue = (value: string) => {
        SetValue(value);
    };

    const changeNumberValue = (value: number) => {
        SetValue(value);
    };

    const changeTimeValue = (value: string) => {
        SetValue(value);
    };

    const valueTypeChoices = [
        {
            label: 'String',
            value: 'String',
        },
        {
            label: 'Number',
            value: 'Number',
        },
        {
            label: 'Time',
            value: 'Time',
        }
    ];

    const valueField = () => {
        switch (ValueType) {
            case 'String':
                return (<Input type="text" placeholder="example" label="Value" defaultValue={Value as string} onChange={changeStringValue} required />);
            case 'Number':
                return (<NumberInput placeholder="1234" label="Value" defaultValue={Value as number} onChange={changeNumberValue} required />);
            case 'Time':
                return (<Input type="datetime-local" placeholder="example" label="Value" defaultValue={Value as string} onChange={changeTimeValue} required />);
        }
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
                props.onChange({
                    OID: OID,
                    Value: Value,
                });
                return Promise.resolve(true);
            }
        }
    ];

    return (
        <Dialog title="Custom Extended Key Usage" buttons={buttons}>
            <Input type="oid" placeholder="1.3.6.1.5.5.7.3.1" label="OID" defaultValue={OID} onChange={changeOID} required />
            <Radio label="Type" choices={valueTypeChoices} defaultValue={ValueType} onChange={changeValueType} />
            { valueField() }
        </Dialog>
    );
};
