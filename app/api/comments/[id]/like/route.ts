import { NextRequest, NextResponse } from 'next/server';
import { likeComment } from '@/lib/db/comments';

/**
 * POST /api/comments/[id]/like
 * Increment likes for a comment
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const commentId = parseInt(params.id);

    if (isNaN(commentId)) {
      return NextResponse.json(
        { error: 'Invalid comment ID' },
        { status: 400 }
      );
    }

    await likeComment(commentId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error liking comment:', error);
    return NextResponse.json(
      { error: 'Failed to like comment' },
      { status: 500 }
    );
  }
}
