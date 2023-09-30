import * as React from 'react';
import { Interop } from '../Interop';

interface ErrorBoundaryProps {
    children?: React.ReactNode;
}
interface ErrorBoundaryState {
    didCatch?: boolean;
}
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = {};
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        console.error(error);
        return { didCatch: true };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
        Interop.fatalError(error, errorInfo);
    }

    render(): JSX.Element {
        if (this.state.didCatch) {
            return (<h1>A fatal error ocurred</h1>);
        }

        return (
            <React.Fragment>
                { this.props.children }
            </React.Fragment>
        );
    }
}
