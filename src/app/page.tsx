"use client";
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-black">
      <section className="px-8 pt-24 pb-12 text-center">
        <h1 className="text-5xl font-black tracking-tighter leading-none mb-6">
          INSIGHTS. <br /> DIRECTLY.
        </h1>
        <p className="max-w-xs mx-auto text-sm font-medium text-gray-500 uppercase tracking-widest mb-12">
          The official interview database for the Class of 2026.
        </p>

        <div className="flex flex-col gap-4 max-w-sm mx-auto">
          <Link href="/login" className="bg-black text-white py-4 rounded-full font-bold text-sm tracking-widest hover:bg-gray-800 transition-all active:scale-95">
            LOG IN
          </Link>
          <Link href="/feed" className="bg-white text-black border border-black py-4 rounded-full font-bold text-sm tracking-widest hover:bg-gray-50 transition-all">
            BROWSE ARCHIVE
          </Link>
        </div>
      </section>

      {/* Glassmorphic Stats */}
      <section className="mt-auto p-8">
        <div className="glass rounded-3xl p-8 flex justify-between items-center border border-gray-100 shadow-xl">
          <div className="text-center">
            <span className="block text-xl font-bold">120+</span>
            <span className="text-[10px] font-bold text-gray-400 uppercase">Posts</span>
          </div>
          <div className="h-8 w-[1px] bg-gray-200"></div>
          <div className="text-center">
            <span className="block text-xl font-bold">45</span>
            <span className="text-[10px] font-bold text-gray-400 uppercase">Companies</span>
          </div>
          <div className="h-8 w-[1px] bg-gray-200"></div>
          <div className="text-center">
            <span className="block text-xl font-bold">2026</span>
            <span className="text-[10px] font-bold text-gray-400 uppercase">Batch</span>
          </div>
        </div>
      </section>
    </div>
  );
}