"use client";
import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { useRouter } from 'next/navigation';

export default function CreatePost() {
  const [formData, setFormData] = useState({
    companyName: '',
    experience: ''
  });
  const router = useRouter();

  // Redirect if not logged in
  useEffect(() => {
    if (!localStorage.getItem('token')) router.push('/login');
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      await api.post('/posts', { ...formData, authorName: user.fullName });
      router.push('/feed');
    } catch (err) {
      alert("Error posting. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-white text-black px-8 pt-16">
      <h2 className="text-3xl font-black tracking-tighter uppercase mb-2">Write Story</h2>
      <p className="text-gray-400 text-xs font-bold tracking-widest uppercase mb-12">Share your experience</p>
      
      <form onSubmit={handleSubmit} className="space-y-12 pb-20">
        
        {/* Company Name Input */}
        <div className="flex flex-col group">
          <label className="text-[10px] font-black tracking-[0.2em] text-gray-400 uppercase mb-3 transition-colors group-focus-within:text-black">
            Company
          </label>
          <input 
            type="text" 
            placeholder="e.g. GOOGLE"
            className="border-b-2 border-gray-100 focus:border-black outline-none py-4 font-black uppercase text-xl tracking-tighter placeholder-gray-200 transition-all"
            onChange={(e) => setFormData({...formData, companyName: e.target.value})}
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
            onChange={(e) => setFormData({...formData, experience: e.target.value})}
            required
          />
        </div>

        <button className="w-full bg-black text-white py-5 rounded-xl font-black text-xs tracking-[0.3em] uppercase shadow-2xl hover:scale-[1.02] active:scale-95 transition-all">
          Publish Story
        </button>
      </form>
    </div>
  );
}