'use client';

import { useState, useEffect } from 'react';
import PostCard from '@/components/PostCard';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/posts');
      const data = await res.json();
      setPosts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePostDelete = (postId) => {
    setPosts(posts.filter((p) => p._id !== postId));
  };

  if (loading) return <div className="flex justify-center mt-20"><span className="loading loading-spinner loading-lg text-primary"></span></div>;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-0">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-800 mb-4">Latest <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">Discussions</span></h1>
        <p className="text-lg text-slate-500 font-medium">Join the conversation with our community</p>
      </div>
      
      <div className="space-y-6">
        {posts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="text-xl font-semibold text-slate-700">No posts yet</h3>
            <p className="text-slate-500 mt-2">Be the first to start a discussion!</p>
          </div>
        ) : (
          posts.map((post) => (
            <PostCard key={post._id} post={post} onDelete={handlePostDelete} />
          ))
        )}
      </div>
    </div>
  );
}
