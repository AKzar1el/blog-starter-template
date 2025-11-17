import db from './index';

export interface EmbeddedMedia {
  url: string;
  type: 'youtube' | 'vimeo' | 'video' | 'audio';
  position?: 'inline' | 'right' | 'left' | 'full-width';
  caption?: string;
}

export interface Post {
  id: number;
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  tags: string;
  coverImage: string | null;
  category: string;
  embeddedMedia: string | null;
  publishedAt: string;
  updatedAt: string;
  views: number;
}

export interface CreatePostData {
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  tags: string[];
  coverImage?: string;
  category?: string;
  embeddedMedia?: EmbeddedMedia[];
}

export function createPost(data: CreatePostData): Post {
  const now = new Date().toISOString();
  const tags = JSON.stringify(data.tags);
  const category = data.category || 'All Blog Posts';
  const embeddedMedia = data.embeddedMedia ? JSON.stringify(data.embeddedMedia) : null;

  const stmt = db.prepare(`
    INSERT INTO posts (slug, title, content, excerpt, author, tags, coverImage, category, embeddedMedia, publishedAt, updatedAt, views)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
  `);

  const info = stmt.run(
    data.slug,
    data.title,
    data.content,
    data.excerpt,
    data.author,
    tags,
    data.coverImage || null,
    category,
    embeddedMedia,
    now,
    now
  );

  return getPostById(info.lastInsertRowid as number)!;
}

export function getPostById(id: number): Post | undefined {
  const stmt = db.prepare('SELECT * FROM posts WHERE id = ?');
  return stmt.get(id) as Post | undefined;
}

export function getPostBySlug(slug: string): Post | undefined {
  const stmt = db.prepare('SELECT * FROM posts WHERE slug = ?');
  return stmt.get(slug) as Post | undefined;
}

export function getAllPosts(limit?: number, offset?: number): Post[] {
  let query = 'SELECT * FROM posts ORDER BY publishedAt DESC';

  if (limit !== undefined) {
    query += ` LIMIT ${limit}`;
    if (offset !== undefined) {
      query += ` OFFSET ${offset}`;
    }
  }

  const stmt = db.prepare(query);
  return stmt.all() as Post[];
}

export function getPostCount(): number {
  const stmt = db.prepare('SELECT COUNT(*) as count FROM posts');
  const result = stmt.get() as { count: number };
  return result.count;
}

export function incrementViews(slug: string): void {
  const stmt = db.prepare('UPDATE posts SET views = views + 1 WHERE slug = ?');
  stmt.run(slug);
}

export function getPostsByTag(tag: string): Post[] {
  const stmt = db.prepare(`
    SELECT * FROM posts
    WHERE tags LIKE ?
    ORDER BY publishedAt DESC
  `);
  return stmt.all(`%"${tag}"%`) as Post[];
}

export function getPostsByCategory(category: string, limit?: number, offset?: number): Post[] {
  let query = 'SELECT * FROM posts WHERE category = ? ORDER BY publishedAt DESC';

  if (limit !== undefined) {
    query += ` LIMIT ${limit}`;
    if (offset !== undefined) {
      query += ` OFFSET ${offset}`;
    }
  }

  const stmt = db.prepare(query);
  return stmt.all(category) as Post[];
}

export function getPostCountByCategory(category: string): number {
  const stmt = db.prepare('SELECT COUNT(*) as count FROM posts WHERE category = ?');
  const result = stmt.get(category) as { count: number };
  return result.count;
}

export function getAllCategories(): string[] {
  const stmt = db.prepare('SELECT DISTINCT category FROM posts ORDER BY category');
  const results = stmt.all() as { category: string }[];
  return results.map(r => r.category);
}

export function updatePost(slug: string, data: Partial<CreatePostData>): Post | undefined {
  const post = getPostBySlug(slug);
  if (!post) return undefined;

  const updates: string[] = [];
  const values: any[] = [];

  if (data.title !== undefined) {
    updates.push('title = ?');
    values.push(data.title);
  }
  if (data.content !== undefined) {
    updates.push('content = ?');
    values.push(data.content);
  }
  if (data.excerpt !== undefined) {
    updates.push('excerpt = ?');
    values.push(data.excerpt);
  }
  if (data.author !== undefined) {
    updates.push('author = ?');
    values.push(data.author);
  }
  if (data.tags !== undefined) {
    updates.push('tags = ?');
    values.push(JSON.stringify(data.tags));
  }
  if (data.coverImage !== undefined) {
    updates.push('coverImage = ?');
    values.push(data.coverImage);
  }
  if (data.category !== undefined) {
    updates.push('category = ?');
    values.push(data.category);
  }
  if (data.embeddedMedia !== undefined) {
    updates.push('embeddedMedia = ?');
    values.push(data.embeddedMedia ? JSON.stringify(data.embeddedMedia) : null);
  }

  updates.push('updatedAt = ?');
  values.push(new Date().toISOString());

  values.push(slug);

  const stmt = db.prepare(`
    UPDATE posts
    SET ${updates.join(', ')}
    WHERE slug = ?
  `);

  stmt.run(...values);
  return getPostBySlug(slug);
}
