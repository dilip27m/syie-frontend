"use client";
import { useState, useEffect } from 'react';
import api from '@/lib/axios';

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await api.get(`/posts?company=${search}`);
        setPosts(res.data);
      } catch (err) {
        console.error("Error fetching posts");
      }
    };
    fetchPosts();
  }, [search]);

  return (
    <div className="min-h-screen bg-white text-black px-6 pt-10">
      <header className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black tracking-tighter uppercase">Archive</h1>
          <p className="text-[10px] font-bold text-gray-400 tracking-[0.2em]">2026 PLACEMENT SEASON</p>
        </div>
        <button onClick={() => window.location.href='/create'} className="bg-black text-white px-4 py-2 rounded-full text-xs font-bold tracking-widest">
          + POST
        </button>
      </header>

      {/* Minimal Search */}
      <div className="mb-12">
        <input 
          type="text"
          placeholder="FILTER BY COMPANY..."
          className="w-full py-4 border-b border-gray-100 focus:border-black transition-all outline-none text-xs font-bold tracking-widest"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Post List */}
      <div className="space-y-12 pb-20">
        {posts.map((post) => (
          <div key={post._id} className="group cursor-pointer">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-black tracking-tighter uppercase group-hover:underline underline-offset-8">
                {post.companyName}
              </h2>
              <span className="text-[10px] font-black border border-black px-2 py-1 uppercase">
                {post.result}
              </span>
            </div>
            <p className="text-sm text-gray-500 font-medium mb-4 line-clamp-2 leading-relaxed">
              {post.experience}
            </p>
            <div className="flex items-center gap-4 text-[10px] font-bold text-gray-400 tracking-widest uppercase">
              <span>{post.authorName}</span>
              <span>•</span>
              <span>{new Date(post.date).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}