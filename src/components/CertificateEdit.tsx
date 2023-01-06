import * as React from 'react';
import { CertificateRequest, DateRange, Name, KeyUsage, AlternateName } from '../types/types';
import { AlternateNamesEdit } from './AlternateNameEdit';
import { DateRangeEdit } from './DateRangeEdit';
import { KeyUsageEdit } from './KeyUsageEdit';
import { NameEdit } from './NameEdit';
import { Button } from './Button';
import '../css/CertificateEdit.scss';

interface CertificateEditProps {
    defaultValue: CertificateRequest;
    onChange: (request: CertificateRequest) => (void);
    onCancelImport: () => (void);
}
export const CertificateEdit: React.FC<CertificateEditProps> = (props: CertificateEditProps) => {
    const [Request, setRequest] = React.useState(props.defaultValue);

    React.useEffect(() => {
        props.onChange(Request);
    }, [Request]);

    const onChangeDateRange = (Validity: DateRange) => {
        setRequest(request => {
            request.Validity = Validity;
            return { ...request };
        });
    };

    const onChangeSubject = (Subject: Name) => {
        setRequest(request => {
            request.Subject = Subject;
            return { ...request };
        });
    };

    const onChangeAlternateNames = (AlternateNames: AlternateName[]) => {
        setRequest(request => {
            request.AlternateNames = AlternateNames;
            return { ...request };
        });
    };

    const onChangeKeyUsage = (Usage: KeyUsage) => {
        setRequest(request => {
            request.Usage = Usage;
            return { ...request };
        });
    };

    if (!Request) {
        return null;
    }

    if (Request.Imported) {
        return (
            <div className="imported-certificate">
                <h2>Imported Certificate</h2>
                <p>You cannot make changes to imported certificates.</p>
                <Button onClick={props.onCancelImport}>Cancel Import</Button>
            </div>
        );
    }

    return (
        <div>
            <DateRangeEdit defaultValue={Request.Validity} onChange={onChangeDateRange} />
            <NameEdit defaultValue={Request.Subject} onChange={onChangeSubject} />
            <AlternateNamesEdit defaultValue={Request.AlternateNames} onChange={onChangeAlternateNames} />
            <KeyUsageEdit defaultValue={Request.Usage} onChange={onChangeKeyUsage} />
        </div>
    );
};
