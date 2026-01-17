"use client";
import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function CreatePost() {
  const [formData, setFormData] = useState({
    companyName: "",
    experience: "",
    postType: 'Interview',
    interviewDate: "" // Add interview date field
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
    setError(""); // Clear previous errors
    setLoading(true);

    try {
      const userData = Cookies.get('user_data');
      const user = userData ? JSON.parse(userData) : null;
      if (!user) {
        setError('Please log in to create a post');
        setLoading(false); // Ensure loading is false if user not found
        return;
      }
      await api.post('/posts', {
        ...formData,
        authorName: user.fullName,
        postType: formData.postType
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
        {/* Error Message Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8 pb-20">

          {/* Post Type Selector */}
          <div className="flex flex-col group">
            <label className="text-[10px] font-black tracking-[0.2em] text-gray-400 uppercase mb-3 transition-colors group-focus-within:text-black">
              Post Type
            </label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, postType: 'Interview' })}
                className={`flex-1 py-3 px-6 rounded-xl font-bold text-sm tracking-wide transition-all ${formData.postType === 'Interview'
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                📝 Interview Experience
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, postType: 'Discussion' })}
                className={`flex-1 py-3 px-6 rounded-xl font-bold text-sm tracking-wide transition-all ${formData.postType === 'Discussion'
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                💬 Discussion
              </button>
            </div>
          </div>

          {/* Company Name Input */}
          <div className="flex flex-col group">
            <label className="text-[10px] font-black tracking-[0.2em] text-gray-400 uppercase mb-3 transition-colors group-focus-within:text-black">
              Company
            </label>
            <input
              type="text"
              placeholder="e.g. GOOGLE"
              className="border-b-2 border-gray-100 focus:border-black outline-none py-4 font-black uppercase text-xl tracking-tighter placeholder-gray-200 transition-all"
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              required
            />
          </div>

          {/* Experience Text Area */}
          <div className="flex flex-col group h-full">
            <label className="text-[10px] font-black tracking-[0.2em] text-gray-400 uppercase mb-3 transition-colors group-focus-within:text-black">
              The Experience
            </label>
            <textarea
              rows="12"
              className="w-full resize-none border-2 border-gray-50 focus:border-black bg-gray-50 focus:bg-white rounded-xl outline-none p-6 text-sm font-medium leading-loose placeholder-gray-300 transition-all"
              placeholder="Tell us everything... How many rounds? What were the coding questions? How was the interviewer? Did you get selected?"
              onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
              required
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