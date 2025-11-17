import { createClient } from '@libsql/client';

// Create Turso client for serverless environments
// Use dummy values during build if env vars are missing
const client = createClient({
  url: process.env.TURSO_DATABASE_URL || 'file:local.db',
  authToken: process.env.TURSO_AUTH_TOKEN,
});

// Initialize database schema
async function initializeDatabase() {
  // Create posts table
  await client.execute(`
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      excerpt TEXT NOT NULL,
      author TEXT NOT NULL,
      tags TEXT NOT NULL,
      coverImage TEXT,
      category TEXT DEFAULT 'All Blog Posts',
      publishedAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      views INTEGER DEFAULT 0,
      embeddedMedia TEXT
    )
  `);

  // Create indexes
  await client.execute('CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug)');
  await client.execute('CREATE INDEX IF NOT EXISTS idx_posts_publishedAt ON posts(publishedAt DESC)');
  await client.execute('CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category)');
}

// Initialize on module load (only in development)
// In production (Vercel), tables should be created via migration script
if (process.env.NODE_ENV !== 'production') {
  initializeDatabase().catch(console.error);
}

export { client, initializeDatabase };
