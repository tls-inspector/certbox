import * as React from 'react';
import { Rand } from '../services/Rand';
import '../css/Input.scss';

interface InputProps {
    label: string;
    placeholder?: string;
    type?: 'text'|'password'|'email'|'date'|'datetime-local'|'oid';
    defaultValue?: string;
    onChange?: (value: string) => (void);
    disabled?: boolean;
    required?: boolean;
    autofocus?: boolean;
    helpText?: string;
}
export const Input: React.FC<InputProps> = (props: InputProps) => {
    const id = Rand.ID();

    const requiredFlag = props.required ? (<span className="input-required">*</span>) : null;

    const input = () => {
        if (props.type === 'oid') {
            return (<OIDInput id={id} placeholder={props.placeholder} defaultValue={props.defaultValue} onChange={props.onChange} disabled={props.disabled} required={props.required} autofocus={props.autofocus}/>);
        }

        return (<TextInput id={id} placeholder={props.placeholder} defaultValue={props.defaultValue} type={props.type} onChange={props.onChange} disabled={props.disabled} required={props.required} autofocus={props.autofocus}/>);
    };

    const helpText = () => {
        if (!props.helpText) {
            return null;
        }

        return (<span className="help-text">{ props.helpText }</span>);
    };

    return (
        <div className="input">
            <label htmlFor={id}>
                <span className="label">{ props.label }{ requiredFlag }</span>
                { input() }
                { helpText() }
            </label>
        </div>
    );
};

interface TextInputProps {
    defaultValue?: string;
    id: string;
    placeholder?: string;
    type?: 'text'|'password'|'email'|'date'|'datetime-local';
    onChange?: (value: string) => (void);
    disabled?: boolean;
    required?: boolean;
    autofocus?: boolean;
}
export const TextInput: React.FC<TextInputProps> = (props: TextInputProps) => {
    const [Value, setValue] = React.useState(props.defaultValue || '');

    React.useEffect(() => {
        props.onChange(Value);
    }, [Value]);

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setValue(value);
    };

    return (
        <input id={props.id} name={props.id} placeholder={props.placeholder} className="input" type={props.type || 'text'} onChange={onChange} defaultValue={props.defaultValue} required={props.required} disabled={props.disabled} autoFocus={props.autofocus}/>
    );
};

interface NumberInputProps {
    label: string;
    placeholder?: string;
    onChange: (value: number) => (void);
    defaultValue: number;
    required?: boolean;
    disabled?: boolean;
    minimum?: number;
    maximum?: number;
    helpText?: string;
}
export const NumberInput: React.FC<NumberInputProps> = (props: NumberInputProps) => {
    const [value, setValue] = React.useState<string>(props.defaultValue ? props.defaultValue.toString() : '');
    const labelID = Rand.ID();

    React.useEffect(() => {
        props.onChange(parseInt(value));
    }, [value]);

    const onChange = (event: React.FormEvent<HTMLInputElement>) => {
        const target = event.target as HTMLInputElement;
        setValue(target.value);
        props.onChange(parseFloat(target.value));
    };

    const input = () => {
        let defaultValue = '';

        if (!isNaN(props.defaultValue)) {
            defaultValue = props.defaultValue.toString();
        }

        return (
            <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                className="input"
                id={labelID}
                placeholder={props.placeholder}
                defaultValue={defaultValue}
                disabled={props.disabled}
                onChange={onChange}
            />
        );
    };

    const requiredFlag = props.required ? (<span className="input-required">*</span>) : null;

    const helpText = () => {
        if (!props.helpText) {
            return null;
        }

        return (<span className="help-text">{ props.helpText }</span>);
    };

    return (
        <div className="input">
            <label htmlFor={labelID}>
                <span className="label">{ props.label }{ requiredFlag }</span>
                { input() }
                { helpText() }
            </label>
        </div>
    );
};

interface OIDInputProps {
    defaultValue?: string;
    id: string;
    placeholder?: string;
    onChange?: (value: string) => (void);
    disabled?: boolean;
    required?: boolean;
    autofocus?: boolean;
}
export const OIDInput: React.FC<OIDInputProps> = (props: OIDInputProps) => {
    const [Value, setValue] = React.useState(props.defaultValue || '');

    React.useEffect(() => {
        props.onChange(Value);
    }, [Value]);

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setValue(value);
    };

    return (
        <input
                type="text"
                inputMode="numeric"
                pattern="[0-9\.]*"
                className="input"
                id={props.id}
                placeholder={props.placeholder}
                defaultValue={props.defaultValue}
                disabled={props.disabled}
                onChange={onChange}
            />
    );
};