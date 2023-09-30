import { IPC } from './IPC';

interface GithubRelease {
    html_url: string;
    name: string;
}

export interface Version {
    Title: string;
    Number: number;
    ReleaseURL: string;
}

export class Updater {
    private static latestVersion: Version;

    /**
     * Is the current version of the app the latest release available
     */
    public static async GetNewerRelease(): Promise<Version> {
        const options = await IPC.getOptions();
        if (!options.CheckForUpdates) {
            return undefined;
        }

        const currentVersion = parseInt(IPC.packageVersion.replace(/\./g, ''));

        if (!this.latestVersion) {
            try {
                await this.getLatestRelease();
            } catch (err) {
                console.error('Error checking for updates', err);
                return undefined;
            }
        }

        if (currentVersion < this.latestVersion.Number) {
            return this.latestVersion;
        }

        return undefined;
    }

    private static async getLatestRelease(): Promise<Version> {
        const latest = await this.getRelease();
        const latestVersionNumber = parseInt(latest.name.replace(/\./g, ''));
        console.log('Update check complete', {
            'latest-version': latest.name,
            'current-version': IPC.packageVersion
        });
        Updater.latestVersion = {
            Title: latest.name,
            Number: latestVersionNumber,
            ReleaseURL: latest.html_url,
        };

        return Updater.latestVersion;
    }

    private static async getRelease(): Promise<GithubRelease> {
        const response = await fetch('https://api.github.com/repos/tls-inspector/certbox-desktop/releases/latest', {
            headers: {
                'User-Agent': IPC.packageName + '@' + IPC.packageVersion,
                Accept: 'application/vnd.github.v3+json',
            }
        });
        const data = await response.json();
        return data as GithubRelease;
    }
}