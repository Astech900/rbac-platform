'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

export default function Dashboard() {
  const { user, loading } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const router = useRouter();

  if (loading) return <div className="flex justify-center mt-20"><span className="loading loading-spinner loading-lg text-primary"></span></div>;

  if (!user || user.role === 'GUEST') {
    return (
      <div className="max-w-md mx-auto mt-20 px-4 text-center">
        <h2 className="text-3xl font-bold text-slate-800 mb-4">Access Denied</h2>
        <p className="text-slate-600">You must be logged in as a Regular User or higher to view this page.</p>
        <button onClick={() => router.push('/login')} className="btn btn-primary mt-6 rounded-xl">Go to Login</button>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      });

      if (res.ok) {
        toast.success('Post created successfully!');
        router.push('/');
      } else {
        toast.error('Failed to create post');
      }
    } catch (err) {
      toast.error('An error occurred while creating post');
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-12 px-4">
      <div className="card bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
        <div className="card-body p-8 sm:p-10">
          <div className="mb-6">
            <h2 className="text-3xl font-bold tracking-tight text-slate-800 mb-2">Create a New Post</h2>
            <p className="text-slate-500 font-medium">Share your thoughts with the community</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-semibold text-slate-700">Post Title</span>
              </label>
              <input
                type="text"
                placeholder="Enter an engaging title"
                className="input w-full bg-slate-50 border-slate-200 focus:bg-white focus:border-primary/50 focus:ring-4 focus:ring-primary/10 rounded-xl transition-all duration-300 font-medium text-slate-800"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-semibold text-slate-700">Content</span>
              </label>
              <textarea
                placeholder="What's on your mind?"
                className="textarea w-full bg-slate-50 border-slate-200 focus:bg-white focus:border-primary/50 focus:ring-4 focus:ring-primary/10 rounded-xl transition-all duration-300 min-h-[160px] resize-y"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              ></textarea>
            </div>
            <div className="form-control w-full mt-8">
              <button type="submit" className="btn btn-primary w-full rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all text-base h-12">
                Publish Post
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
