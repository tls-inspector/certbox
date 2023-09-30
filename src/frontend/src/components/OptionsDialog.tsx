import * as React from 'react';
import { Interop } from '../Interop';
import { Dialog } from './Dialog';
import { Options } from '../shared/options';
import { Checkbox } from './Checkbox';

export const OptionsDialog: React.FC = () => {
    const [Loading, SetLoading] = React.useState(true);
    const [Options, SetOptions] = React.useState<Options>();

    React.useEffect(() => {
        Interop.getOptions().then(options => {
            SetOptions(options);
            SetLoading(false);
        });
    }, []);

    if (Loading) {
        return null;
    }

    const buttons = [
        {
            label: 'Save',
            onClick: () => {
                return Interop.setOptions(Options).then(() => {
                    return true;
                });
            }
        },
        {
            label: 'Cancel'
        }
    ];

    const SetCheckForUpdates = (CheckForUpdates: boolean) => {
        SetOptions(options => {
            options.CheckForUpdates = CheckForUpdates;
            return {...options};
        });
    };

    const SetShowExportedCertificates = (ShowExportedCertificates: boolean) => {
        SetOptions(options => {
            options.ShowExportedCertificates = ShowExportedCertificates;
            return {...options};
        });
    };

    return (
        <Dialog title="Options" buttons={buttons}>
            <Checkbox defaultValue={Options.CheckForUpdates} onChange={SetCheckForUpdates} label="Check for updates" />
            <Checkbox defaultValue={Options.ShowExportedCertificates} onChange={SetShowExportedCertificates} label="Show Exported Certificates" />
        </Dialog>
    );
};
