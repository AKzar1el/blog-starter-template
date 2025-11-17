'use client';

import { useEffect, useState, useRef } from 'react';
import { extractHeadings } from '@/lib/utils';

interface TableOfContentsProps {
  markdown: string;
}

export default function TableOfContents({ markdown }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');
  const headings = extractHeadings(markdown);
  const tocRef = useRef<HTMLDivElement>(null);
  const activeItemRefs = useRef<Map<string, HTMLAnchorElement>>(new Map());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Collect all currently intersecting heading IDs
        const intersectingEntries = entries.filter(entry => entry.isIntersecting);

        if (intersectingEntries.length > 0) {
          // Sort by their position in the document and pick the topmost one
          intersectingEntries.sort((a, b) => {
            return a.boundingClientRect.top - b.boundingClientRect.top;
          });
          setActiveId(intersectingEntries[0].target.id);
        }
      },
      {
        rootMargin: '-100px 0px -66% 0px',
        threshold: 0
      }
    );

    headings.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  // Auto-scroll active item into view within TOC
  useEffect(() => {
    const activeItem = activeItemRefs.current.get(activeId);
    if (activeItem && tocRef.current) {
      const tocContainer = tocRef.current;
      const tocRect = tocContainer.getBoundingClientRect();
      const itemRect = activeItem.getBoundingClientRect();

      // Check if item is not fully visible in the TOC container
      if (itemRect.top < tocRect.top || itemRect.bottom > tocRect.bottom) {
        activeItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [activeId]);

  if (headings.length === 0) return null;

  return (
    <nav className="hidden xl:block sticky top-24 w-64 self-start">
      <div
        ref={tocRef}
        className="border-l-2 border-gray-200 dark:border-gray-700 pl-4 max-h-[calc(100vh-8rem)] overflow-y-auto pr-2 scrollbar-toc"
      >
        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3 sticky top-0 bg-white dark:bg-gray-900 pb-2 -ml-4 pl-4">
          Table of Contents
        </p>
        <ul className="space-y-2">
          {headings.map(({ id, text, level }) => (
            <li
              key={id}
              style={{ paddingLeft: `${(level - 1) * 0.75}rem` }}
            >
              <a
                ref={(el) => {
                  if (el) {
                    activeItemRefs.current.set(id, el);
                  } else {
                    activeItemRefs.current.delete(id);
                  }
                }}
                href={`#${id}`}
                className={`text-sm transition-colors block ${
                  activeId === id
                    ? 'text-accent-600 dark:text-accent-400 font-medium'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                }`}
              >
                {text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
