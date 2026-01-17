"use client";
import { useState } from "react";
import Link from "next/link";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [formData, setFormData] = useState({ rollNumber: "", password: "" });
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post('/auth/login', formData);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data));
            router.push('/feed');
        } catch (err) {
            alert(err.response?.data?.msg || "Authentication failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col px-6">
            <div className="mt-16 mb-10">
                <h2 className="text-4xl font-black text-gray-900 tracking-tighter">
                    Welcome Back
                </h2>
                <p className="mt-2 text-gray-500 font-medium">Sign in to access senior interview insights</p>
            </div>

            <form className="space-y-5" onSubmit={handleLogin}>
                <div className="space-y-1">
                    <input
                        type="text"
                        required
                        placeholder="Roll Number"
                        className="w-full p-4 bg-gray-100 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-black transition-all outline-none placeholder:text-gray-600"
                        onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                    />
                </div>

                <div className="space-y-1">
                    <input
                        type="password"
                        required
                        placeholder="Choose Password"
                        className="w-full p-4 bg-gray-100 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-black transition-all outline-none placeholder:text-gray-600"
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gray-900 text-white font-bold py-4 rounded-2xl shadow-xl active:scale-95 transition-all mt-4"
                >
                    {loading ? "Authenticating..." : "Sign In"}
                </button>
            </form>

            <div className="mt-auto pb-10 text-center text-sm">
                <span className="text-gray-500">Don't have an account? </span>
                <Link href="/register" className="text-black font-bold underline underline-offset-4">Create Account</Link>
            </div>
        </div>
    );
}