import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function handleApiError(error: unknown): NextResponse {
  console.error('API Error:', error);

  // Zod validation errors
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: 'Validation failed',
        details: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      },
      { status: 400 }
    );
  }

  // Custom app errors
  if (error instanceof AppError) {
    return NextResponse.json(
      {
        error: error.message,
        code: error.code,
      },
      { status: error.statusCode }
    );
  }

  // Supabase errors
  if (error && typeof error === 'object' && 'message' in error) {
    const supabaseError = error as { message: string; code?: string };
    return NextResponse.json(
      {
        error: 'Database operation failed',
        details: supabaseError.message,
      },
      { status: 500 }
    );
  }

  // Generic errors
  return NextResponse.json(
    {
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' 
        ? (error as Error)?.message || 'Unknown error'
        : 'Something went wrong',
    },
    { status: 500 }
  );
}

export function createErrorBoundary(fallback: React.ComponentType<{ error: Error }>) {
  return function ErrorBoundary({ children }: { children: React.ReactNode }) {
    return (
      <div>
        {/* Error boundary implementation would go here */}
        {children}
      </div>
    );
  };
}