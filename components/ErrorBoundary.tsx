
import React, { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryProps {
  children?: ReactNode;
  appName: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary component to catch runtime errors in child components.
 */
// Fix: Extending React.Component explicitly ensures that the class inherits 'props' and 'setState' correctly in this environment.
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  // Fix: Explicitly defining the constructor and calling super(props) to properly initialize the base React.Component and its properties.
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Fix: Accessing 'appName' via 'this.props' which is correctly inherited from React.Component.
    const { appName } = this.props;
    console.error(`Uncaught error in ${appName}:`, error, errorInfo);
  }

  private handleRestart = () => {
    // Fix: Accessing 'setState' which is now correctly inherited from React.Component.
    this.setState({ hasError: false, error: null });
  };

  public render(): ReactNode {
    // Fix: Accessing 'state' and 'props' which are inherited from React.Component and correctly mapped to the class instance.
    const { hasError, error } = this.state;
    const { appName, children } = this.props;

    if (hasError) {
      return (
        <div className="h-full w-full flex flex-col items-center justify-center bg-[#0d1117] text-gray-300 p-6 text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Application Crashed</h2>
          <p className="text-sm text-gray-400 mb-6 max-w-xs">
            {appName} encountered an unexpected error.
            <br />
            <span className="text-xs font-mono mt-2 block bg-black/30 p-2 rounded text-red-400">
                {error?.message}
            </span>
          </p>
          <button
            onClick={this.handleRestart}
            className="flex items-center gap-2 px-4 py-2 bg-[#367BF0] hover:bg-[#2d6cdb] text-white rounded transition-colors"
          >
            <RefreshCw size={16} />
            Restart Application
          </button>
        </div>
      );
    }

    return children;
  }
}

export default ErrorBoundary;
