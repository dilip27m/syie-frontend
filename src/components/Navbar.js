"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function Navbar() {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const token = Cookies.get('token');
        const userData = Cookies.get('user_data');
        setIsAuthenticated(!!token);
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    const handleLogout = () => {
        // Clear ALL cookies on logout
        Cookies.remove('token');
        Cookies.remove('user_data');
        router.push('/login');
    };

    return (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex justify-between items-center">
            <Link href="/feed">
                <h1 className="text-xl font-black tracking-tighter uppercase cursor-pointer">
                    Placement<span className="text-gray-400">Flow</span>
                </h1>
            </Link>

            <div className="flex items-center gap-6">
                <Link href="/create" className="hidden sm:block text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-black transition-colors">
                    Share Story
                </Link>

                {user && (
                    <Link href={`/student/${user.rollNumber}`} className="text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-black transition-colors">
                        {user.fullName || "My Profile"}
                    </Link>
                )}

                <button
                    onClick={handleLogout}
                    className="bg-black text-white px-4 py-2 rounded-full text-[10px] font-bold tracking-widest hover:bg-gray-800 transition-all"
                >
                    LOGOUT
                </button>
            </div>
        </nav>
    );
}