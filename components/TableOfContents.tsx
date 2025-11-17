'use client';

import { useEffect, useState } from 'react';
import { extractHeadings } from '@/lib/utils';

interface TableOfContentsProps {
  markdown: string;
}

export default function TableOfContents({ markdown }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');
  const headings = extractHeadings(markdown);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-100px 0px -80% 0px' }
    );

    headings.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav className="hidden xl:block sticky top-24 w-64 self-start">
      <div className="border-l-2 border-gray-200 pl-4">
        <p className="text-sm font-semibold text-gray-900 mb-3">
          Table of Contents
        </p>
        <ul className="space-y-2">
          {headings.map(({ id, text, level }) => (
            <li
              key={id}
              style={{ paddingLeft: `${(level - 1) * 0.75}rem` }}
            >
              <a
                href={`#${id}`}
                className={`text-sm transition-colors block ${
                  activeId === id
                    ? 'text-accent-600 font-medium'
                    : 'text-gray-600 hover:text-gray-900'
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
