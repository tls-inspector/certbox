import * as React from 'react';
import { KeyType } from '../types/types';
import { Radio, RadioChoice } from './Radio';
import { Section } from './Section';

interface KeyTypeEditProps {
    defaultValue: KeyType;
    onChange: (keyType: KeyType) => (void);
}
export const KeyTypeEdit: React.FC<KeyTypeEditProps> = (props: KeyTypeEditProps) => {
    const [Value, setValue] = React.useState(props.defaultValue);

    React.useEffect(() => {
        props.onChange(Value);
    }, [Value]);

    const didChangeType = (t: string) => {
        setValue(t as KeyType);
    };

    const choices: RadioChoice[] = [
        {
            label: 'RSA (2048)',
            value: KeyType.KeyTypeRSA_2048,
        },
        {
            label: 'RSA (4096)',
            value: KeyType.KeyTypeRSA_4096,
        },
        {
            label: 'RSA (8192)',
            value: KeyType.KeyTypeRSA_8192,
        },
        {
            label: 'ECDSA (P256)',
            value: KeyType.KeyTypeECDSA_256,
        },
        {
            label: 'ECDSA (P384)',
            value: KeyType.KeyTypeECDSA_384,
        }
    ];

    return (
        <Section title="Key Type">
            <Radio label="Type" choices={choices} defaultValue={Value} onChange={didChangeType} />
        </Section>
    );
};
