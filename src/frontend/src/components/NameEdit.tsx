import * as React from 'react';
import { Name } from '../shared/types';
import { Input } from './Input';
import { Section } from './Section';

interface NameEditProps {
    defaultValue: Name;
    onChange: (request: Name) => (void);
}
export const NameEdit: React.FC<NameEditProps> = (props: NameEditProps) => {
    const [Name, setName] = React.useState(props.defaultValue);

    React.useEffect(() => {
        props.onChange(Name);
    }, [Name]);

    const onChangeOrganization = (Organization: string) => {
        setName(name => {
            name.Organization = Organization;
            return {...name};
        });
    };

    const onChangeCity = (City: string) => {
        setName(name => {
            name.City = City;
            return {...name};
        });
    };

    const onChangeProvince = (Province: string) => {
        setName(name => {
            name.Province = Province;
            return {...name};
        });
    };

    const onChangeCountry = (Country: string) => {
        setName(name => {
            name.Country = Country;
            return {...name};
        });
    };

    const onChangeCommonName = (CommonName: string) => {
        setName(name => {
            name.CommonName = CommonName;
            return {...name};
        });
    };


    return (
        <Section title="Subject Name">
            <Input label="Organization" defaultValue={Name.Organization} onChange={onChangeOrganization} />
            <Input label="City" defaultValue={Name.City} onChange={onChangeCity} />
            <Input label="Province" defaultValue={Name.Province} onChange={onChangeProvince} />
            <Input label="Country" defaultValue={Name.Country} onChange={onChangeCountry} />
            <Input label="Common Name" defaultValue={Name.CommonName} onChange={onChangeCommonName} required />
        </Section>
    );
};
