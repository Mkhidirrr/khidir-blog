import { Component, ErrorInfo, ReactNode } from 'react';
import React from 'react';
import { handleError } from '../utils/errorHandler';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const safeError = handleError(error);
    this.setState({ 
      error: safeError.message,
      errorInfo: `Error Code: ${safeError.code}`
    });
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <h2 className="text-lg font-semibold text-red-800 dark:text-red-200">Something went wrong</h2>
          <p className="mt-2 text-red-600 dark:text-red-300">Please try refreshing the page</p>
        </div>
      );
    }

    return this.props.children;
  }
}
