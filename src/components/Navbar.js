'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <div className="navbar bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-200/50 sticky top-0 z-50 px-4 sm:px-8">
      <div className="flex-1">
        <Link href="/" className="btn btn-ghost text-2xl font-bold tracking-tight normal-case hover:bg-slate-100/50 rounded-xl transition-all">
          RBAC<span className="text-primary">Social</span>
        </Link>
      </div>
      <div className="flex-none gap-3">
        {user ? (
          <>
            <div className="hidden sm:flex items-center gap-3 mr-2 bg-slate-100/50 py-1.5 px-4 rounded-full border border-slate-200/50">
              <span className="text-slate-600 font-medium text-sm">Hi, {user.name}</span>
              <span className="badge badge-primary badge-sm font-semibold shadow-sm">{user.role.replace('_', ' ')}</span>
            </div>
            {user.role !== 'GUEST' && (
              <Link href="/dashboard" className="btn btn-primary btn-sm rounded-xl shadow-sm hover:shadow hover:-translate-y-0.5 transition-all">
                New Post
              </Link>
            )}
            <button onClick={logout} className="btn btn-ghost btn-sm rounded-xl hover:bg-slate-100 text-slate-600 transition-all">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="btn btn-ghost rounded-xl hover:bg-slate-100 font-medium transition-all">
              Login
            </Link>
            <Link href="/register" className="btn btn-primary rounded-xl shadow-sm hover:shadow hover:-translate-y-0.5 transition-all">
              Register
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
