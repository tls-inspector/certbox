import { App } from './app';

export class log {
    public static debug(message?: unknown, ...optionalParams: unknown[]): void {
        if (App.isVerbose()) {
            console.log(message, ...optionalParams);
        }
    }

    public static error(message?: unknown, ...optionalParams: unknown[]): void {
        console.error(message, ...optionalParams);
    }

    public static warn(message?: unknown, ...optionalParams: unknown[]): void {
        console.warn(message, ...optionalParams);
    }
}