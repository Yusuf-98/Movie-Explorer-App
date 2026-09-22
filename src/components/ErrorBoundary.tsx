import { Component, type ErrorInfo, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-6xl bg-neutral-950 text-center px-xl">
        {/* Icon */}
        <span className="text-6xl">⚠️</span>

        {/* Message */}
        <p className="text-base-white text-size-xl font-semibold">Something went wrong</p>
        <p className="text-neutral-400 text-size-sm max-w-md">
          An unexpected error occurred. Try again, or head back to the home page.
        </p>

        {/* Actions */}
        <div className="flex items-center gap-lg">
          <button
            onClick={this.handleReset}
            className="px-3xl py-md rounded-full bg-neutral-800 text-base-white text-size-sm font-semibold hover:bg-neutral-700 transition-colors cursor-pointer"
          >
            Try again
          </button>
          <button
            onClick={() => window.location.assign('/')}
            className="px-3xl py-md rounded-full bg-primary-300 text-base-white text-size-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer"
          >
            Back to home
          </button>
        </div>
      </div>
    );
  }
}
