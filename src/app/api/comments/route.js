import connectToDatabase from '@/lib/db';
import Comment from '@/models/Comment';
import Post from '@/models/Post';
import { getUserFromCookie } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const postId = searchParams.get('postId');

    if (!postId) {
      return NextResponse.json({ message: 'postId is required' }, { status: 400 });
    }

    await connectToDatabase();
    const comments = await Comment.find({ post: postId })
      .populate('author', 'name email role')
      .sort({ createdAt: 1 });

    return NextResponse.json(comments);
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const user = await getUserFromCookie();
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    if (user.role === 'GUEST') {
      return NextResponse.json({ message: 'Guests cannot comment' }, { status: 403 });
    }

    await connectToDatabase();
    const { text, postId } = await req.json();

    if (!text || !postId) {
      return NextResponse.json({ message: 'Text and postId are required' }, { status: 400 });
    }

    const postExists = await Post.findById(postId);
    if (!postExists) {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }

    const newComment = await Comment.create({
      text,
      author: user.id,
      post: postId,
    });

    await newComment.populate('author', 'name email role');

    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    console.error('Create Comment Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
