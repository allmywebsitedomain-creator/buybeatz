
import React from 'react';
import { User } from '../types';
import { ViewType } from '../App';

interface HeaderProps {
  onUploadClick: () => void;
  onSearch: (query: string) => void;
  onMenuClick: () => void;
  onViewChange: (view: ViewType) => void;
  activeView: ViewType;
  user: User | null;
  isAdminUnlocked?: boolean;
  onLogoHoldStart?: () => void;
  onLogoHoldEnd?: () => void;
  holdProgress?: number;
}

export default function Header({ 
  onUploadClick, 
  onSearch, 
  onMenuClick, 
  onViewChange, 
  activeView, 
  user,
  isAdminUnlocked,
  onLogoHoldStart,
  onLogoHoldEnd,
  holdProgress = 0
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full bg-[#050505]/80 backdrop-blur-2xl border-b border-zinc-900">
      <div className="container mx-auto px-6 h-24 flex items-center justify-between gap-8">
        <div className="flex items-center gap-8 xl:gap-12">
          <div 
            className="flex items-center gap-3 cursor-pointer group shrink-0 active:scale-95 transition-transform relative" 
            onMouseDown={onLogoHoldStart}
            onMouseUp={onLogoHoldEnd}
            onMouseLeave={onLogoHoldEnd}
            onTouchStart={onLogoHoldStart}
            onTouchEnd={onLogoHoldEnd}
          >
            {/* Cycle loading is now invisible as requested */}
            <div className={`w-12 h-12 rounded-[1.25rem] flex items-center justify-center group-hover:rotate-12 transition-all shadow-lg ${isAdminUnlocked ? 'bg-emerald-600 shadow-emerald-600/30' : 'bg-indigo-600 shadow-indigo-600/30'}`}>
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            </div>
            <span className={`text-3xl font-black tracking-tighter hidden sm:inline ${isAdminUnlocked ? 'text-emerald-500' : 'text-white'}`}>buy<span className={isAdminUnlocked ? 'text-white' : 'text-indigo-500'}>beatz</span></span>
          </div>

          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            <button 
              onClick={() => onViewChange('explore')}
              className={`px-4 xl:px-6 py-2.5 rounded-2xl text-[10px] xl:text-xs font-black uppercase tracking-widest transition-all ${activeView === 'explore' ? 'bg-white text-black' : 'text-zinc-500 hover:text-white'}`}
            >
              Explore
            </button>
            <button 
              onClick={() => onViewChange('songs')}
              className={`px-4 xl:px-6 py-2.5 rounded-2xl text-[10px] xl:text-xs font-black uppercase tracking-widest transition-all ${activeView === 'songs' ? 'bg-white text-black' : 'text-zinc-500 hover:text-white'}`}
            >
              Songs
            </button>
            <button 
              onClick={() => onViewChange('beats')}
              className={`px-4 xl:px-6 py-2.5 rounded-2xl text-[10px] xl:text-xs font-black uppercase tracking-widest transition-all ${activeView === 'beats' ? 'bg-white text-black' : 'text-zinc-500 hover:text-white'}`}
            >
              Beats
            </button>
            <button 
              onClick={() => onViewChange('blog')}
              className={`px-4 xl:px-6 py-2.5 rounded-2xl text-[10px] xl:text-xs font-black uppercase tracking-widest transition-all ${activeView === 'blog' ? 'bg-white text-black' : 'text-zinc-500 hover:text-white'}`}
            >
              Blog
            </button>
            {user && (
              <button 
                onClick={() => onViewChange('dashboard')}
                className={`px-4 xl:px-6 py-2.5 rounded-2xl text-[10px] xl:text-xs font-black uppercase tracking-widest transition-all ${activeView === 'dashboard' ? 'bg-white text-black' : 'text-zinc-500 hover:text-white'}`}
              >
                Studio
              </button>
            )}
            {isAdminUnlocked && (
              <button 
                onClick={() => onViewChange('admin')}
                className={`px-4 xl:px-6 py-2.5 rounded-2xl text-[10px] xl:text-xs font-black uppercase tracking-widest transition-all ${activeView === 'admin' ? 'bg-emerald-500 text-black' : 'text-emerald-500/60 hover:text-emerald-400'}`}
              >
                Admin
              </button>
            )}
          </nav>
        </div>

        <div className="flex-1 max-w-md hidden xl:block">
          <div className="relative group">
            <input 
              type="text"
              placeholder="Search..."
              onChange={(e) => onSearch(e.target.value)}
              className="w-full bg-zinc-900/50 border border-zinc-800 rounded-[1.5rem] px-6 py-4 pl-14 focus:outline-none focus:ring-2 focus:ring-indigo-600/50 text-xs font-medium transition-all group-hover:bg-zinc-900 group-hover:border-zinc-700"
            />
            <svg className="w-6 h-6 absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <div className="flex items-center gap-4 xl:gap-6">
          <button 
            onClick={onUploadClick}
            className={`hidden sm:flex text-white px-6 xl:px-8 py-4 rounded-[1.5rem] font-black text-xs hover:opacity-90 transition-all active:scale-95 shadow-2xl items-center gap-2 ${isAdminUnlocked ? 'bg-emerald-600 shadow-emerald-600/20' : 'bg-indigo-600 shadow-indigo-600/20'}`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
            <span className="hidden xl:inline">{isAdminUnlocked ? 'Admin Upload' : 'Publish Free'}</span>
            <span className="xl:hidden">Publish</span>
          </button>
          
          <button 
            onClick={onMenuClick}
            className="flex items-center gap-3 p-1.5 xl:pr-5 bg-zinc-900/50 border border-zinc-800 rounded-full hover:bg-zinc-900 transition-all group"
          >
            <div className={`w-11 h-11 rounded-full overflow-hidden border ${isAdminUnlocked ? 'border-emerald-500/50' : 'border-zinc-700'}`}>
              <img src={user?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Guest"} alt="User" className="w-full h-full object-cover" />
            </div>
            <div className="hidden md:flex flex-col items-start">
               <span className="text-[10px] font-black uppercase tracking-widest text-white">{user ? user.username : 'Account'}</span>
               <span className={`text-[8px] font-bold uppercase ${isAdminUnlocked ? 'text-emerald-500' : 'text-zinc-500'}`}>{isAdminUnlocked ? 'SYSTEM_ROOT' : (user ? 'Creator' : 'Login')}</span>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}
