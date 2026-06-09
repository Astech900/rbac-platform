'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import Link from 'next/link';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('REGULAR_USER');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });
      if (res.ok) {
        toast.success('Registration successful! Please login.');
        router.push('/login');
      } else {
        const data = await res.json();
        toast.error(data.message || 'Registration failed');
      }
    } catch (err) {
      toast.error('An error occurred during registration');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 px-4 mb-12">
      <div className="card bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
        <div className="card-body p-8 sm:p-10">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold tracking-tight text-slate-800 mb-2">Create Account</h2>
            <p className="text-slate-500 font-medium">Join our community today</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-semibold text-slate-700">Name</span>
              </label>
              <input
                type="text"
                placeholder="John Doe"
                className="input w-full bg-slate-50 border-slate-200 focus:bg-white focus:border-primary/50 focus:ring-4 focus:ring-primary/10 rounded-xl transition-all duration-300 font-medium text-slate-800"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-semibold text-slate-700">Email</span>
              </label>
              <input
                type="email"
                placeholder="john@example.com"
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
                placeholder="Min 6 characters"
                className="input w-full bg-slate-50 border-slate-200 focus:bg-white focus:border-primary/50 focus:ring-4 focus:ring-primary/10 rounded-xl transition-all duration-300 font-medium text-slate-800"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength="6"
              />
            </div>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-semibold text-slate-700">Select Role</span>
              </label>
              <select 
                className="select w-full bg-slate-50 border-slate-200 focus:bg-white focus:border-primary/50 focus:ring-4 focus:ring-primary/10 rounded-xl transition-all duration-300 font-medium text-slate-800"
                value={role} 
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="REGULAR_USER">Regular User</option>
                <option value="MODERATOR">Moderator</option>
                <option value="SUPER_ADMIN">Super Admin</option>
                <option value="GUEST">Guest</option>
              </select>
            </div>
            <div className="form-control w-full mt-8">
              <button type="submit" className="btn btn-primary w-full rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all text-base h-12">
                Register Now
              </button>
            </div>
          </form>
          <div className="text-center mt-6">
            <p className="text-slate-600 font-medium">
              Already have an account? <Link href="/login" className="text-primary hover:underline hover:text-primary-focus transition-colors">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
