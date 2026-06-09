'use client';

import { useEffect, useState, use } from 'react';
import { useAuth } from '@/context/AuthContext';
import CommentItem from '@/components/CommentItem';
import { toast } from 'react-toastify';

export default function PostDetail({ params }) {
  const unwrappedParams = use(params);
  const { id } = unwrappedParams;
  
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchPostAndComments();
  }, [id]);

  const fetchPostAndComments = async () => {
    try {
      const [postRes, commentsRes] = await Promise.all([
        fetch(`/api/posts/${id}`),
        fetch(`/api/comments?postId=${id}`)
      ]);
      if (postRes.ok) setPost(await postRes.json());
      if (commentsRes.ok) setComments(await commentsRes.json());
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newComment, postId: id }),
      });

      if (res.ok) {
        const addedComment = await res.json();
        setComments([...comments, addedComment]);
        setNewComment('');
        toast.success('Comment added successfully!');
      } else {
        const data = await res.json();
        toast.error(data.message || 'Failed to add comment');
      }
    } catch (error) {
      toast.error('An error occurred while posting comment');
    }
  };

  const handleCommentDelete = (commentId) => {
    setComments(comments.filter((c) => c._id !== commentId));
  };

  if (loading) return <div className="flex justify-center mt-20"><span className="loading loading-spinner loading-lg text-primary"></span></div>;
  if (!post) return <div className="text-center mt-20 text-2xl font-bold text-slate-700">Post not found</div>;

  const canComment = user && user.role !== 'GUEST';

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-0">
      <div className="card bg-white shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 rounded-2xl mb-8 overflow-hidden transition-all duration-300">
        <div className="card-body p-6 sm:p-10">
          <h1 className="card-title text-4xl font-extrabold tracking-tight text-slate-800 mb-4">{post.title}</h1>
          <div className="flex items-center gap-3 mb-8 pb-6 border-b border-slate-100">
            <span className="text-sm font-medium text-slate-600">By {post.author.name}</span>
            <span className="badge badge-primary badge-sm shadow-sm font-semibold">{post.author.role.replace('_', ' ')}</span>
            <span className="text-xs text-slate-400 ml-auto">{new Date(post.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed text-lg mb-4 whitespace-pre-wrap">
            {post.content}
          </div>
        </div>
      </div>

      <div className="bg-white shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 rounded-2xl p-6 sm:p-10">
        <h3 className="text-2xl font-bold text-slate-800 mb-6">Comments ({comments.length})</h3>
        
        {canComment ? (
          <form onSubmit={handleCommentSubmit} className="mb-8 relative">
            <textarea
              className="textarea w-full bg-slate-50 border-slate-200 focus:bg-white focus:border-primary/50 focus:ring-4 focus:ring-primary/10 rounded-2xl transition-all duration-300 min-h-[100px] resize-y p-4 pr-32"
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              required
            ></textarea>
            <button type="submit" className="btn btn-primary btn-sm absolute bottom-4 right-4 rounded-xl shadow-sm hover:shadow transition-all">
              Post Comment
            </button>
          </form>
        ) : (
          <div className="alert alert-info rounded-xl mb-8 bg-blue-50 text-blue-800 border border-blue-100">
            <span>You must be logged in as a Regular User or higher to comment.</span>
          </div>
        )}

        <div className="space-y-4">
          {comments.map((comment) => (
            <CommentItem 
              key={comment._id} 
              comment={comment} 
              postOwnerId={post.author._id} 
              onDelete={handleCommentDelete} 
            />
          ))}
          {comments.length === 0 && <p className="text-slate-500 text-center py-4">No comments yet.</p>}
        </div>
      </div>
    </div>
  );
}
