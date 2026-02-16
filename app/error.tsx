'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-accent-600">Oops</h1>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mt-4 mb-2">
          Something went wrong
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
          An unexpected error occurred. Please try again or return to the homepage.
        </p>
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={reset}
            className="btn-primary"
          >
            Try Again
          </button>
          <Link href="/" className="btn-secondary">
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
