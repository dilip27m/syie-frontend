"use client";
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';

export default function Navbar() {
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = useState(null);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const userCookie = Cookies.get('user_data');
        if (userCookie) setUser(JSON.parse(userCookie));
    }, []);

    const handleLogout = () => {
        Cookies.remove('token');
        Cookies.remove('user_data');
        router.push('/login');
    };

    const navLinks = [
        { name: 'Experiences', href: '/feed' },
        { name: 'Discussion', href: '/discuss' },
        { name: 'Share Story', href: '/create' },
    ];

    return (
        <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

                {/* Logo */}
                <Link href="/" className="font-bold tracking-tight text-lg flex items-center gap-2">
                    <span className="text-black">Placement</span>
                    <span className="text-gray-400">Flow</span>
                </Link>

                {/* Desktop Navigation - Clean & Minimal */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={`text-xs font-bold uppercase tracking-widest transition-colors ${pathname === link.href
                                ? 'text-black border-b-2 border-black pb-1'
                                : 'text-gray-400 hover:text-black'
                                }`}
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                {/* Desktop User Actions */}
                <div className="hidden md:flex items-center gap-4">
                    {user ? (
                        <>
                            <Link href={`/student/${user.rollNumber}`} className="text-xs font-bold text-gray-500 hover:text-black uppercase tracking-widest">
                                {user.fullName}
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="bg-black text-white px-4 py-2 rounded-full text-[10px] font-bold tracking-widest hover:bg-gray-800 transition-all"
                            >
                                LOGOUT
                            </button>
                        </>
                    ) : (
                        <Link
                            href="/login"
                            className="bg-black text-white px-4 py-2 rounded-full text-[10px] font-bold tracking-widest hover:bg-gray-800 transition-all"
                        >
                            LOGIN
                        </Link>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
                    <div className="space-y-1.5">
                        <span className={`block w-6 h-0.5 bg-black transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                        <span className={`block w-6 h-0.5 bg-black transition-all ${menuOpen ? 'opacity-0' : ''}`}></span>
                        <span className={`block w-6 h-0.5 bg-black transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
                    </div>
                </button>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="md:hidden bg-white border-b border-gray-100 px-4 py-4 space-y-4">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            onClick={() => setMenuOpen(false)}
                            className="block text-sm font-bold text-gray-600 py-2 border-b border-gray-50"
                        >
                            {link.name}
                        </Link>
                    ))}
                    <div className="pt-2 flex justify-between items-center">
                        {user ? (
                            <>
                                <Link href={`/student/${user?.rollNumber}`} className="text-sm font-bold text-black">
                                    {user?.fullName}
                                </Link>
                                <button onClick={handleLogout} className="text-xs font-bold text-red-500">LOGOUT</button>
                            </>
                        ) : (
                            <Link href="/login" className="text-sm font-bold text-black w-full text-center py-2 bg-black text-white rounded-full">
                                LOGIN
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}