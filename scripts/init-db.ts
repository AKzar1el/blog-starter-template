/**
 * Database initialization script for Turso
 *
 * This script initializes the database schema in your Turso database.
 * Run this after creating your Turso database and before deploying.
 *
 * Usage:
 *   npm run init-db
 *
 * Make sure to set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN in your .env file first.
 */

import { createClient } from '@libsql/client';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function initDatabase() {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url || (!url.startsWith('file:') && !authToken)) {
    console.error('Set TURSO_DATABASE_URL and, for a remote database, TURSO_AUTH_TOKEN before initialization.');
    process.exit(1);
  }

  console.log('🔧 Connecting to Turso database...');
  const client = createClient({ url, authToken });

  try {
    console.log('📦 Creating posts table...');
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

    console.log('📊 Creating indexes...');
    await client.execute('CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug)');
    await client.execute('CREATE INDEX IF NOT EXISTS idx_posts_publishedAt ON posts(publishedAt DESC)');
    await client.execute('CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category)');

    await client.execute(`
      CREATE TABLE IF NOT EXISTS comments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        postSlug TEXT NOT NULL,
        username TEXT NOT NULL,
        content TEXT NOT NULL,
        parentId INTEGER,
        likes INTEGER DEFAULT 0,
        createdAt TEXT NOT NULL,
        FOREIGN KEY (postSlug) REFERENCES posts(slug) ON DELETE CASCADE,
        FOREIGN KEY (parentId) REFERENCES comments(id) ON DELETE CASCADE
      )
    `);
    await client.execute('CREATE INDEX IF NOT EXISTS idx_comments_postSlug ON comments(postSlug)');
    await client.execute('CREATE INDEX IF NOT EXISTS idx_comments_parentId ON comments(parentId)');
    await client.execute('CREATE INDEX IF NOT EXISTS idx_comments_createdAt ON comments(createdAt DESC)');

    console.log('💌 Creating newsletter_emails table...');
    await client.execute(`
      CREATE TABLE IF NOT EXISTS newsletter_emails (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        subscribedAt TEXT NOT NULL
      )
    `);

    console.log('📊 Creating newsletter indexes...');
    await client.execute('CREATE INDEX IF NOT EXISTS idx_newsletter_emails_email ON newsletter_emails(email)');
    await client.execute('CREATE INDEX IF NOT EXISTS idx_newsletter_emails_subscribedAt ON newsletter_emails(subscribedAt DESC)');

    console.log('✅ Database initialized successfully!');
    console.log('');
    console.log('Next steps:');
    console.log('1. Make sure to add TURSO_DATABASE_URL and TURSO_AUTH_TOKEN to Vercel environment variables');
    console.log('2. Deploy your application to Vercel');
    console.log('3. Start publishing posts via the API!');
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    process.exitCode = 1;
  } finally {
    client.close();
  }
}

initDatabase();
