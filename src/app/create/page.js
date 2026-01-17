"use client";
import { useState } from 'react';
import api from '@/lib/axios';
import { useRouter } from 'next/navigation';

export default function CreatePost() {
  const [formData, setFormData] = useState({
    companyName: '',
    rounds: '',
    experience: '',
    result: 'Waiting'
  });
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      await api.post('/posts', { ...formData, authorName: user.fullName });
      router.push('/feed');
    } catch (err) {
      alert("Error posting. Ensure you are logged in.");
    }
  };

  return (
    <div className="min-h-screen bg-white text-black px-8 pt-16">
      <h2 className="text-3xl font-black tracking-tighter uppercase mb-12">Share <br/> Experience</h2>
      
      <form onSubmit={handleSubmit} className="space-y-10 pb-20">
        <div className="flex flex-col">
          <label className="text-[10px] font-black tracking-widest text-gray-400 uppercase mb-2">Company Name</label>
          <input 
            type="text" 
            className="border-b-2 border-gray-100 focus:border-black outline-none py-2 font-bold uppercase text-sm tracking-widest"
            onChange={(e) => setFormData({...formData, companyName: e.target.value})}
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="text-[10px] font-black tracking-widest text-gray-400 uppercase mb-2">Detailed Review</label>
          <textarea 
            rows="5"
            className="border-2 border-gray-100 focus:border-black outline-none p-4 text-sm font-medium leading-relaxed"
            placeholder="Describe the rounds, difficulty, and questions..."
            onChange={(e) => setFormData({...formData, experience: e.target.value})}
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="text-[10px] font-black tracking-widest text-gray-400 uppercase mb-4">Outcome</label>
          <div className="flex gap-4">
            {['Selected', 'Rejected', 'Waiting'].map((res) => (
              <button
                key={res}
                type="button"
                onClick={() => setFormData({...formData, result: res})}
                className={`flex-1 py-3 text-[10px] font-black tracking-widest border transition-all ${formData.result === res ? 'bg-black text-white border-black' : 'border-gray-100 text-gray-400'}`}
              >
                {res.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <button className="w-full bg-black text-white py-5 rounded-none font-black text-xs tracking-[0.3em] uppercase shadow-2xl active:scale-95 transition-all">
          Publish to Archive
        </button>
      </form>
    </div>
  );
}