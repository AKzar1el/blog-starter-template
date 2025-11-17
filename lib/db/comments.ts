import { client } from './index';

export interface Comment {
  id: number;
  postSlug: string;
  username: string;
  content: string;
  parentId: number | null;
  likes: number;
  createdAt: string;
  replies?: Comment[];
}

// Random username pool
const USERNAMES = [
  'CosmicCoder',
  'PixelPioneer',
  'ByteBard',
  'QuantumQuill',
  'NeonNomad'
];

/**
 * Get a random username from the pool
 */
export function getRandomUsername(): string {
  return USERNAMES[Math.floor(Math.random() * USERNAMES.length)];
}

/**
 * Get all comments for a post (organized hierarchically)
 */
export async function getCommentsByPostSlug(postSlug: string): Promise<Comment[]> {
  const result = await client.execute({
    sql: 'SELECT * FROM comments WHERE postSlug = ? ORDER BY createdAt ASC',
    args: [postSlug],
  });

  const comments = result.rows.map(row => ({
    id: row.id as number,
    postSlug: row.postSlug as string,
    username: row.username as string,
    content: row.content as string,
    parentId: row.parentId as number | null,
    likes: row.likes as number,
    createdAt: row.createdAt as string,
  }));

  // Organize comments hierarchically
  const commentMap = new Map<number, Comment>();
  const rootComments: Comment[] = [];

  // First pass: create map of all comments
  comments.forEach(comment => {
    commentMap.set(comment.id, { ...comment, replies: [] });
  });

  // Second pass: organize into hierarchy
  comments.forEach(comment => {
    const commentWithReplies = commentMap.get(comment.id)!;

    if (comment.parentId === null) {
      rootComments.push(commentWithReplies);
    } else {
      const parent = commentMap.get(comment.parentId);
      if (parent) {
        parent.replies!.push(commentWithReplies);
      }
    }
  });

  return rootComments;
}

/**
 * Create a new comment
 */
export async function createComment(
  postSlug: string,
  content: string,
  parentId: number | null = null
): Promise<Comment> {
  const username = getRandomUsername();
  const createdAt = new Date().toISOString();

  const result = await client.execute({
    sql: `
      INSERT INTO comments (postSlug, username, content, parentId, likes, createdAt)
      VALUES (?, ?, ?, ?, 0, ?)
      RETURNING *
    `,
    args: [postSlug, username, content, parentId, createdAt],
  });

  const row = result.rows[0];
  return {
    id: row.id as number,
    postSlug: row.postSlug as string,
    username: row.username as string,
    content: row.content as string,
    parentId: row.parentId as number | null,
    likes: row.likes as number,
    createdAt: row.createdAt as string,
  };
}

/**
 * Increment likes for a comment
 */
export async function likeComment(commentId: number): Promise<void> {
  await client.execute({
    sql: 'UPDATE comments SET likes = likes + 1 WHERE id = ?',
    args: [commentId],
  });
}

/**
 * Get total comment count for a post
 */
export async function getCommentCount(postSlug: string): Promise<number> {
  const result = await client.execute({
    sql: 'SELECT COUNT(*) as count FROM comments WHERE postSlug = ?',
    args: [postSlug],
  });

  return result.rows[0].count as number;
}

/**
 * Delete a comment and its replies
 */
export async function deleteComment(commentId: number): Promise<void> {
  await client.execute({
    sql: 'DELETE FROM comments WHERE id = ?',
    args: [commentId],
  });
}
