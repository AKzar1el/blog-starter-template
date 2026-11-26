import { searchPosts } from '@/lib/db/posts';
import PostCard from '@/components/PostCard';
import Link from 'next/link';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Search',
  description: 'Search for articles and posts.',
};

interface SearchPageProps {
  searchParams: Promise<{ q?: string | string[] }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = typeof q === 'string' ? q : '';
  const posts = query.trim() ? await searchPosts(query) : [];

  const postsWithParsedTags = posts.map(post => ({
    ...post,
    tags: JSON.parse(post.tags),
  }));

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-5xl mb-4">
            Search Results
          </h1>
          {query.trim() && (
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {posts.length === 0
                ? `No results found for "${query}"`
                : `Found ${posts.length} ${posts.length === 1 ? 'result' : 'results'} for "${query}"`}
            </p>
          )}
          {!query.trim() && (
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Enter a search query to find articles
            </p>
          )}
        </div>

        {/* Search Results */}
        {posts.length === 0 && query.trim() ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
              <svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No results found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Try searching with different keywords</p>
            <Link href="/blog" className="btn-primary">
              Browse All Posts
            </Link>
          </div>
        ) : posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {postsWithParsedTags.map((post) => (
              <PostCard
                key={post.id}
                slug={post.slug}
                title={post.title}
                excerpt={post.excerpt}
                author={post.author}
                publishedAt={post.publishedAt}
                tags={post.tags}
                coverImage={post.coverImage}
                category={post.category}
              />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
