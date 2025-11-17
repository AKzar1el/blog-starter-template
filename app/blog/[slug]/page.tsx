import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import dynamicImport from 'next/dynamic';
import { getPostBySlug, incrementViews, getAllPosts, EmbeddedMedia } from '@/lib/db/posts';
import { formatDate, calculateReadingTime } from '@/lib/utils';
import { getShimmerDataURL } from '@/lib/image-utils';
import MediaEmbed from '@/components/MediaEmbed';

// Force dynamic rendering for pages that use the database
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Dynamically import heavy client components to reduce initial bundle size
// This ensures react-markdown and related plugins are code-split
const MarkdownContent = dynamicImport(() => import('@/components/MarkdownContent'), {
  loading: () => <div className="animate-pulse h-96 bg-gray-100 dark:bg-gray-800 rounded-lg" />,
  ssr: false, // Disable SSR for markdown content to reduce server bundle
});

const TableOfContents = dynamicImport(() => import('@/components/TableOfContents'), {
  ssr: false, // Client-side only component
});

const ShareButtons = dynamicImport(() => import('@/components/ShareButtons'), {
  ssr: false, // Client-side only component
});

interface PostPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  const tags = JSON.parse(post.tags);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  return {
    title: post.title,
    description: post.excerpt,
    keywords: tags,
    authors: [{ name: post.author }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author],
      tags: tags,
      images: post.coverImage ? [post.coverImage] : [],
      url: `${baseUrl}/blog/${post.slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: post.coverImage ? [post.coverImage] : [],
    },
    alternates: {
      canonical: `${baseUrl}/blog/${post.slug}`,
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  // Increment views
  await incrementViews(params.slug);

  const tags = JSON.parse(post.tags);
  const embeddedMedia: EmbeddedMedia[] = post.embeddedMedia ? JSON.parse(post.embeddedMedia) : [];
  const readingTime = calculateReadingTime(post.content);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  // JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage || undefined,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: {
      '@type': 'Person',
      name: post.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Professional Blog',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}/blog/${post.slug}`,
    },
    keywords: tags.join(', '),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="min-h-screen bg-white dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          {/* Breadcrumb */}
          <nav className="mb-8 flex items-center text-sm text-gray-600 dark:text-gray-400">
            <Link href="/" className="hover:text-accent-600">Home</Link>
            <svg className="mx-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <Link href="/blog" className="hover:text-accent-600">Blog</Link>
            <svg className="mx-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-900 dark:text-gray-100 truncate max-w-xs">{post.title}</span>
          </nav>

          <div className="grid grid-cols-1 xl:grid-cols-[1fr_256px] gap-12">
            {/* Main Content */}
            <div className="max-w-4xl">
              {/* Header */}
              <header className="mb-8">
                <div className="flex flex-wrap gap-2 mb-4">
                  {tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-accent-50 text-accent-700 dark:bg-accent-900 dark:text-accent-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6 leading-tight">
                  {post.title}
                </h1>

                <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between flex-wrap gap-4 pb-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-500 to-accent-700 flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          {post.author.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">{post.author}</p>
                        <time dateTime={post.publishedAt} className="text-gray-600 dark:text-gray-400">
                          {formatDate(post.publishedAt)}
                        </time>
                      </div>
                    </div>
                    <span>•</span>
                    <span>{readingTime} min read</span>
                    <span>•</span>
                    <span>{post.views} views</span>
                  </div>

                  <ShareButtons title={post.title} slug={post.slug} />
                </div>
              </header>

              {/* Cover Image */}
              {post.coverImage && (
                <div className="relative w-full h-96 mb-12 rounded-xl overflow-hidden">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    sizes="(max-width: 896px) 100vw, 896px"
                    className="object-cover"
                    priority
                    placeholder="blur"
                    blurDataURL={getShimmerDataURL(896, 384)}
                  />
                </div>
              )}

              {/* Embedded Media */}
              {embeddedMedia.length > 0 && (
                <div className="mb-8">
                  {embeddedMedia.map((media, index) => (
                    <MediaEmbed
                      key={index}
                      url={media.url}
                      type={media.type}
                      position={media.position}
                      caption={media.caption}
                    />
                  ))}
                </div>
              )}

              {/* Article Content */}
              <MarkdownContent content={post.content} />

              {/* Footer */}
              <footer className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Last updated on {formatDate(post.updatedAt)}
                  </p>
                  <ShareButtons title={post.title} slug={post.slug} />
                </div>
              </footer>
            </div>

            {/* Sidebar - Table of Contents */}
            <TableOfContents markdown={post.content} />
          </div>
        </div>
      </article>
    </>
  );
}
