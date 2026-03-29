import { Component, ReactNode } from 'react';
import { FileText } from 'lucide-react';

interface Props { children: ReactNode }
interface State { hasError: boolean; errorMessage: string }

// Fix #14 — catches any uncaught component error instead of showing blank white screen
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, errorMessage: '' };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorMessage: error.message };
  }

  componentDidCatch(error: Error, info: unknown) {
    console.error('[ErrorBoundary]', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="empty-state" style={{ height: '100vh' }}>
          <FileText size={48} style={{ marginBottom: '1rem' }} />
          <p style={{ marginBottom: '0.5rem' }}>Something went wrong.</p>
          <p className="text-sm text-muted" style={{ marginBottom: '1.5rem', textTransform: 'none' }}>
            {this.state.errorMessage}
          </p>
          <button className="btn btn-primary" onClick={() => { window.location.href = '/'; }}>
            Return to Home
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
