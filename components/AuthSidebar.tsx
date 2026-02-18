
import React, { useState } from 'react';
import { User, Track, Artist } from '../types';

interface AuthSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onAuthAction: (action: 'login' | 'signup' | 'logout', data?: any) => void;
  allTracks?: Track[];
  artists?: Artist[];
  onTrackSelect?: (track: Track) => void;
  onLikeTrack?: (e: React.MouseEvent, id: string) => void;
  onDownloadTrack?: (e: React.MouseEvent, track: Track) => void;
  onUpdateUser?: (updated: User) => void;
  onAddArtistClick?: () => void;
  onFollowArtist?: (artistId: string) => void;
}

type SubView = 'main' | 'library' | 'history' | 'settings' | 'artists';

export default function AuthSidebar({ 
  isOpen, onClose, user, onAuthAction, allTracks = [], artists = [], onTrackSelect,
  onLikeTrack, onDownloadTrack, onAddArtistClick, onFollowArtist
}: AuthSidebarProps) {
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [subView, setSubView] = useState<SubView>('main');

  const likedTracks = allTracks.filter(t => user?.likedTrackIds.includes(t.id));
  const downloadedRecords = user?.downloadHistory.map(record => {
    const track = allTracks.find(t => t.id === record.trackId);
    return track ? { ...track, downloadedAt: record.downloadedAt } : null;
  }).filter(Boolean) as (Track & { downloadedAt: string })[];

  if (!isOpen) return null;

  const renderHeader = (title: string, subtitle: string, showBack = false) => (
    <div className="p-10 border-b border-zinc-900 flex items-center justify-between">
       <div className="flex items-center gap-6">
          {showBack && (
            <button onClick={() => setSubView('main')} className="p-3 bg-zinc-900 hover:bg-zinc-800 rounded-2xl text-zinc-400 transition-colors">
               <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
            </button>
          )}
          <div>
            <h2 className="text-4xl font-black tracking-tighter">{title}</h2>
            <p className="text-zinc-500 text-sm font-bold mt-1">{subtitle}</p>
          </div>
       </div>
       <button onClick={onClose} className="p-4 bg-zinc-900 hover:bg-zinc-800 rounded-[1.5rem] transition-colors">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
       </button>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-[#050505] border-l border-zinc-900 h-full flex flex-col animate-slide-left shadow-[0_0_100px_rgba(0,0,0,1)]">
        
        {!user ? (
          <>
            {renderHeader(authMode === 'login' ? 'Welcome Back' : 'Join buybeatz', 'Connect to the studio and start creating')}
            <div className="flex-1 overflow-y-auto p-10 space-y-12 no-scrollbar">
              <button onClick={() => onAuthAction('login', { username: 'Beat_Hunter', email: 'guest@buybeatz.com' })} className="w-full flex items-center justify-center gap-4 bg-white text-black py-5 rounded-[2rem] font-black text-lg transition-all hover:bg-zinc-200 shadow-xl">Continue with Google</button>
              <div className="flex items-center gap-4 text-zinc-800">
                <div className="flex-1 h-[2px] bg-zinc-900" />
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Or use email</span>
                <div className="flex-1 h-[2px] bg-zinc-900" />
              </div>
              <div className="space-y-6">
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-zinc-900/50 border border-zinc-800 rounded-[2rem] px-8 py-5 text-white font-bold" placeholder="Email Address" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-zinc-900/50 border border-zinc-800 rounded-[2rem] px-8 py-5 text-white font-bold" placeholder="Password" />
                <button onClick={() => onAuthAction(authMode)} className="w-full bg-indigo-600 text-white py-5 rounded-[2rem] font-black text-lg hover:bg-indigo-500 shadow-2xl">
                  {authMode === 'login' ? 'Enter Studio' : 'Create Free Account'}
                </button>
              </div>
              <div className="text-center">
                 <button onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')} className="text-sm font-bold text-zinc-500 hover:text-indigo-400">
                   {authMode === 'login' ? "Don't have an account? Join buybeatz" : "Already a member? Login"}
                 </button>
              </div>
            </div>
          </>
        ) : (
          <>
            {subView === 'main' && (
              <>
                {renderHeader('My Studio', 'Manage your buybeatz presence')}
                <div className="flex-1 overflow-y-auto p-10 space-y-12 no-scrollbar">
                   <div className="flex flex-col items-center text-center space-y-6">
                      <div className="w-32 h-32 rounded-[2.5rem] overflow-hidden border-4 border-indigo-600/20 p-1">
                         <img src={user.avatar} className="w-full h-full object-cover rounded-[2rem]" />
                      </div>
                      <div>
                        <h3 className="text-3xl font-black tracking-tight">{user.username}</h3>
                        <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs mt-1">Verified buybeatz Creator</p>
                      </div>
                   </div>
                   <div className="space-y-4">
                      <button onClick={() => setSubView('artists')} className="w-full text-left p-6 bg-zinc-900/40 rounded-[2rem] border border-zinc-800/40 flex items-center justify-between group hover:bg-zinc-900 transition-all">
                         <span className="font-black text-lg group-hover:text-indigo-400">Producer Roster</span>
                         <span className="text-xs font-black text-zinc-600">{artists.length}</span>
                      </button>
                      <button onClick={() => setSubView('library')} className="w-full text-left p-6 bg-zinc-900/40 rounded-[2rem] border border-zinc-800/40 flex items-center justify-between group hover:bg-zinc-900 transition-all">
                         <span className="font-black text-lg group-hover:text-indigo-400">The Vault</span>
                         <span className="text-xs font-black text-zinc-600">{user.likedTrackIds.length}</span>
                      </button>
                   </div>
                   <button onClick={() => onAuthAction('logout')} className="w-full flex items-center justify-center gap-4 text-rose-500 font-black py-5 rounded-[2rem] border border-rose-500/20 hover:bg-rose-500/10 transition-all">Logout Session</button>
                   <div className="pt-8 text-center text-[10px] font-black uppercase tracking-[0.3em] text-zinc-700">buybeatz Global v2.0.0</div>
                </div>
              </>
            )}
            {/* ... other subviews ... */}
          </>
        )}
      </div>
    </div>
  );
}
