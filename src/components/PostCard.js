'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { toast } from 'react-toastify';

export default function PostCard({ post, onDelete }) {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);

  const isOwner = user && user.id === post.author._id;
  const isModeratorOrAdmin = user && ['MODERATOR', 'SUPER_ADMIN'].includes(user.role);
  const canEdit = isOwner;
  const canDelete = isOwner || isModeratorOrAdmin;

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/posts/${post._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      });
      if (res.ok) {
        toast.success('Post updated successfully');
        setIsEditing(false);
      } else {
        toast.error('Failed to update post');
      }
    } catch (err) {
      toast.error('An error occurred while updating the post');
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this post?')) {
      try {
        const res = await fetch(`/api/posts/${post._id}`, { method: 'DELETE' });
        if (res.ok) {
          toast.success('Post deleted successfully');
          if (onDelete) onDelete(post._id);
        } else {
          toast.error('Failed to delete post');
        }
      } catch (err) {
        toast.error('An error occurred while deleting the post');
      }
    }
  };

  if (isEditing) {
    return (
      <div className="card bg-white shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 rounded-2xl mb-6 overflow-hidden">
        <div className="card-body p-6 sm:p-8">
          <form onSubmit={handleUpdate}>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input w-full bg-slate-50 border-slate-200 focus:bg-white focus:border-primary/50 focus:ring-4 focus:ring-primary/10 rounded-xl transition-all duration-300 font-medium text-slate-800 mb-4"
              required
            />
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="textarea w-full bg-slate-50 border-slate-200 focus:bg-white focus:border-primary/50 focus:ring-4 focus:ring-primary/10 rounded-xl transition-all duration-300 min-h-[120px] resize-y mb-4"
              required
            />
            <div className="card-actions justify-end gap-2">
              <button type="button" className="btn btn-ghost rounded-xl hover:bg-slate-100 transition-all text-slate-600" onClick={() => setIsEditing(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary rounded-xl shadow-sm hover:shadow hover:-translate-y-0.5 transition-all">Save</button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-white shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 rounded-2xl mb-6 overflow-hidden transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] group">
      <div className="card-body p-6 sm:p-8">
        <div className="flex justify-between items-start mb-2">
          <Link href={`/post/${post._id}`} className="hover:opacity-80 transition-opacity">
            <h2 className="card-title text-2xl font-bold tracking-tight text-slate-800 group-hover:text-primary transition-colors">{post.title}</h2>
          </Link>
          <div className="flex gap-2">
            {canEdit && <button onClick={() => setIsEditing(true)} className="btn btn-ghost btn-sm btn-circle text-slate-400 hover:text-primary hover:bg-primary/10 transition-colors" title="Edit Post">✎</button>}
            {canDelete && <button onClick={handleDelete} className="btn btn-ghost btn-sm btn-circle text-slate-400 hover:text-error hover:bg-error/10 transition-colors" title="Delete Post">✖</button>}
          </div>
        </div>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm font-medium text-slate-600">By {post.author.name}</span>
          <span className="badge badge-neutral badge-sm shadow-sm">{post.author.role.replace('_', ' ')}</span>
        </div>
        <p className="text-slate-600 leading-relaxed">{post.content.length > 200 ? post.content.substring(0, 200) + '...' : post.content}</p>
        <div className="card-actions justify-end mt-6">
          <Link href={`/post/${post._id}`} className="btn btn-ghost text-primary hover:bg-primary/10 rounded-xl transition-all">
            Read Comments →
          </Link>
        </div>
      </div>
    </div>
  );
}
