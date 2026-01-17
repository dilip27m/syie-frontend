"use client";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { useParams } from "next/navigation";
import Cookies from "js-cookie";

export default function StudentProfile() {
  const { roll } = useParams();
  const [posts, setPosts] = useState([]);
  const [studentName, setStudentName] = useState("");
  const [placementStatus, setPlacementStatus] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [placementForm, setPlacementForm] = useState({
    isPlaced: false,
    placedCompany: "",
    package: ""
  });

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const res = await api.get(`/posts/student/${roll}`);
        // Handle both old format (array) and new format (object with posts)
        const postsData = res.data.posts || res.data;
        setPosts(postsData);
        if (postsData.length > 0) setStudentName(postsData[0].authorName);

        // Check if this is the user's own profile
        const userData = Cookies.get('user_data');
        if (userData) {
          const user = JSON.parse(userData);
          setIsOwnProfile(user.rollNumber === roll);
        }

        // Fetch placement status from user endpoint
        try {
          const userRes = await api.get(`/auth/user/${roll}`);
          setPlacementStatus(userRes.data);
          setPlacementForm({
            isPlaced: userRes.data.isPlaced || false,
            placedCompany: userRes.data.placedCompany || "",
            package: userRes.data.package || ""
          });
        } catch (err) {
          console.error("Could not fetch placement status");
        }
      } catch (err) {
        console.error("Error loading profile");
      }
    };
    fetchStudentData();
  }, [roll]);


  const handlePlacementUpdate = async () => {
    try {
      await api.put('/auth/placement-status', placementForm);
      setPlacementStatus({ ...placementStatus, ...placementForm });
      setShowModal(false);
      alert("Placement status updated!");
    } catch (err) {
      alert("Error updating placement status");
    }
  };

  return (
    <div className="min-h-screen bg-white text-black px-8 pt-20">
      <div className="mb-16 border-l-4 border-black pl-6">
        <h1 className="text-sm font-bold tracking-[0.3em] text-gray-400 uppercase mb-2">Student Profile</h1>
        <div className="flex items-center gap-4">
          <h2 className="text-4xl font-black tracking-tighter uppercase">{studentName || roll}</h2>
          {placementStatus?.isPlaced && (
            <span className="text-xs font-bold bg-green-100 text-green-700 px-4 py-1.5 rounded-full">
              ✓ PLACED @ {placementStatus.placedCompany.toUpperCase()}
            </span>
          )}
        </div>
        <p className="text-xs font-mono mt-2 text-gray-500">{roll}</p>

        {/* Profile Stats */}
        <div className="flex gap-6 mt-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black text-gray-800">{posts.length}</span>
            <span className="text-xs text-gray-500 uppercase tracking-wide">Posts</span>
          </div>
          {placementStatus?.createdAt && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 uppercase tracking-wide">
                Member since {new Date(placementStatus.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              </span>
            </div>
          )}
        </div>

        {isOwnProfile && (
          <button
            onClick={() => setShowModal(true)}
            className="mt-4 px-4 py-2 bg-black text-white text-xs font-bold rounded-lg hover:bg-gray-800 transition-colors"
          >
            {placementStatus?.isPlaced ? 'UPDATE PLACEMENT' : 'MARK AS PLACED'}
          </button>
        )}
      </div>

      {/* Placement Status Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-2xl font-black mb-6">Update Placement Status</h3>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <input
                  type="checkbox"
                  id="isPlaced"
                  checked={placementForm.isPlaced}
                  onChange={(e) => setPlacementForm({ ...placementForm, isPlaced: e.target.checked })}
                  className="w-5 h-5"
                />
                <label htmlFor="isPlaced" className="font-bold">I am placed</label>
              </div>

              {placementForm.isPlaced && (
                <>
                  <input
                    type="text"
                    placeholder="Company Name"
                    value={placementForm.placedCompany}
                    onChange={(e) => setPlacementForm({ ...placementForm, placedCompany: e.target.value })}
                    className="w-full p-3 border border-gray-200 rounded-xl"
                  />
                  <input
                    type="text"
                    placeholder="Package (Optional, e.g., 12 LPA)"
                    value={placementForm.package}
                    onChange={(e) => setPlacementForm({ ...placementForm, package: e.target.value })}
                    className="w-full p-3 border border-gray-200 rounded-xl"
                  />
                </>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handlePlacementUpdate}
                className="flex-1 bg-black text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors"
              >
                SAVE
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 bg-gray-100 text-black py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors"
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-12">
        <h3 className="text-[10px] font-black tracking-widest uppercase text-gray-400 border-b border-gray-100 pb-2">Interview History</h3>

        {posts.length === 0 ? <p className="text-gray-400 text-sm italic">No records found.</p> : null}

        {posts.map((post) => (
          <div key={post._id} className="pb-8 border-b border-gray-50">
            <div className="flex justify-between items-end mb-4">
              <h4 className="text-xl font-black tracking-tight uppercase">{post.companyName}</h4>
              <span className="text-[10px] font-bold text-gray-400">
                {post.interviewDate || post.createdAt
                  ? new Date(post.interviewDate || post.createdAt).getFullYear()
                  : 'N/A'}
              </span>
            </div>
            <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed mb-4">{post.experience}</p>
            <div className={`text-[10px] font-black uppercase tracking-widest ${post.result === 'Selected' ? 'text-green-600' : 'text-black'}`}>
              Result: {post.result || 'Pending'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}