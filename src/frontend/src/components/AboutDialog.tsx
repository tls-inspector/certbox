import * as React from 'react';
import { RuntimeVersions } from '../shared/types';
import { Interop } from '../Interop';
import { Link } from './Link';
import { Dialog } from './Dialog';
import '../css/About.scss';

export const AboutDialog: React.FC = () => {
    const [Loading, setLoading] = React.useState(true);
    const [Versions, setVersions] = React.useState<RuntimeVersions>();

    React.useEffect(() => {
        Interop.getVersions().then(versions => {
            setVersions(versions);
            setLoading(false);
        });
    }, []);

    const versionContent = () => {
        if (Loading) {
            return null;
        }

        return (
            <p>
                Application: <strong>{Versions.app}</strong><br />
                Electron: <strong>{Versions.electron}</strong><br />
                Node.js: <strong>{Versions.nodejs}</strong><br />
                Golang: <strong>{Versions.golang}</strong><br />
            </p>
        );
    };

    return (<Dialog title="About Certbox" buttons={[{ label: 'Dismiss' }]}>
        <div className="about">
            <div className="image">
                <img src="assets/img/certbox.png" alt="Certbox" />
            </div>
            <div className="contents">
                <h1>Certbox</h1>
                <p>Copyright &copy; <Link url="https://ianspence.com">Ian Spence</Link> 2021-2023. Released under the <Link url="https://opensource.org/license/mit/">MIT license</Link>. Source code available at <Link url="https://github.com/tls-inspector/certbox">github.com/tls-inspector/certbox</Link>.</p>
                {versionContent()}
            </div>
        </div>
    </Dialog>);
};
