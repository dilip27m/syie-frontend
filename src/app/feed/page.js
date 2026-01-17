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

  return (
    <div className="min-h-screen bg-white text-black pt-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tighter uppercase mb-2">Interview Experiences</h2>
          <p className="text-xs text-gray-500 uppercase tracking-widest">Real stories from our students</p>
        </header>

        <div className="relative mb-8">
          <input
            type="text"
            placeholder="Filter by company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-4 pr-12 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none text-sm"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
            >
              ✕
            </button>
          )}
        </div>

        <div className="space-y-8">
          {posts.length === 0 && (
            <p className="text-center text-gray-400 py-10">No interview experiences yet.</p>
          )}

          {posts.map((post) => (
            <div key={post._id} className="bg-white border border-gray-100 rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow">
              <h2 className="text-2xl font-black tracking-tight uppercase mb-4">
                {post.companyName}
              </h2>

              <p className="text-sm text-gray-700 leading-relaxed mb-6 whitespace-pre-wrap">
                {post.experience}
              </p>

              <div className="flex items-center justify-between text-xs font-bold tracking-widest text-gray-400 border-t border-gray-50 pt-4">
                <div className="flex items-center gap-4">
                  <Link
                    href={`/student/${post.authorRoll}`}
                    className="hover:text-black transition-colors flex items-center gap-2"
                  >
                    <span>{post.authorName}</span>
                    {post.authorPlacement?.isPlaced && (
                      <span className="ml-2 text-[9px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                        PLACED @ {post.authorPlacement.placedCompany.toUpperCase()}
                      </span>
                    )}
                  </Link>
                  <span className="text-gray-400">{formatPostTime(post.createdAt)}</span>
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
          ))}
        </div>

        {hasMore && posts.length > 0 && (
          <button
            onClick={() => {
              const nextPage = page + 1;
              setPage(nextPage);
              fetchPosts(nextPage, search, false);
            }}
            className="w-full py-4 bg-gray-100 text-black font-bold rounded-2xl hover:bg-gray-200 transition-colors mt-8"
          >
            LOAD MORE
          </button>
        )}
      </div>
    </div>
  );
}