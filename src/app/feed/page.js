"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/lib/axios';
import Comments from '@/components/Comments';
import { MessageCircle } from 'lucide-react';
import { formatPostTime } from '@/lib/timeUtils';

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [activeCommentId, setActiveCommentId] = useState(null);

  useEffect(() => {
    setPosts([]);
    setPage(1);
    fetchPosts(1, search, true);

    const delayDebounceFn = setTimeout(() => {
      setPosts([]);
      setPage(1);
      fetchPosts(1, search, true);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  const fetchPosts = async (pageNum, searchTerm, reset = false) => {
    try {
      let url = `/posts?page=${pageNum}`;
      if (searchTerm) url += `&company=${searchTerm}`;
      url += `&postType=Interview`;

      const res = await api.get(url);

      if (res.data.length < 10) setHasMore(false);
      else setHasMore(true);

      if (reset) setPosts(res.data);
      else setPosts(prev => [...prev, ...res.data]);
    } catch (err) {
      console.error("Error fetching posts:", err);
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
    <div className="min-h-screen bg-gray-50 text-black pt-20 pb-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">

        {/* Header Section - Matches Discussion Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-black tracking-tighter uppercase">Interview Archive</h1>
          <p className="text-xs text-gray-500 font-bold tracking-widest uppercase">
            Real experiences from real students
          </p>
        </div>

        {/* Search Bar - Matches Discussion Input Box Style */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-8 relative group">
          <div className="absolute inset-y-0 left-0 pl-8 flex items-center pointer-events-none">
            <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search by company (e.g. Google)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 outline-none text-sm font-medium placeholder-gray-400 bg-transparent"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
            >
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Posts Feed */}
        <div className="space-y-6">
          {posts.length === 0 && (
            <p className="text-center text-gray-400 py-10">No interview stories found.</p>
          )}

          {posts.map((post) => (
            <div key={post._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">

              {/* Card Header: Author & Metadata */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center text-sm font-bold border border-gray-100">
                    {post.authorName?.[0] || "U"}
                  </div>

                  <div>
                    <Link href={`/student/${post.authorRoll}`} className="block text-sm font-bold hover:underline decoration-1 underline-offset-2">
                      {post.authorName}
                    </Link>
                    <div className="flex flex-wrap items-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                      <span>{formatPostTime(post.createdAt)}</span>
                      {post.authorPlacement?.isPlaced && (
                        <>
                          <span>•</span>
                          <span className="text-green-600 bg-green-50 px-1.5 py-0.5 rounded border border-green-100">
                            Placed @ {post.authorPlacement.placedCompany}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="mb-4">
                <h3 className="text-lg font-black tracking-tight uppercase mb-2 text-gray-900">
                  {post.companyName}
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {post.experience}
                </p>
              </div>

              {/* Card Footer: Actions (Matches Discussion Button Style) */}
              <div>
                <button
                  onClick={() => toggleComments(post._id)}
                  className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
                >
                  <MessageCircle size={14} className={activeCommentId === post._id ? "text-black" : "text-gray-400"} />
                  {activeCommentId === post._id ? 'Hide Comments' : `Comments (${post.comments?.length || 0})`}
                </button>
              </div>

              {/* Comments Section */}
              {activeCommentId === post._id && (
                <div className="mt-4 pt-4 border-t border-gray-50">
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

        {/* Load More Button - Styled to match the clean aesthetic */}
        {hasMore && posts.length > 0 && (
          <div className="mt-12 text-center">
            <button
              onClick={() => {
                const nextPage = page + 1;
                setPage(nextPage);
                fetchPosts(nextPage, search, false);
              }}
              className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black border-b border-transparent hover:border-black pb-0.5 transition-all"
            >
              LOAD MORE STORIES
            </button>
          </div>
        )}
      </div>
    </div>
  );
}