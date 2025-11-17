import { client } from './index';

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

export async function createPost(data: CreatePostData): Promise<Post> {
  const now = new Date().toISOString();
  const tags = JSON.stringify(data.tags);
  const category = data.category || 'All Blog Posts';
  const embeddedMedia = data.embeddedMedia ? JSON.stringify(data.embeddedMedia) : null;

  const result = await client.execute({
    sql: `
      INSERT INTO posts (slug, title, content, excerpt, author, tags, coverImage, category, embeddedMedia, publishedAt, updatedAt, views)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
    `,
    args: [
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
    ]
  });

  const post = await getPostById(Number(result.lastInsertRowid));
  if (!post) {
    throw new Error('Failed to create post');
  }
  return post;
}

export async function getPostById(id: number): Promise<Post | undefined> {
  const result = await client.execute({
    sql: 'SELECT * FROM posts WHERE id = ?',
    args: [id]
  });
  return result.rows[0] as unknown as Post | undefined;
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  const result = await client.execute({
    sql: 'SELECT * FROM posts WHERE slug = ?',
    args: [slug]
  });
  return result.rows[0] as unknown as Post | undefined;
}

export async function getAllPosts(limit?: number, offset?: number): Promise<Post[]> {
  let sql = 'SELECT * FROM posts ORDER BY publishedAt DESC';
  const args: any[] = [];

  if (limit !== undefined) {
    sql += ' LIMIT ?';
    args.push(limit);
    if (offset !== undefined) {
      sql += ' OFFSET ?';
      args.push(offset);
    }
  }

  const result = await client.execute({ sql, args });
  return result.rows as unknown as Post[];
}

export async function getPostCount(): Promise<number> {
  const result = await client.execute('SELECT COUNT(*) as count FROM posts');
  const row = result.rows[0] as unknown as { count: number };
  return row.count;
}

export async function incrementViews(slug: string): Promise<void> {
  await client.execute({
    sql: 'UPDATE posts SET views = views + 1 WHERE slug = ?',
    args: [slug]
  });
}

export async function getPostsByTag(tag: string): Promise<Post[]> {
  const result = await client.execute({
    sql: `
      SELECT * FROM posts
      WHERE tags LIKE ?
      ORDER BY publishedAt DESC
    `,
    args: [`%"${tag}"%`]
  });
  return result.rows as unknown as Post[];
}

export async function getPostsByCategory(category: string, limit?: number, offset?: number): Promise<Post[]> {
  let sql = 'SELECT * FROM posts WHERE category = ? ORDER BY publishedAt DESC';
  const args: any[] = [category];

  if (limit !== undefined) {
    sql += ' LIMIT ?';
    args.push(limit);
    if (offset !== undefined) {
      sql += ' OFFSET ?';
      args.push(offset);
    }
  }

  const result = await client.execute({ sql, args });
  return result.rows as unknown as Post[];
}

export async function getPostCountByCategory(category: string): Promise<number> {
  const result = await client.execute({
    sql: 'SELECT COUNT(*) as count FROM posts WHERE category = ?',
    args: [category]
  });
  const row = result.rows[0] as unknown as { count: number };
  return row.count;
}

export async function getAllCategories(): Promise<string[]> {
  const result = await client.execute('SELECT DISTINCT category FROM posts ORDER BY category');
  return result.rows.map((r: any) => r.category);
}

export async function updatePost(slug: string, data: Partial<CreatePostData>): Promise<Post | undefined> {
  const post = await getPostBySlug(slug);
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

  await client.execute({
    sql: `UPDATE posts SET ${updates.join(', ')} WHERE slug = ?`,
    args: values
  });

  return await getPostBySlug(slug);
}
