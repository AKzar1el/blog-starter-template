import Link from 'next/link';
import Image from 'next/image';
import { formatDate } from '@/lib/utils';
import { getShimmerDataURL } from '@/lib/image-utils';

interface PostCardProps {
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  publishedAt: string;
  tags: string[];
  coverImage?: string | null;
  category: string;
}

export default function PostCard({
  slug,
  title,
  excerpt,
  author,
  publishedAt,
  tags,
  coverImage,
  category,
}: PostCardProps) {
  return (
    <Link href={`/blog/${slug}`} className="card group overflow-hidden flex flex-col h-full">
      {coverImage && (
        <div className="relative w-full h-48 bg-gray-100 dark:bg-gray-700 overflow-hidden">
          <Image
            src={coverImage}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            placeholder="blur"
            blurDataURL={getShimmerDataURL(400, 192)}
            loading="lazy"
          />
        </div>
      )}

      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
            <time dateTime={publishedAt}>{formatDate(publishedAt)}</time>
            <span>•</span>
            <span>{author}</span>
          </div>
          {category && category !== 'All Blog Posts' && (
            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
              {category}
            </span>
          )}
        </div>

        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-accent-600 dark:group-hover:text-accent-400 transition-colors line-clamp-2">
          {title}
        </h3>

        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 flex-grow line-clamp-3">
          {excerpt}
        </p>

        <div className="flex flex-wrap gap-2">
          {tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-accent-50 dark:bg-accent-900/30 text-accent-700 dark:text-accent-400"
            >
              {tag}
            </span>
          ))}
          {tags.length > 3 && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
              +{tags.length - 3} more
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
