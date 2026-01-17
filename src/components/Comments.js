"use client";
import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import Cookies from 'js-cookie';

export default function Comments({ postId, comments: initialComments, onCommentsUpdate }) {
    const [comments, setComments] = useState(initialComments || []);
    const [newComment, setNewComment] = useState("");
    const [notification, setNotification] = useState({ show: false, message: '', type: '' });

    // Update local state when initialComments changes
    useEffect(() => {
        setComments(initialComments || []);
    }, [initialComments]);

    const handleComment = async (e) => { // Keep e.preventDefault() for form submission
        e.preventDefault();
        if (!newComment.trim()) return;

        // Removed setLoading(true) as per the provided snippet's handleComment
        try {
            const userData = Cookies.get('user_data');
            const user = userData ? JSON.parse(userData) : null;
            if (!user) {
                setNotification({ show: true, message: 'Please login to comment', type: 'error' });
                return;
            }
            const res = await api.post(`/posts/${postId}/comment`, {
                text: newComment,
                authorRoll: user.rollNumber,
                authorName: user.fullName
            });
            setComments(res.data); // Backend returns the updated list
            setNewComment(""); // Changed from setText to setNewComment

            // Notify parent component of comment update
            if (onCommentsUpdate) {
                onCommentsUpdate(res.data);
            }
        } catch (err) {
            setNotification({ show: true, message: 'Error posting comment', type: 'error' });
        }
        // Removed finally block as per the provided snippet's handleComment
    };

    const handleDeleteComment = async (commentId) => {
        if (!confirm('Delete this comment?')) return;

        try {
            const res = await api.delete(`/posts/${postId}/comment/${commentId}`);
            setComments(res.data);

            // Notify parent component of comment update
            if (onCommentsUpdate) {
                onCommentsUpdate(res.data);
            }
        } catch (err) {
            setNotification({ show: true, message: err.response?.data?.msg || 'Failed to delete comment', type: 'error' });
        }
    };

    return (
        <div className="mt-8 pt-8 border-t border-gray-100">
            <h3 className="text-[10px] font-black tracking-widest uppercase mb-4 text-gray-400">Discussion</h3>

            {/* Input - Show login prompt for guests */}
            {Cookies.get('token') ? (
                <form onSubmit={handleComment} className="mb-8 flex gap-2">
                    <input
                        type="text"
                        value={newComment}
                        placeholder="Ask a question or say congrats..."
                        className="flex-1 border-b border-gray-200 focus:border-black outline-none py-2 text-sm font-medium bg-transparent"
                        onChange={(e) => setNewComment(e.target.value)}
                    />
                    <button className="text-[10px] font-black uppercase tracking-widest text-black hover:opacity-70 transition-opacity">
                        POST
                    </button>
                </form>
            ) : (
                <div className="mb-8 p-4 bg-gray-50 rounded-xl border border-gray-200 text-center">
                    <p className="text-sm text-gray-600 mb-3">Want to join the discussion?</p>
                    <a
                        href="/login"
                        className="inline-block bg-black text-white px-6 py-2 rounded-full text-xs font-bold tracking-widest hover:bg-gray-800 transition-all"
                    >
                        LOGIN TO COMMENT
                    </a>
                </div>
            )}

            {/* List */}
            <div className="space-y-6">
                {comments.map((c, i) => (
                    <div key={i} className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex justify-between items-baseline mb-1">
                            <span className="text-[10px] font-black uppercase tracking-tight">{c.authorName}</span>
                            <span className="text-[9px] font-bold text-gray-400">{new Date(c.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-xs font-medium text-gray-600 leading-relaxed">{c.text}</p>
                    </div>
                ))}</div>

            {/* Notification Modal */}
            {notification.show && (
                <div
                    className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn"
                    onClick={() => setNotification({ show: false, message: '', type: '' })}
                >
                    <div
                        className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 transform animate-slideUp"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-xl font-black uppercase mb-2 text-red-600">Error</h3>
                        <p className="text-sm text-gray-600 mb-6">{notification.message}</p>
                        <button
                            onClick={() => setNotification({ show: false, message: '', type: '' })}
                            className="w-full px-4 py-3 bg-black text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-all uppercase tracking-wide"
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}