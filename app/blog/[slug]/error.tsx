'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function BlogPostError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Blog post error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-accent-600">Error</h1>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mt-4 mb-2">
          Failed to load article
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
          We had trouble loading this article. This could be a temporary issue -- please try again.
        </p>
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={reset}
            className="btn-primary"
          >
            Try Again
          </button>
          <Link href="/blog" className="btn-secondary">
            Browse Articles
          </Link>
        </div>
      </div>
    </div>
  );
}
