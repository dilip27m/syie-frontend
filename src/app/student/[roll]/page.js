"use client";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { useParams } from "next/navigation";
import Cookies from 'js-cookie';
import { Edit2, Trash2, Briefcase, MessageSquare } from 'lucide-react';
import { formatPostTime } from '@/lib/timeUtils';

export default function StudentProfile() {
  const { roll } = useParams();
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState({ name: "", roll: roll });
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [editingPostId, setEditingPostId] = useState(null);
  const [editedContent, setEditedContent] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/posts/student/${roll}`);
        const postsData = res.data.posts || res.data;
        setPosts(Array.isArray(postsData) ? postsData : []);

        if (postsData.length > 0) {
          setUser({ name: postsData[0].authorName, roll: roll });
        }

        const userData = Cookies.get('user_data');
        if (userData) {
          const currentUser = JSON.parse(userData);
          setIsOwnProfile(currentUser.rollNumber === roll);
        }
      } catch (err) {
        console.error("Error loading profile:", err);
      }
    };
    fetchData();
  }, [roll]);

  const handleDeletePost = (postId) => {
    setDeleteConfirmId(postId);
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/posts/${deleteConfirmId}`);
      setPosts(posts.filter(p => p._id !== deleteConfirmId));
      setDeleteConfirmId(null);
    } catch (err) {
      alert("Error deleting post");
    }
  };

  const startEdit = (post) => {
    setEditingPostId(post._id);
    setEditedContent(post.experience);
  };

  const cancelEdit = () => {
    setEditingPostId(null);
    setEditedContent("");
  };

  const saveEdit = async (postId) => {
    try {
      await api.put(`/posts/${postId}`, { experience: editedContent });
      setPosts(posts.map(p => p._id === postId ? { ...p, experience: editedContent } : p));
      setEditingPostId(null);
      setEditedContent("");
    } catch (err) {
      alert(err.response?.data?.msg || 'Failed to edit post');
    }
  };

  const interviewPosts = posts.filter(p => p.postType !== 'Discussion').length;
  const discussPosts = posts.filter(p => p.postType === 'Discussion').length;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="h-32 bg-gradient-to-r from-gray-900 to-black w-full"></div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 -mt-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col sm:flex-row items-center sm:items-end gap-6">
          <div className="w-24 h-24 bg-white rounded-2xl p-1 shadow-md">
            <div className="w-full h-full bg-gray-100 rounded-xl flex items-center justify-center text-3xl font-black text-gray-300">
              {user.name?.[0] || "U"}
            </div>
          </div>
          <div className="text-center sm:text-left flex-1">
            <h1 className="text-2xl font-black tracking-tight uppercase">{user.name || "Student"}</h1>
            <p className="text-sm font-mono text-gray-500 tracking-widest uppercase">{user.roll}</p>
          </div>
          <div className="flex gap-6 text-center">
            <div>
              <span className="block text-xl font-black">{interviewPosts}</span>
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Interviews</span>
            </div>
            <div>
              <span className="block text-xl font-black">{discussPosts}</span>
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Discussions</span>
            </div>
          </div>
        </div>

        <h2 className="mt-10 mb-6 text-sm font-black text-gray-400 uppercase tracking-widest">Activity</h2>

        <div className="grid grid-cols-1 gap-6">
          {posts.map((post) => (
            <div key={post._id} className="bg-white p-6 rounded-xl border border-gray-100">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-black uppercase flex-1">{post.companyName}</h3>
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

              {isOwnProfile && (
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
              )}

              {editingPostId === post._id ? (
                <div className="mb-4">
                  <textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black outline-none resize-none"
                    rows="6"
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => saveEdit(post._id)}
                      className="px-4 py-2 bg-black text-white rounded-lg text-xs font-bold hover:bg-gray-800"
                    >
                      SAVE
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="px-4 py-2 bg-gray-100 text-black rounded-lg text-xs font-bold hover:bg-gray-200"
                    >
                      CANCEL
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                  {post.experience}
                </p>
              )}

              <span className="text-[10px] font-bold text-gray-400">
                {formatPostTime(post.createdAt)}
              </span>
            </div>
          ))}
          {posts.length === 0 && (
            <p className="text-center text-gray-400 py-10">No activity yet.</p>
          )}
        </div>
      </div>

      {/* Custom Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn"
          onClick={() => setDeleteConfirmId(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 transform animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-black uppercase mb-2">Delete Post?</h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete this post?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-800 rounded-xl text-sm font-bold hover:bg-gray-200 transition-all uppercase tracking-wide"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 transition-all uppercase tracking-wide"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}