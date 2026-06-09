import connectToDatabase from '@/lib/db';
import Post from '@/models/Post';
import { getUserFromCookie } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await connectToDatabase();
    const posts = await Post.find()
      .populate('author', 'name email role')
      .sort({ createdAt: -1 });
    return NextResponse.json(posts);
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
      return NextResponse.json({ message: 'Guests cannot create posts' }, { status: 403 });
    }

    await connectToDatabase();
    const { title, content } = await req.json();

    if (!title || !content) {
      return NextResponse.json({ message: 'Title and content are required' }, { status: 400 });
    }

    const newPost = await Post.create({
      title,
      content,
      author: user.id,
    });

    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error('Create Post Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
