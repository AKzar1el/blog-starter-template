/**
 * Blog Categories
 * These are the available subcategories for blog posts
 */
export const BLOG_CATEGORIES = [
  'All Blog Posts',
  'News',
  'Technology',
  'Business',
  'Education',
  'Ethics',
  'Art',
  'Entertainment',
  'Fun',
  'Games',
  'Music',
  'Politics',
  'History',
] as const;

export type BlogCategory = typeof BLOG_CATEGORIES[number];

/**
 * Check if a category is valid
 */
export function isValidCategory(category: string): boolean {
  return BLOG_CATEGORIES.includes(category as BlogCategory);
}
