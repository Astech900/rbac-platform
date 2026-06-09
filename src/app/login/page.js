'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import Link from 'next/link';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await login(email, password);
    if (res.success) {
      toast.success('Login successful!');
      router.push('/');
    } else {
      toast.error(res.message || 'Login failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 px-4">
      <div className="card bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
        <div className="card-body p-8 sm:p-10">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold tracking-tight text-slate-800 mb-2">Welcome Back</h2>
            <p className="text-slate-500 font-medium">Sign in to your account</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-semibold text-slate-700">Email</span>
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                className="input w-full bg-slate-50 border-slate-200 focus:bg-white focus:border-primary/50 focus:ring-4 focus:ring-primary/10 rounded-xl transition-all duration-300 font-medium text-slate-800"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-semibold text-slate-700">Password</span>
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                className="input w-full bg-slate-50 border-slate-200 focus:bg-white focus:border-primary/50 focus:ring-4 focus:ring-primary/10 rounded-xl transition-all duration-300 font-medium text-slate-800"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-control w-full mt-8">
              <button type="submit" className="btn btn-primary w-full rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all text-base h-12">
                Sign In
              </button>
            </div>
          </form>
          <div className="text-center mt-6">
            <p className="text-slate-600 font-medium">
              Don't have an account? <Link href="/register" className="text-primary hover:underline hover:text-primary-focus transition-colors">Register here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
