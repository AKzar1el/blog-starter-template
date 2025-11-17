import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'blog.db');
const db = new Database(dbPath);

// Enable WAL mode for better concurrent access
db.pragma('journal_mode = WAL');

// Create posts table
const createPostsTable = db.prepare(`
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
    views INTEGER DEFAULT 0
  )
`);

createPostsTable.run();

// Add category column if it doesn't exist (migration)
try {
  db.prepare('ALTER TABLE posts ADD COLUMN category TEXT DEFAULT "All Blog Posts"').run();
} catch (error) {
  // Column already exists, ignore error
}

// Add embeddedMedia column if it doesn't exist (migration)
try {
  db.prepare('ALTER TABLE posts ADD COLUMN embeddedMedia TEXT').run();
} catch (error) {
  // Column already exists, ignore error
}

// Create index on slug for faster lookups
db.prepare('CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug)').run();
db.prepare('CREATE INDEX IF NOT EXISTS idx_posts_publishedAt ON posts(publishedAt DESC)').run();
db.prepare('CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category)').run();

export default db;
