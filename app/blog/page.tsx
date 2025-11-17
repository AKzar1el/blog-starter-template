import { getAllPosts, getPostCount, getPostsByCategory, getPostCountByCategory } from '@/lib/db/posts';
import PostCard from '@/components/PostCard';
import { Metadata } from 'next';
import { BLOG_CATEGORIES } from '@/lib/constants';

// Force dynamic rendering for pages that use the database
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Browse all our articles, insights, and stories on technology, development, and innovation.',
  openGraph: {
    title: 'Blog | Professional Blog',
    description: 'Browse all our articles, insights, and stories on technology, development, and innovation.',
  },
};

const POSTS_PER_PAGE = 12;

interface BlogPageProps {
  searchParams: { page?: string; category?: string };
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const currentPage = parseInt(searchParams.page || '1', 10);
  const selectedCategory = searchParams.category || 'All Blog Posts';
  const offset = (currentPage - 1) * POSTS_PER_PAGE;

  // Get posts based on category
  const posts = selectedCategory === 'All Blog Posts'
    ? await getAllPosts(POSTS_PER_PAGE, offset)
    : await getPostsByCategory(selectedCategory, POSTS_PER_PAGE, offset);

  const totalPosts = selectedCategory === 'All Blog Posts'
    ? await getPostCount()
    : await getPostCountByCategory(selectedCategory);

  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);

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
            {selectedCategory === 'All Blog Posts' ? 'All Articles' : selectedCategory}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {totalPosts === 0 ? 'No articles yet' : `Explore ${totalPosts} ${totalPosts === 1 ? 'article' : 'articles'}`}
          </p>
        </div>

        {/* Category Navigation */}
        <div className="mb-12 border-b border-gray-200 dark:border-gray-700">
          <nav className="flex flex-wrap gap-2 -mb-px">
            {BLOG_CATEGORIES.map((category) => {
              const isActive = category === selectedCategory;
              const href = category === 'All Blog Posts' ? '/blog' : `/blog?category=${encodeURIComponent(category)}`;

              return (
                <a
                  key={category}
                  href={href}
                  className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    isActive
                      ? 'border-accent-600 text-accent-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-600'
                  }`}
                >
                  {category}
                </a>
              );
            })}
          </nav>
        </div>

        {/* Posts Grid */}
        {posts.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
              <svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No posts yet</h3>
            <p className="text-gray-600 dark:text-gray-400">Check back soon for new content!</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                {currentPage > 1 && (
                  <a
                    href={`/blog?${selectedCategory !== 'All Blog Posts' ? `category=${encodeURIComponent(selectedCategory)}&` : ''}page=${currentPage - 1}`}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:text-gray-300 dark:bg-gray-800 dark:border-gray-600 dark:hover:bg-gray-700"
                  >
                    Previous
                  </a>
                )}

                <div className="flex gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(page => {
                      // Show first page, last page, current page, and pages around current
                      return page === 1 ||
                             page === totalPages ||
                             (page >= currentPage - 1 && page <= currentPage + 1);
                    })
                    .map((page, index, array) => {
                      // Add ellipsis if there's a gap
                      const showEllipsisBefore = index > 0 && page - array[index - 1] > 1;

                      return (
                        <div key={page} className="flex gap-2">
                          {showEllipsisBefore && (
                            <span className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">...</span>
                          )}
                          <a
                            href={`/blog?${selectedCategory !== 'All Blog Posts' ? `category=${encodeURIComponent(selectedCategory)}&` : ''}page=${page}`}
                            className={`px-4 py-2 text-sm font-medium rounded-lg ${
                              page === currentPage
                                ? 'bg-accent-600 text-white'
                                : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 dark:text-gray-300 dark:bg-gray-800 dark:border-gray-600 dark:hover:bg-gray-700'
                            }`}
                          >
                            {page}
                          </a>
                        </div>
                      );
                    })}
                </div>

                {currentPage < totalPages && (
                  <a
                    href={`/blog?${selectedCategory !== 'All Blog Posts' ? `category=${encodeURIComponent(selectedCategory)}&` : ''}page=${currentPage + 1}`}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:text-gray-300 dark:bg-gray-800 dark:border-gray-600 dark:hover:bg-gray-700"
                  >
                    Next
                  </a>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
