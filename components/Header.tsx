
import React from 'react';

interface HeaderProps {
  onUploadClick: () => void;
  onSearch: (query: string) => void;
}

export default function Header({ onUploadClick, onSearch }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#09090b]/80 backdrop-blur-md border-b border-zinc-800">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 cursor-pointer group">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
          </div>
          <span className="text-2xl font-black tracking-tighter">buy<span className="text-indigo-500">beatz</span></span>
        </div>

        <div className="flex-1 max-w-xl hidden md:block">
          <div className="relative">
            <input 
              type="text"
              placeholder="Search for beats, genres, tags..."
              onChange={(e) => onSearch(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 pl-12 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
            />
            <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            className="text-sm font-semibold text-zinc-400 hover:text-white transition-colors px-4 py-2 hidden sm:block"
          >
            Feed
          </button>
          <button 
            className="text-sm font-semibold text-zinc-400 hover:text-white transition-colors px-4 py-2 hidden sm:block"
          >
            Charts
          </button>
          <button 
            onClick={onUploadClick}
            className="bg-zinc-100 text-black px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-white transition-colors active:scale-95"
          >
            Upload Beat
          </button>
        </div>
      </div>
    </header>
  );
}
