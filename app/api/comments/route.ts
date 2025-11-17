import { NextRequest, NextResponse } from 'next/server';
import { getCommentsByPostSlug, createComment, getCommentCount } from '@/lib/db/comments';

/**
 * GET /api/comments?postSlug=xxx
 * Get all comments for a specific post
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const postSlug = searchParams.get('postSlug');

    if (!postSlug) {
      return NextResponse.json(
        { error: 'postSlug parameter is required' },
        { status: 400 }
      );
    }

    const comments = await getCommentsByPostSlug(postSlug);
    const count = await getCommentCount(postSlug);

    return NextResponse.json({ comments, count });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/comments
 * Create a new comment
 * Body: { postSlug, content, parentId? }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { postSlug, content, parentId } = body;

    // Validation
    if (!postSlug || typeof postSlug !== 'string') {
      return NextResponse.json(
        { error: 'postSlug is required and must be a string' },
        { status: 400 }
      );
    }

    if (!content || typeof content !== 'string') {
      return NextResponse.json(
        { error: 'content is required and must be a string' },
        { status: 400 }
      );
    }

    if (content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Comment content cannot be empty' },
        { status: 400 }
      );
    }

    if (content.length > 1000) {
      return NextResponse.json(
        { error: 'Comment content cannot exceed 1000 characters' },
        { status: 400 }
      );
    }

    const comment = await createComment(postSlug, content.trim(), parentId || null);

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    );
  }
}
