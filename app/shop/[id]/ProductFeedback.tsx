"use client";
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

interface Feedback {
  likes: number;
  dislikes: number;
  votes: { user: string; name?: string; image?: string; vote: 'like' | 'dislike' }[];
  comments: { user: string; name?: string; image?: string; text: string; date: string }[];
}

export default function ProductFeedback({ productId }: { productId: string }) {
  const { data: session, status } = useSession();
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [loading, setLoading] = useState(true);
  const [commentInput, setCommentInput] = useState('');
  const [userVote, setUserVote] = useState<'like' | 'dislike' | null>(null);

  // For demo: use sessionStorage as user identity (should use real auth in production)
  const [user, setUser] = useState('');
  useEffect(() => {
    let uid = sessionStorage.getItem('feedback-user');
    if (!uid) {
      uid = Math.random().toString(36).substring(2);
      sessionStorage.setItem('feedback-user', uid);
    }
    setUser(uid);
  }, []);

  // Fetch feedback from API
  useEffect(() => {
    async function fetchFeedback() {
      setLoading(true);
      const res = await fetch(`/api/feedback/${productId}`, {
        credentials: 'include',
      });
      const data = await res.json();
      setFeedback(data);
      // Find user's vote if logged in
      if (data && data.votes && status === 'authenticated') {
        const v = data.votes.find((v: any) => v.user === (session?.user as any)?.id);
        setUserVote(v ? v.vote : null);
      } else {
        setUserVote(null);
      }
      setLoading(false);
    }
    fetchFeedback();
  }, [productId, status, session]);

  // Like/Dislike handlers
  const handleVote = async (vote: 'like' | 'dislike') => {
    if (status !== 'authenticated') {
      alert('You must be logged in to vote.');
      return;
    }
    if (userVote === vote) return;
    await fetch(`/api/feedback/${productId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'vote', vote }),
      credentials: 'include',
    });
    // Refetch feedback
    const res = await fetch(`/api/feedback/${productId}`, {
      credentials: 'include',
    });
    const data = await res.json();
    const v = data.votes.find((v: any) => v.user === (session?.user as any)?.id);
    setUserVote(v ? v.vote : null);
    setFeedback(data);
  };

  // Comment handler
  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status !== 'authenticated') {
      alert('You must be logged in to comment.');
      return;
    }
    if (!commentInput.trim()) return;
    await fetch(`/api/feedback/${productId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'comment', text: commentInput.trim() }),
      credentials: 'include',
    });
    setCommentInput('');
    // Refetch feedback
    const res = await fetch(`/api/feedback/${productId}`, {
      credentials: 'include',
    });
    const data = await res.json();
    setFeedback(data);
  };

  if (loading || !feedback) {
    return <div className="mt-8 text-center text-gray-500">Loading feedback...</div>;
  }

  return (
    <div className="mt-8 bg-white rounded-xl shadow p-6">
      {/* Like/Dislike */}
      <div className="flex items-center space-x-6 mb-6">
        <button
          onClick={() => handleVote('like')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-full font-medium transition-all duration-200 ${userVote === 'like' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700 hover:bg-green-50'}`}
        >
          <span>👍</span>
          <span>Like</span>
          <span className="font-bold">{feedback.likes}</span>
        </button>
        <button
          onClick={() => handleVote('dislike')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-full font-medium transition-all duration-200 ${userVote === 'dislike' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700 hover:bg-red-50'}`}
        >
          <span>👎</span>
          <span>Dislike</span>
          <span className="font-bold">{feedback.dislikes}</span>
        </button>
      </div>
      {/* Comments */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Comments</h3>
        <form onSubmit={handleAddComment} className="flex items-center mb-4 space-x-2">
          <input
            type="text"
            value={commentInput}
            onChange={e => setCommentInput(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-gradient-to-r from-rose-500 to-purple-600 text-white rounded-lg font-semibold hover:from-rose-600 hover:to-purple-700 transition-all duration-200"
          >
            Post
          </button>
        </form>
        <div className="space-y-4">
          {feedback.comments.length === 0 ? (
            <div className="text-gray-500">No comments yet.</div>
          ) : (
            feedback.comments.map((c, i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-3 flex items-start space-x-3">
                {c.image ? (
                  <img src={c.image} alt={c.name || 'User'} className="w-8 h-8 rounded-full object-cover" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-bold">
                    {c.name ? c.name[0].toUpperCase() : '?'}
                  </div>
                )}
                <div>
                  <div className="text-gray-800 font-semibold">{c.name || 'User'}</div>
                  <div>{c.text}</div>
                  <div className="text-xs text-gray-400 mt-1">{new Date(c.date).toLocaleString()}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
} 