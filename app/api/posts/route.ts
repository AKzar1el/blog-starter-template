import { NextRequest, NextResponse } from 'next/server';
import { createPost, getAllPosts, getPostBySlug } from '@/lib/db/posts';
import { slugify } from '@/lib/utils';
import { BLOG_CATEGORIES, isValidCategory } from '@/lib/constants';

// POST - Create a new blog post
// Supports rich HTML content including headings (h1, h2, h3), bold, links with SEO attributes
// You can specify which subcategory to post to using the 'category' field
// You can embed YouTube, Vimeo, and other media using the 'embeddedMedia' field
export async function POST(request: NextRequest) {
  try {
    // Check API key authentication
    const apiKey = request.headers.get('x-api-key');
    if (!apiKey || apiKey !== process.env.API_KEY) {
      return NextResponse.json(
        { error: 'Unauthorized. Invalid or missing API key.' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate required fields
    const { title, content, excerpt, author, tags, category, embeddedMedia } = body;
    if (!title || !content || !excerpt || !author) {
      return NextResponse.json(
        { error: 'Missing required fields: title, content, excerpt, author' },
        { status: 400 }
      );
    }

    // Validate tags
    if (!Array.isArray(tags) || tags.length === 0) {
      return NextResponse.json(
        { error: 'Tags must be a non-empty array' },
        { status: 400 }
      );
    }

    // Validate category if provided
    if (category && !isValidCategory(category)) {
      return NextResponse.json(
        {
          error: 'Invalid category. Must be one of: ' + BLOG_CATEGORIES.filter(c => c !== 'All Blog Posts').join(', '),
          availableCategories: BLOG_CATEGORIES.filter(c => c !== 'All Blog Posts')
        },
        { status: 400 }
      );
    }

    // Validate embeddedMedia if provided
    if (embeddedMedia) {
      if (!Array.isArray(embeddedMedia)) {
        return NextResponse.json(
          { error: 'embeddedMedia must be an array' },
          { status: 400 }
        );
      }

      // Validate each media item
      for (const media of embeddedMedia) {
        if (!media.url || typeof media.url !== 'string') {
          return NextResponse.json(
            { error: 'Each embedded media item must have a valid url' },
            { status: 400 }
          );
        }

        if (!media.type || !['youtube', 'vimeo', 'video', 'audio'].includes(media.type)) {
          return NextResponse.json(
            { error: 'Media type must be one of: youtube, vimeo, video, audio' },
            { status: 400 }
          );
        }

        if (media.position && !['inline', 'right', 'left', 'full-width'].includes(media.position)) {
          return NextResponse.json(
            { error: 'Media position must be one of: inline, right, left, full-width' },
            { status: 400 }
          );
        }
      }
    }

    // Generate slug or use provided one
    let slug = body.slug || slugify(title);

    // Check for duplicate slug and handle it
    let existingPost = getPostBySlug(slug);
    if (existingPost) {
      // Append timestamp to make slug unique
      slug = `${slug}-${Date.now()}`;
      existingPost = getPostBySlug(slug);

      // If still exists (very unlikely), return error
      if (existingPost) {
        return NextResponse.json(
          { error: 'Unable to generate unique slug. Please provide a custom slug.' },
          { status: 409 }
        );
      }
    }

    // Create the post
    const post = createPost({
      slug,
      title,
      content,
      excerpt,
      author,
      tags,
      coverImage: body.coverImage,
      category: category || 'All Blog Posts',
      embeddedMedia: embeddedMedia,
    });

    // Parse tags and embeddedMedia for response
    const postWithParsedData = {
      ...post,
      tags: JSON.parse(post.tags),
      embeddedMedia: post.embeddedMedia ? JSON.parse(post.embeddedMedia) : null,
    };

    return NextResponse.json(
      {
        success: true,
        message: 'Post created successfully',
        post: postWithParsedData,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating post:', error);

    // Handle SQLite unique constraint error
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return NextResponse.json(
        { error: 'A post with this slug already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// GET - Retrieve all posts or filter by tag
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = searchParams.get('limit');
    const offset = searchParams.get('offset');

    const posts = getAllPosts(
      limit ? parseInt(limit) : undefined,
      offset ? parseInt(offset) : undefined
    );

    // Parse tags and embeddedMedia for all posts
    const postsWithParsedData = posts.map(post => ({
      ...post,
      tags: JSON.parse(post.tags),
      embeddedMedia: post.embeddedMedia ? JSON.parse(post.embeddedMedia) : null,
    }));

    return NextResponse.json({
      success: true,
      count: postsWithParsedData.length,
      posts: postsWithParsedData,
    });
  } catch (error: any) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
