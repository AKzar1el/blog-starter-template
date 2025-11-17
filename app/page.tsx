import Link from 'next/link';
import { getAllPosts } from '@/lib/db/posts';
import PostCard from '@/components/PostCard';

// Force dynamic rendering for pages that use the database
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home() {
  const posts = await getAllPosts(6);
  const postsWithParsedTags = posts.map(post => ({
    ...post,
    tags: JSON.parse(post.tags),
  }));

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-50 via-white to-accent-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-accent-900/20 py-20 sm:py-32 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-accent-100/40 dark:bg-accent-900/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-100/40 dark:bg-blue-900/20 rounded-full blur-3xl"></div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl fade-in-up">
              Welcome to Our
              <span className="text-accent-600 dark:text-accent-400 bg-gradient-to-r from-accent-600 to-accent-700 dark:from-accent-400 dark:to-accent-500 bg-clip-text text-transparent"> Professional Blog</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto fade-in-up-delay-1">
              Discover insights, articles, and thoughts on technology, development,
              and innovation. Stay updated with our latest posts and join our community.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6 fade-in-up-delay-2">
              <Link href="/blog" className="btn-primary">
                Explore Articles
              </Link>
              <Link href="/about" className="btn-secondary">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Posts Section */}
      <section className="py-16 sm:py-24 bg-white dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12 fade-in">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                Latest Articles
              </h2>
              <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
                Stay updated with our most recent insights and stories
              </p>
            </div>
            {posts.length > 0 && (
              <Link
                href="/blog"
                className="hidden sm:flex items-center text-sm font-medium text-accent-600 dark:text-accent-400 hover:text-accent-700 dark:hover:text-accent-300 transition-all hover:gap-2 gap-1"
              >
                View all posts
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            )}
          </div>

          {posts.length === 0 ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                <svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No posts yet</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">Get started by creating your first blog post using our API.</p>
              <Link href="/about" className="btn-primary">
                Learn How to Post
              </Link>
            </div>
          ) : (
            <>
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

              <div className="mt-12 text-center sm:hidden">
                <Link href="/blog" className="btn-primary">
                  View All Posts
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative bg-gradient-to-br from-accent-600 to-accent-700 dark:from-accent-700 dark:to-accent-800 py-16 overflow-hidden">
        {/* Decorative Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '32px 32px'
          }}></div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center relative">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl fade-in">
            Stay in the loop
          </h2>
          <p className="mt-4 text-lg text-accent-100 dark:text-accent-200 max-w-2xl mx-auto fade-in-delay-1">
            Subscribe to our newsletter for the latest updates, articles, and insights delivered straight to your inbox.
          </p>
          <div className="mt-8 flex justify-center fade-in-delay-2">
            <div className="flex gap-4 w-full max-w-md">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg border-0 text-gray-900 dark:text-gray-100 dark:bg-gray-800 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-white dark:focus:ring-accent-400 shadow-lg focus:shadow-xl transition-shadow"
              />
              <button className="px-6 py-3 bg-white dark:bg-gray-100 text-accent-600 dark:text-accent-700 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-white hover:shadow-xl transition-all hover:scale-105 active:scale-100 shadow-lg">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
