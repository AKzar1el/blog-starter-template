'use client';

import dynamic from 'next/dynamic';

// Browser-only widgets must opt out of SSR from a Client Component.
export const TableOfContents = dynamic(() => import('./TableOfContents'), { ssr: false });
export const ShareButtons = dynamic(() => import('./ShareButtons'), { ssr: false });
export const Comments = dynamic(() => import('./Comments'), { ssr: false });
export const BackToTop = dynamic(() => import('./BackToTop'), { ssr: false });
