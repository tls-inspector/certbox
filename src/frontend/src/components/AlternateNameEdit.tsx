import * as React from 'react';
import { AlternateName, AlternateNameType } from '../shared/types';
import { Button } from './Button';
import { Input } from './Input';
import { Radio } from './Radio';
import { Section } from './Section';
import '../css/AlternateName.scss';

interface AlternateNamesEditProps {
    defaultValue: AlternateName[];
    onChange: (names: AlternateName[]) => (void);
}
export const AlternateNamesEdit: React.FC<AlternateNamesEditProps> = (props: AlternateNamesEditProps) => {
    const [Names, setNames] = React.useState(props.defaultValue);

    React.useEffect(() => {
        props.onChange(Names);
    }, [Names]);

    const changeNameAtIdx = (idx: number) => {
        return (name: AlternateName) => {
            setNames(names => {
                names[idx] = name;
                return [...names];
            });
        };
    };

    const addButtonClick = () => {
        setNames(names => {
            return [...names, {
                Type: AlternateNameType.DNS,
                Value: '',
            }];
        });
    };

    const removeButtonClick = () => {
        setNames(names => {
            names.splice(names.length-1, 1);
            return [...names];
        });
    };

    const removeButtonEnabled = () => {
        return Names.length > 0;
    };

    return (
        <Section title="Alternate Names">
            {
                Names.map((name, idx) => {
                    return (<AlternateNameEdit key={idx} defaultValue={name} onChange={changeNameAtIdx(idx)} />);
                })
            }
            <Button small onClick={addButtonClick}>+</Button>
            <Button small onClick={removeButtonClick} disabled={!removeButtonEnabled()}>-</Button>
        </Section>
    );
};

interface AlternateNameEditProps {
    defaultValue: AlternateName;
    onChange: (name: AlternateName) => (void);
}
const AlternateNameEdit: React.FC<AlternateNameEditProps> = (props: AlternateNameEditProps) => {
    const [Name, setName] = React.useState(props.defaultValue);

    React.useEffect(() => {
        props.onChange(Name);
    }, [Name]);

    const changeType = (Type: string) => {
        setName(name => {
            name.Type = Type as AlternateNameType;
            return {...name};
        });
    };

    const changeValue = (Value: string) => {
        setName(name => {
            name.Value = Value;
            return {...name};
        });
    };

    const typeChoices = [
        {
            value: AlternateNameType.DNS,
            label: 'DNS'
        },
        {
            value: AlternateNameType.Email,
            label: 'Email'
        },
        {
            value: AlternateNameType.IP,
            label: 'IP'
        },
        {
            value: AlternateNameType.URI,
            label: 'URI'
        }
    ];

    return (
        <div className="alternate-name">
            <Radio label="Type" choices={typeChoices} defaultValue={Name.Type} onChange={changeType} />
            <Input label="Value" defaultValue={Name.Value} onChange={changeValue} required />
        </div>
    );
};

