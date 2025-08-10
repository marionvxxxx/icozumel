'use client';

import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  return (
    <div className="max-w-md mx-auto mt-8 rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="flex flex-col space-y-1.5 p-6">
        <h3 className="text-2xl font-semibold leading-none tracking-tight flex items-center space-x-2 text-red-600">
          <AlertTriangle className="h-5 w-5" />
          <span>Something went wrong</span>
        </h3>
      </div>
      <div className="p-6 pt-0 space-y-4">
        <p className="text-sm text-gray-600">
          We encountered an unexpected error. Please try refreshing the page.
        </p>
        
        {process.env.NODE_ENV === 'development' && (
          <details className="text-xs bg-gray-100 p-2 rounded">
            <summary className="cursor-pointer font-medium">Error details</summary>
            <pre className="mt-2 whitespace-pre-wrap">{error.message}</pre>
            <pre className="mt-2 whitespace-pre-wrap text-xs">{error.stack}</pre>
          </details>
        )}
        
        <button 
          onClick={resetErrorBoundary} 
          className="w-full inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Try again
        </button>
      </div>
    </div>
  );
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<ErrorFallbackProps>;
}

export function ErrorBoundary({ children, fallback }: ErrorBoundaryProps) {
  const [hasError, setHasError] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    const handleError = (error: ErrorEvent) => {
      setHasError(true);
      setError(new Error(error.message));
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  const resetErrorBoundary = () => {
    setHasError(false);
    setError(null);
  };

  if (hasError && error) {
    const FallbackComponent = fallback || ErrorFallback;
    return <FallbackComponent error={error} resetErrorBoundary={resetErrorBoundary} />;
  }

  return <>{children}</>;
}