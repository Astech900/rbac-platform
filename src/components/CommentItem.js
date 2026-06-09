'use client';

import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-toastify';

export default function CommentItem({ comment, postOwnerId, onDelete }) {
  const { user } = useAuth();

  const isCommentOwner = user && user.id === comment.author._id;
  const isPostOwner = user && user.id === postOwnerId;
  const isModeratorOrAdmin = user && ['MODERATOR', 'SUPER_ADMIN'].includes(user.role);
  
  const canDelete = isCommentOwner || isPostOwner || isModeratorOrAdmin;

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this comment?')) {
      try {
        const res = await fetch(`/api/comments/${comment._id}`, { method: 'DELETE' });
        if (res.ok) {
          toast.success('Comment deleted successfully');
          onDelete(comment._id);
        } else {
          toast.error('Failed to delete comment');
        }
      } catch (err) {
        toast.error('An error occurred while deleting the comment');
      }
    }
  };

  return (
    <div className="bg-slate-50 rounded-2xl p-5 mb-4 border border-slate-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)] transition-all hover:shadow-[0_4px_15px_rgb(0,0,0,0.04)] group">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <strong className="text-slate-800 font-semibold">{comment.author.name}</strong>
          <span className="badge badge-ghost badge-sm text-xs font-medium text-slate-500">{comment.author.role.replace('_', ' ')}</span>
        </div>
        {canDelete && (
          <button onClick={handleDelete} className="btn btn-ghost btn-xs btn-circle text-slate-400 hover:text-error hover:bg-error/10 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100" title="Delete Comment">
            ✖
          </button>
        )}
      </div>
      <p className="text-slate-600 text-sm leading-relaxed">{comment.text}</p>
    </div>
  );
}
