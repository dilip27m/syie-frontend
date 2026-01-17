"use client";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { useParams } from "next/navigation";

export default function StudentProfile() {
  const { roll } = useParams();
  const [posts, setPosts] = useState([]);
  const [studentName, setStudentName] = useState("");

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const res = await api.get(`/posts/student/${roll}`);
        setPosts(res.data);
        if(res.data.length > 0) setStudentName(res.data[0].authorName);
      } catch (err) {
        console.error("Error loading profile");
      }
    };
    fetchStudentData();
  }, [roll]);

  return (
    <div className="min-h-screen bg-white text-black px-8 pt-20">
      <div className="mb-16 border-l-4 border-black pl-6">
        <h1 className="text-sm font-bold tracking-[0.3em] text-gray-400 uppercase mb-2">Student Profile</h1>
        <h2 className="text-4xl font-black tracking-tighter uppercase">{studentName || roll}</h2>
        <p className="text-xs font-mono mt-2 text-gray-500">{roll}</p>
      </div>

      <div className="space-y-12">
        <h3 className="text-[10px] font-black tracking-widest uppercase text-gray-400 border-b border-gray-100 pb-2">Interview History</h3>
        
        {posts.length === 0 ? <p className="text-gray-400 text-sm italic">No records found.</p> : null}

        {posts.map((post) => (
          <div key={post._id} className="pb-8 border-b border-gray-50">
            <div className="flex justify-between items-end mb-4">
              <h4 className="text-xl font-black tracking-tight uppercase">{post.companyName}</h4>
              <span className="text-[10px] font-bold text-gray-400">{new Date(post.date).getFullYear()}</span>
            </div>
            <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed mb-4">{post.experience}</p>
            <div className={`text-[10px] font-black uppercase tracking-widest ${post.result === 'Selected' ? 'text-green-600' : 'text-black'}`}>
              Result: {post.result}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}