"use client";
import { useState } from "react";
import Link from "next/link";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const [formData, setFormData] = useState({ rollNumber: "", fullName: "", password: "" });
    const router = useRouter();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await api.post('/auth/register', formData);
            alert("Registration successful! Please login.");
            router.push('/login');
        } catch (err) {
            alert(err.response?.data?.msg || "Error creating account");
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col px-6">
            <div className="mt-16 mb-10">
                <h1 className="text-4xl font-black text-gray-900 tracking-tighter">
                    Join the <br />Community.
                </h1>
                <p className="mt-2 text-gray-500 font-medium">Create an account to share your journey.</p>
            </div>

            <form className="space-y-5" onSubmit={handleRegister}>
                <div className="space-y-1">
                    <input
                        type="text"
                        placeholder="Full Name"
                        className="w-full p-4 bg-gray-100 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-black transition-all outline-none placeholder:text-gray-600"
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    />
                </div>

                <div className="space-y-1">
                    <input
                        type="text"
                        placeholder="Roll Number"
                        className="w-full p-4 bg-gray-100 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-black transition-all outline-none placeholder:text-gray-600"
                        onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                    />
                </div>

                <div className="space-y-1">
                    <input
                        type="password"
                        placeholder="Choose Password"
                        className="w-full p-4 bg-gray-100 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-black transition-all outline-none placeholder:text-gray-600"
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-gray-900 text-white font-bold py-4 rounded-2xl shadow-xl active:scale-95 transition-all mt-4"
                >
                    Create Account
                </button>
            </form>

            <div className="mt-auto pb-10 text-center text-sm">
                <span className="text-gray-500">Already have an account? </span>
                <Link href="/login" className="text-black font-bold underline underline-offset-4">Log In</Link>
            </div>
        </div>
    );
}