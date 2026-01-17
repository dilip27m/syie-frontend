"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/lib/axios';
import Comments from '@/components/Comments';
import Cookies from 'js-cookie';
import { MessageCircle } from 'lucide-react';
import { formatPostTime } from '@/lib/timeUtils';

export default function Discussion() {
    const [posts, setPosts] = useState([]);
    const [text, setText] = useState("");
    const [activeCommentId, setActiveCommentId] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userCookie = Cookies.get('user_data');
        if (userCookie) {
            setUser(JSON.parse(userCookie));
        }
        fetchDiscussions();
    }, []);

    const fetchDiscussions = async () => {
        try {
            const res = await api.get('/posts?postType=Discussion');
            setPosts(res.data);
        } catch (err) {
            console.error("Error loading discussions");
        }
    };

    const handlePost = async (e) => {
        e.preventDefault();
        if (!text.trim()) return;

        if (!user) {
            alert("Please login to post");
            return;
        }

        try {
            await api.post('/posts', {
                companyName: "General Discussion",
                experience: text,
                postType: "Discussion",
                authorRoll: user.rollNumber,
                authorName: user.fullName
            });
            setText("");
            fetchDiscussions();
        } catch (err) {
            console.error("Error posting:", err);
            alert("Error posting discussion");
        }
    };

    const toggleComments = (postId) => {
        setActiveCommentId(activeCommentId === postId ? null : postId);
    };

    const handleCommentsUpdate = (postId, updatedComments) => {
        setPosts(posts.map(post =>
            post._id === postId ? { ...post, comments: updatedComments } : post
        ));
    };

    return (
        <div className="min-h-screen bg-gray-50 text-black pb-20 pt-6">
            <div className="max-w-2xl mx-auto px-4 sm:px-6">

                <div className="mb-8">
                    <h1 className="text-2xl font-black tracking-tighter uppercase">Community Forum</h1>
                    <p className="text-xs text-gray-500 font-bold tracking-widest uppercase">
                        Notices & General Queries
                    </p>
                </div>

                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-8">
                    <form onSubmit={handlePost}>
                        <textarea
                            className="w-full resize-none outline-none text-sm p-2 placeholder-gray-400"
                            rows="3"
                            placeholder="Ask a question or share news..."
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        />
                        <div className="flex justify-end items-center mt-2 border-t border-gray-50 pt-3">
                            <button
                                type="submit"
                                className="bg-black text-white px-6 py-2 rounded-full text-[10px] font-bold tracking-widest hover:opacity-80 transition-all"
                            >
                                POST
                            </button>
                        </div>
                    </form>
                </div>

                <div className="space-y-6">
                    {posts.length === 0 && (
                        <p className="text-center text-gray-400 py-10">No discussions yet. Start one!</p>
                    )}

                    {posts.map((post) => (
                        <div key={post._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <div className="flex items-start justify-between mb-3">
                                <Link href={`/student/${post.authorRoll}`} className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center text-sm font-bold">
                                        {post.authorName?.[0]}
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold hover:underline">{post.authorName}</h3>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                            {formatPostTime(post.createdAt)}
                                        </p>
                                    </div>
                                </Link>
                            </div>

                            <p className="text-sm text-gray-700 leading-relaxed mb-4 whitespace-pre-wrap">
                                {post.experience}
                            </p>

                            <button
                                onClick={() => toggleComments(post._id)}
                                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
                            >
                                <MessageCircle size={14} />
                                {activeCommentId === post._id ? 'Hide Comments' : `Comments (${post.comments?.length || 0})`}
                            </button>

                            {activeCommentId === post._id && (
                                <div className="mt-4">
                                    <Comments
                                        postId={post._id}
                                        comments={post.comments}
                                        onCommentsUpdate={(updatedComments) => handleCommentsUpdate(post._id, updatedComments)}
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}