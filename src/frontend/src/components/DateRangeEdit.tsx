import * as React from 'react';
import { DateRange } from '../shared/types';
import { Input } from './Input';
import { Section } from './Section';
import '../css/DateRange.scss';

interface DateRangeEditProps {
    defaultValue: DateRange;
    onChange: (dateRange: DateRange) => (void);
}
export const DateRangeEdit: React.FC<DateRangeEditProps> = (props: DateRangeEditProps) => {
    const [Value, setValue] = React.useState(props.defaultValue);
    const [NotBefore, setNotBefore] = React.useState(props.defaultValue.NotBefore.split('T')[0]);
    const [NotAfter, setNotAfter] = React.useState(props.defaultValue.NotAfter.split('T')[0]);

    React.useEffect(() => {
        props.onChange(Value);
    }, [Value]);

    React.useEffect(() => {
        setValue(value => {
            value.NotBefore = NotBefore + 'T00:00:00.00Z';
            value.NotAfter = NotAfter + 'T23:59:59.99Z';
            return {...value};
        });
    }, [NotBefore, NotAfter]);

    const onChangeNotBefore = (NotBefore: string) => {
        setNotBefore(NotBefore);
    };

    const onChangeNotAfter = (NotAfter: string) => {
        setNotAfter(NotAfter);
    };

    return (
        <Section title="Date Range">
            <div className="date-range">
                <div className="not-before">
                    <Input label="Not Before" type="date" defaultValue={NotBefore} onChange={onChangeNotBefore} required />
                </div>
                <div className="not-after">
                    <Input label="Not After" type="date" defaultValue={NotAfter} onChange={onChangeNotAfter} required />
                </div>
            </div>
        </Section>
    );
};
