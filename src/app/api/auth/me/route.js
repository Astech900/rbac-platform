import { getUserFromCookie } from '@/lib/auth';
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';

export async function GET() {
  try {
    const userPayload = await getUserFromCookie();
    if (!userPayload) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    await connectToDatabase();
    const user = await User.findById(userPayload.id).select('-password');
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      user: { id: user._id, name: user.name, email: user.email, role: user.role } 
    });
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
