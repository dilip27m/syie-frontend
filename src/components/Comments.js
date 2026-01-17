"use client";
import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import Cookies from 'js-cookie';

export default function Comments({ postId, comments: initialComments, onCommentsUpdate }) {
    const [comments, setComments] = useState(initialComments || []);
    const [newComment, setNewComment] = useState("");

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
                alert("Please login to comment.");
                // Removed setLoading(false) as per the provided snippet's handleComment
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
            alert("Error posting comment"); // Changed alert message
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
            alert(err.response?.data?.msg || 'Failed to delete comment');
        }
    };

    return (
        <div className="mt-8 pt-8 border-t border-gray-100">
            <h3 className="text-[10px] font-black tracking-widest uppercase mb-4 text-gray-400">Discussion</h3>

            {/* Input */}
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
                ))}
            </div>
        </div>
    );
}