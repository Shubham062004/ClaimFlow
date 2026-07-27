import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in ClaimFlow boundary:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-8 max-w-md w-full shadow-soft text-center space-y-4">
            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Something went wrong</h2>
            <p className="text-sm text-slate-500 leading-relaxed">
              An unexpected system error occurred. Our team has been notified.
            </p>
            {this.state.error && (
              <div className="p-3 bg-slate-50 rounded-xl text-left text-xs font-mono text-slate-600 overflow-x-auto border border-slate-200/60 max-h-32">
                {this.state.error.message}
              </div>
            )}
            <div className="pt-2">
              <Button variant="primary" onClick={this.handleReset} leftIcon={<RefreshCw className="w-4 h-4" />}>
                Reload Platform
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
