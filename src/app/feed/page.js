"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/lib/axios';
import Comments from '@/components/Comments';
import Cookies from 'js-cookie';
import { Edit2, Trash2, MessageCircle, Briefcase, MessageSquare } from 'lucide-react';

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [activeCommentId, setActiveCommentId] = useState(null);
  const [postType, setPostType] = useState("All");
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setPage(1);
      fetchPosts(1, search, postType, true);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [search, postType]);

  const fetchPosts = async (pageNum, searchTerm, type, reset = false) => {
    try {
      let url = `/posts?page=${pageNum}`;
      if (searchTerm) url += `&company=${searchTerm}`;
      if (type !== "All") url += `&postType=${type}`;

      console.log('Fetching posts from:', url);
      const res = await api.get(url);
      console.log('Posts received:', res.data);

      if (res.data.length < 10) setHasMore(false);
      else setHasMore(true);

      if (reset) setPosts(res.data);
      else setPosts(prev => [...prev, ...res.data]);
    } catch (err) {
      console.error("Error fetching posts:", err);
      console.error("Error details:", err.response?.data || err.message);
    }
  };

  const toggleComments = (postId) => {
    if (activeCommentId === postId) setActiveCommentId(null);
    else setActiveCommentId(postId);
  };

  const handleDeletePost = async (postId) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      await api.delete(`/posts/${postId}`);
      setPosts(posts.filter(p => p._id !== postId));
    } catch (err) {
      alert(err.response?.data?.msg || 'Failed to delete post');
    }
  };

  const [editingPostId, setEditingPostId] = useState(null);
  const [editForm, setEditForm] = useState({ companyName: '', experience: '', postType: '' });

  const startEdit = (post) => {
    setEditingPostId(post._id);
    setEditForm({
      companyName: post.companyName,
      experience: post.experience,
      postType: post.postType
    });
  };

  const handleEditPost = async (postId) => {
    try {
      const res = await api.put(`/posts/${postId}`, editForm);
      setPosts(posts.map(p => p._id === postId ? res.data : p));
      setEditingPostId(null);
    } catch (err) {
      alert(err.response?.data?.msg || 'Failed to edit post');
    }
  };

  return (
    <div className="min-h-screen bg-white text-black pt-16">
      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-20 max-w-3xl mx-auto">
        <header className="mb-8 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tighter uppercase">Archive</h2>
          <p className="text-[10px] font-bold text-gray-400 tracking-[0.2em]">2026 PLACEMENT SEASON</p>
        </header>

        {/* Search Bar */}
        <div className="relative mb-8">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              🔍
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="FILTER BY COMPANY..."
              className={`w-full pl-12 pr-12 py-4 text-xs font-bold tracking-widest uppercase bg-gray-50 rounded-xl focus:outline-none focus:ring-2 transition-all ${search ? 'ring-2 ring-black bg-yellow-50' : 'focus:ring-gray-300'
                }`}
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
              >
                ✕
              </button>
            )}
          </div>
          {search && (
            <p className="text-xs text-gray-500 mt-2">
              Filtering by: <span className="font-bold text-black">{search}</span>
            </p>
          )}
        </div>

        {/* Tab Filters */}
        <div className="mb-8 flex gap-2">
          {['All', 'Interview', 'Discussion'].map(type => (
            <button
              key={type}
              onClick={() => setPostType(type)}
              className={`px-6 py-2 rounded-full text-xs font-bold tracking-widest uppercase transition-all ${postType === type
                ? 'bg-black text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              {type === 'Interview' && '📝 '}
              {type === 'Discussion' && '💬 '}
              {type}
            </button>
          ))}
        </div>


        <div className="space-y-16">
          {posts.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-xl font-black tracking-tight uppercase mb-2">No Posts Found</h3>
              <p className="text-sm text-gray-500">
                {search
                  ? `No posts match "${search}"`
                  : postType !== 'All'
                    ? `No ${postType.toLowerCase()} posts yet`
                    : 'Be the first to share your experience!'}
              </p>
            </div>
          ) : (
            posts.map((post) => (
              <div key={post._id} className="group border-b border-gray-100 pb-10">




                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-black tracking-tight uppercase flex-1">
                      {post.companyName}
                    </h2>
                    {/* Post Type Tag - NO EMOJI */}
                    {post.postType === 'Discussion' ? (
                      <span className="flex items-center gap-1 text-[10px] font-bold bg-blue-100 text-blue-700 px-3 py-1 rounded-full uppercase tracking-wider">
                        <MessageSquare size={12} />
                        Discussion
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] font-bold bg-green-100 text-green-700 px-3 py-1 rounded-full uppercase tracking-wider">
                        <Briefcase size={12} />
                        Interview
                      </span>
                    )}
                  </div>

                  {/* Edit/Delete Buttons - Lucide Icons */}
                  {(() => {
                    const userData = Cookies.get('user_data');
                    const user = userData ? JSON.parse(userData) : null;
                    return user && user.rollNumber === post.authorRoll ? (
                      <div className="flex gap-3 mb-4">
                        <button
                          onClick={() => startEdit(post)}
                          className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
                        >
                          <Edit2 size={14} />
                          <span className="hidden sm:inline">Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeletePost(post._id)}
                          className="flex items-center gap-1 text-xs text-red-600 hover:text-red-800 font-medium transition-colors"
                        >
                          <Trash2 size={14} />
                          <span className="hidden sm:inline">Delete</span>
                        </button>
                      </div>
                    ) : null;
                  })()}
                </div>

                {editingPostId === post._id ? (
                  // Edit Mode
                  <div className="space-y-4 mb-4">
                    <input
                      value={editForm.companyName}
                      onChange={(e) => setEditForm({ ...editForm, companyName: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg font-bold"
                      placeholder="Company Name"
                    />
                    <textarea
                      value={editForm.experience}
                      onChange={(e) => setEditForm({ ...editForm, experience: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg min-h-[100px]"
                      placeholder="Experience"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditPost(post._id)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingPostId(null)}
                        className="px-4 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <p className="text-sm text-gray-600 font-medium mb-6 leading-relaxed whitespace-pre-wrap">
                    {post.experience}
                  </p>
                )}


                <div className="flex items-center justify-between text-[10px] font-bold tracking-widest uppercase">
                  <div className="flex gap-4">
                    <Link
                      href={`/student/${post.authorRoll}`}
                      className="text-gray-400 hover:text-black transition-colors flex items-center gap-2"
                    >
                      <span>{post.authorName}</span>
                      {/* Placement Badge - NO EMOJI */}
                      {post.authorPlacement?.isPlaced && (
                        <span className="ml-2 text-[9px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                          PLACED @ {post.authorPlacement.placedCompany.toUpperCase()}
                        </span>
                      )}
                    </Link>
                    <span className="text-gray-400">{new Date(post.interviewDate || post.createdAt).toLocaleDateString()}</span>
                  </div>

                  <button
                    onClick={() => toggleComments(post._id)}
                    className="hover:text-black transition-colors text-gray-400 flex items-center gap-2"
                  >
                    <span className="flex items-center gap-1.5">
                      <MessageCircle size={14} />
                      COMMENTS
                      <span className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-[9px] font-black">
                        {post.comments?.length || 0}
                      </span>
                    </span>
                    <span className="text-xs">{activeCommentId === post._id ? '▼' : '▶'}</span>
                  </button>
                </div>

                {activeCommentId === post._id && (
                  <Comments postId={post._id} comments={post.comments} />
                )}
              </div>
            ))
          )}
        </div>


        {hasMore && (
          <div className="mt-12 text-center">
            <button
              onClick={() => {
                const nextPage = page + 1;
                setPage(nextPage);
                fetchPosts(nextPage, search, postType, false);
              }}
              className="text-xs font-bold tracking-widest border-b border-black pb-1 hover:opacity-50"
            >
              LOAD MORE
            </button>
          </div>
        )}
      </div>
    </div>
  );
}