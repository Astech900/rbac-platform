import connectToDatabase from '@/lib/db';
import Post from '@/models/Post';
import { getUserFromCookie } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    await connectToDatabase();
    const post = await Post.findById(id).populate('author', 'name email role');
    if (!post) return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const user = await getUserFromCookie();
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    await connectToDatabase();
    const post = await Post.findById(id);

    if (!post) return NextResponse.json({ message: 'Post not found' }, { status: 404 });

    if (post.author.toString() !== user.id) {
      return NextResponse.json({ message: 'You can only update your own posts' }, { status: 403 });
    }

    const { title, content } = await req.json();
    if (title) post.title = title;
    if (content) post.content = content;

    await post.save();
    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const user = await getUserFromCookie();
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    await connectToDatabase();
    const post = await Post.findById(id);

    if (!post) return NextResponse.json({ message: 'Post not found' }, { status: 404 });

    const isOwner = post.author.toString() === user.id;
    const isModeratorOrAdmin = ['MODERATOR', 'SUPER_ADMIN'].includes(user.role);

    if (!isOwner && !isModeratorOrAdmin) {
      return NextResponse.json({ message: 'You do not have permission to delete this post' }, { status: 403 });
    }

    await post.deleteOne();
    return NextResponse.json({ message: 'Post deleted successfully' });
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
