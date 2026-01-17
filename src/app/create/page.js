"use client";
import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function CreatePost() {
  const [formData, setFormData] = useState({
    companyName: "",
    experience: "",
    postType: 'Interview', // Hardcoded - discussions use /discuss page
    interviewDate: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const userData = Cookies.get('user_data');
      const user = userData ? JSON.parse(userData) : null;

      if (!user) {
        setError("Please login to post");
        setLoading(false);
        return;
      }

      await api.post('/posts', {
        ...formData,
        authorRoll: user.rollNumber,
        authorName: user.fullName
      });

      router.push('/feed');
    } catch (err) {
      setError(err.response?.data?.msg || "Error creating post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white px-4 sm:px-6 lg:px-8 py-6 sm:py-12 pt-20 sm:pt-24">
      <div className="max-w-2xl mx-auto">
        <header className="mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tighter uppercase mb-2">Share Your Story</h2>
          <p className="text-xs text-gray-500 uppercase tracking-widest">Help others learn from your experience</p>
        </header>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8 pb-20">
          {/* Company Name */}
          <div className="flex flex-col group">
            <label className="text-[10px] font-black tracking-[0.2em] text-gray-400 uppercase mb-3 transition-colors group-focus-within:text-black">
              Company Name
            </label>
            <input
              type="text"
              required
              placeholder="Google, Microsoft, Amazon..."
              className="w-full p-4 bg-gray-100 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-black transition-all outline-none text-sm"
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
            />
          </div>

          {/* Interview Date */}
          <div className="flex flex-col group">
            <label className="text-[10px] font-black tracking-[0.2em] text-gray-400 uppercase mb-3">
              Interview Date (Optional)
            </label>
            <input
              type="date"
              className="w-full p-4 bg-gray-100 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-black transition-all outline-none text-sm"
              onChange={(e) => setFormData({ ...formData, interviewDate: e.target.value })}
            />
          </div>

          {/* Experience */}
          <div className="flex flex-col group">
            <label className="text-[10px] font-black tracking-[0.2em] text-gray-400 uppercase mb-3 transition-colors group-focus-within:text-black">
              Your Experience
            </label>
            <textarea
              required
              rows="10"
              placeholder="Share your interview process, questions asked, tips..."
              className="w-full p-4 bg-gray-100 border border-gray-200 rounded-2xl resize-none focus:bg-white focus:ring-2 focus:ring-black transition-all outline-none text-sm"
              onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-black text-white font-black text-sm tracking-widest uppercase rounded-2xl hover:bg-gray-800 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'PUBLISHING...' : 'Publish Story'}
          </button>
        </form>
      </div>
    </div>
  );
}