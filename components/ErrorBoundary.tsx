import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props { children: ReactNode; }
interface State { hasError: boolean; }

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }
    static getDerivedStateFromError(): State {
        return { hasError: true };
    }
    componentDidCatch(error: Error, info: ErrorInfo) {
        console.error('Hexaflex error:', error, info);
    }
    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    justifyContent: 'center', height: '100vh', background: '#0f172a',
                    color: '#fff', fontFamily: 'serif', textAlign: 'center', padding: '2rem'
                }}>
                    <h1 style={{ fontSize: '2rem', marginBottom: '1rem', letterSpacing: '0.2em' }}>HEXAFLEX</h1>
                    <p style={{ opacity: 0.6, marginBottom: '2rem' }}>Something went wrong. Please refresh to continue.</p>
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            padding: '0.75rem 2rem', borderRadius: '2rem',
                            border: '1px solid rgba(255,255,255,0.2)',
                            background: 'rgba(255,255,255,0.1)', color: '#fff',
                            cursor: 'pointer', fontSize: '0.875rem', letterSpacing: '0.1em'
                        }}
                    >
                        Reload App
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
