'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import 'highlight.js/styles/github-dark.css';

interface MarkdownContentProps {
  content: string;
}

/**
 * MarkdownContent Component
 *
 * Supports rich HTML content including:
 * - HTML headings: <h1>, <h2>, <h3>, etc.
 * - Text formatting: <strong>, <b>, <em>, <i>
 * - Links with SEO attributes: <a href="url" title="description">text</a>
 * - Code blocks, lists, tables, and more
 *
 * For better SEO, use links with title attributes:
 * <a href="https://example.com" title="Example Website">Visit Example</a>
 */
export default function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <div className="prose prose-lg prose-gray max-w-none
      prose-headings:scroll-mt-20
      prose-h1:text-4xl prose-h1:font-bold prose-h1:mb-4
      prose-h2:text-3xl prose-h2:font-semibold prose-h2:mt-12 prose-h2:mb-4 prose-h2:border-b prose-h2:pb-2 dark:prose-h2:border-gray-700
      prose-h3:text-2xl prose-h3:font-semibold prose-h3:mt-8 prose-h3:mb-3
      prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed
      prose-a:text-accent-600 prose-a:no-underline hover:prose-a:underline
      prose-strong:text-gray-900 dark:prose-strong:text-gray-100 prose-strong:font-semibold
      prose-code:text-accent-600 dark:prose-code:text-accent-400 prose-code:bg-accent-50 dark:prose-code:bg-accent-900/30 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:before:content-none prose-code:after:content-none
      prose-pre:bg-gray-100 dark:prose-pre:bg-gray-900 prose-pre:text-gray-900 dark:prose-pre:text-gray-100 prose-pre:overflow-x-auto
      prose-blockquote:border-l-accent-500 prose-blockquote:bg-gray-50 dark:prose-blockquote:bg-gray-800 prose-blockquote:py-1 prose-blockquote:px-4
      prose-ul:list-disc prose-ul:ml-6
      prose-ol:list-decimal prose-ol:ml-6
      prose-li:text-gray-700 dark:prose-li:text-gray-300
      prose-img:rounded-lg prose-img:shadow-md
      prose-hr:border-gray-200 dark:prose-hr:border-gray-700
      prose-table:border-collapse
      prose-th:bg-gray-50 dark:prose-th:bg-gray-800 prose-th:font-semibold prose-th:text-left prose-th:p-3 prose-th:border prose-th:border-gray-300 dark:prose-th:border-gray-600
      prose-td:p-3 prose-td:border prose-td:border-gray-300 dark:prose-td:border-gray-600
    ">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight, rehypeRaw]}
        components={{
          h1: ({ node, ...props }) => {
            const text = props.children?.toString() || '';
            const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-');
            return <h1 id={id} {...props} />;
          },
          h2: ({ node, ...props }) => {
            const text = props.children?.toString() || '';
            const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-');
            return <h2 id={id} {...props} />;
          },
          h3: ({ node, ...props }) => {
            const text = props.children?.toString() || '';
            const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-');
            return <h3 id={id} {...props} />;
          },
          // Enhanced link component with SEO attributes
          a: ({ node, ...props }) => {
            const href = props.href || '';
            const isExternal = href.startsWith('http://') || href.startsWith('https://');

            return (
              <a
                {...props}
                // Add rel="noopener noreferrer" for external links (security & SEO)
                rel={isExternal ? 'noopener noreferrer' : undefined}
                // Add title attribute if not present (use link text as fallback)
                title={props.title || (typeof props.children === 'string' ? props.children : undefined)}
                // Open external links in new tab
                target={isExternal ? '_blank' : undefined}
              />
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
