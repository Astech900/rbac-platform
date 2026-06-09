import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await connectToDatabase();
    
    const users = [
      {
        name: 'Super Admin User',
        email: 'superadmin@test.com',
        password: 'password123',
        role: 'SUPER_ADMIN'
      },
      {
        name: 'Moderator User',
        email: 'moderator@test.com',
        password: 'password123',
        role: 'MODERATOR'
      },
      {
        name: 'Regular User',
        email: 'user@test.com',
        password: 'password123',
        role: 'REGULAR_USER'
      },
      {
        name: 'Guest',
        email: 'guest@test.com',
        password: 'password123',
        role: 'GUEST'
      }
    ];

    for (const u of users) {
      const exists = await User.findOne({ email: u.email });
      if (!exists) {
        await User.create(u);
      }
    }

    return NextResponse.json({ message: 'Database seeded successfully with test users' });
  } catch (error) {
    console.error('Seed Error:', error);
    return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
  }
}
