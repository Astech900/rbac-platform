import connectToDatabase from '@/lib/db';
import Comment from '@/models/Comment';
import Post from '@/models/Post';
import { getUserFromCookie } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function DELETE(req, { params }) {
  try {
    const user = await getUserFromCookie();
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    await connectToDatabase();
    
    const comment = await Comment.findById(id);
    if (!comment) return NextResponse.json({ message: 'Comment not found' }, { status: 404 });

    const post = await Post.findById(comment.post);
    if (!post) return NextResponse.json({ message: 'Post not found' }, { status: 404 });

    const isCommentOwner = comment.author.toString() === user.id;
    const isPostOwner = post.author.toString() === user.id;
    const isModeratorOrAdmin = ['MODERATOR', 'SUPER_ADMIN'].includes(user.role);

    if (!isCommentOwner && !isPostOwner && !isModeratorOrAdmin) {
      return NextResponse.json({ message: 'You do not have permission to delete this comment' }, { status: 403 });
    }

    await comment.deleteOne();
    return NextResponse.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
