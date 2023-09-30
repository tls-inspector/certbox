import * as React from 'react';
import '../css/Input.scss';
import { Rand } from '../services/Rand';

interface InputProps {
    label: string;
    placeholder?: string;
    type?: 'text'|'password'|'email'|'date'|'oid';
    defaultValue?: string;
    onChange?: (value: string) => (void);
    disabled?: boolean;
    required?: boolean;
    autofocus?: boolean;
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

    return (
        <div className="input">
            <label htmlFor={id}>
                <span className="label">{ props.label }{ requiredFlag }</span>
                { input() }
            </label>
        </div>
    );
};

interface TextInputProps {
    defaultValue?: string;
    id: string;
    placeholder?: string;
    type?: 'text'|'password'|'email'|'date';
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