
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
}

type SubView = 'main' | 'library' | 'history' | 'settings' | 'artists';

export default function AuthSidebar({ 
  isOpen, 
  onClose, 
  user, 
  onAuthAction, 
  allTracks = [], 
  artists = [],
  onTrackSelect,
  onLikeTrack,
  onDownloadTrack,
  onUpdateUser,
  onAddArtistClick
}: AuthSidebarProps) {
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [subView, setSubView] = useState<SubView>('main');

  // Library & History Data
  const likedTracks = allTracks.filter(t => user?.likedTrackIds.includes(t.id));
  
  // Join downloadHistory with track data
  const downloadedRecords = user?.downloadHistory.map(record => {
    const track = allTracks.find(t => t.id === record.trackId);
    return track ? { ...track, downloadedAt: record.downloadedAt } : null;
  }).filter(Boolean) as (Track & { downloadedAt: string })[];

  if (!isOpen) return null;

  const formatDate = (isoString: string) => {
    return new Intl.DateTimeFormat('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    }).format(new Date(isoString));
  };

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
            {renderHeader(authMode === 'login' ? 'Welcome Back' : 'Join the Movement', 'Connect and start downloading for free')}
            <div className="flex-1 overflow-y-auto p-10 space-y-12 no-scrollbar">
              <button 
                onClick={() => onAuthAction('login', { username: 'Google_User', email: 'google@gmail.com' })}
                className="w-full flex items-center justify-center gap-4 bg-white text-black py-5 rounded-[2rem] font-black text-lg transition-all hover:bg-zinc-200 shadow-xl"
              >
                Continue with Google
              </button>
              <div className="flex items-center gap-4 text-zinc-800">
                <div className="flex-1 h-[2px] bg-zinc-900" />
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Or use email</span>
                <div className="flex-1 h-[2px] bg-zinc-900" />
              </div>
              <div className="space-y-6">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-900/50 border border-zinc-800 rounded-[2rem] px-8 py-5 focus:outline-none focus:ring-2 focus:ring-indigo-600/50 text-white font-bold"
                  placeholder="Email Address"
                />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-zinc-900/50 border border-zinc-800 rounded-[2rem] px-8 py-5 focus:outline-none focus:ring-2 focus:ring-indigo-600/50 text-white font-bold"
                  placeholder="Password"
                />
                <button 
                  onClick={() => onAuthAction(authMode)}
                  className="w-full bg-indigo-600 text-white py-5 rounded-[2rem] font-black text-lg transition-all hover:bg-indigo-500 shadow-2xl shadow-indigo-600/20"
                >
                  {authMode === 'login' ? 'Login to Studio' : 'Create Free Account'}
                </button>
              </div>
              <div className="text-center">
                 <button onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')} className="text-sm font-bold text-zinc-500 hover:text-indigo-400">
                   {authMode === 'login' ? "Don't have an account? Sign Up" : "Already have an account? Login"}
                 </button>
              </div>
            </div>
          </>
        ) : (
          <>
            {subView === 'main' && (
              <>
                {renderHeader('My Profile', 'Manage your global beats')}
                <div className="flex-1 overflow-y-auto p-10 space-y-12 no-scrollbar">
                   <div className="flex flex-col items-center text-center space-y-6">
                      <div className="relative">
                        <div className="w-32 h-32 rounded-[2.5rem] overflow-hidden border-4 border-indigo-600/20 p-1">
                           <img src={user.avatar} className="w-full h-full object-cover rounded-[2rem]" />
                        </div>
                        {user.isVerified && (
                          <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-indigo-600 rounded-full border-4 border-[#050505] flex items-center justify-center">
                             <span className="text-white text-xs">✓</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="text-3xl font-black tracking-tight">{user.username}</h3>
                        <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs mt-1">Verified Music Creator</p>
                      </div>
                   </div>

                   <div className="space-y-4">
                      <button onClick={() => setSubView('artists')} className="w-full text-left p-6 bg-zinc-900/40 rounded-[2rem] border border-zinc-800/40 flex items-center justify-between group hover:bg-zinc-900 transition-all">
                         <div className="flex items-center gap-4">
                            <div className="p-3 bg-zinc-800 rounded-xl group-hover:bg-indigo-600/20 transition-colors">
                               <svg className="w-6 h-6 text-zinc-500 group-hover:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                            </div>
                            <span className="font-black text-lg group-hover:text-indigo-400 transition-colors">Artist Roster</span>
                         </div>
                         <div className="flex items-center gap-3">
                            <span className="text-xs font-black text-zinc-600">{artists.length}</span>
                            <svg className="w-6 h-6 text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                         </div>
                      </button>
                      <button onClick={() => setSubView('library')} className="w-full text-left p-6 bg-zinc-900/40 rounded-[2rem] border border-zinc-800/40 flex items-center justify-between group hover:bg-zinc-900 transition-all">
                         <div className="flex items-center gap-4">
                            <div className="p-3 bg-zinc-800 rounded-xl group-hover:bg-indigo-600/20 transition-colors">
                               <svg className="w-6 h-6 text-zinc-500 group-hover:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                            </div>
                            <span className="font-black text-lg group-hover:text-indigo-400 transition-colors">My Library</span>
                         </div>
                         <div className="flex items-center gap-3">
                            <span className="text-xs font-black text-zinc-600">{user.likedTrackIds.length}</span>
                            <svg className="w-6 h-6 text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                         </div>
                      </button>
                      <button onClick={() => setSubView('history')} className="w-full text-left p-6 bg-zinc-900/40 rounded-[2rem] border border-zinc-800/40 flex items-center justify-between group hover:bg-zinc-900 transition-all">
                         <div className="flex items-center gap-4">
                            <div className="p-3 bg-zinc-800 rounded-xl group-hover:bg-indigo-600/20 transition-colors">
                               <svg className="w-6 h-6 text-zinc-500 group-hover:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                            </div>
                            <span className="font-black text-lg group-hover:text-indigo-400 transition-colors">Downloads History</span>
                         </div>
                         <div className="flex items-center gap-3">
                            <span className="text-xs font-black text-zinc-600">{user.downloadHistory.length}</span>
                            <svg className="w-6 h-6 text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                         </div>
                      </button>
                      <button onClick={() => setSubView('settings')} className="w-full text-left p-6 bg-zinc-900/40 rounded-[2rem] border border-zinc-800/40 flex items-center justify-between group hover:bg-zinc-900 transition-all">
                         <div className="flex items-center gap-4">
                            <div className="p-3 bg-zinc-800 rounded-xl group-hover:bg-indigo-600/20 transition-colors">
                               <svg className="w-6 h-6 text-zinc-500 group-hover:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            </div>
                            <span className="font-black text-lg group-hover:text-indigo-400 transition-colors">Account Settings</span>
                         </div>
                         <svg className="w-6 h-6 text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                      </button>
                   </div>

                   <button onClick={() => onAuthAction('logout')} className="w-full flex items-center justify-center gap-4 text-rose-500 font-black py-5 rounded-[2rem] border border-rose-500/20 hover:bg-rose-500/10 transition-all">
                    Logout Session
                   </button>
                </div>
              </>
            )}

            {subView === 'artists' && (
              <>
                {renderHeader('Production Roster', 'Verified Studio Profiles', true)}
                <div className="flex-1 overflow-y-auto p-8 space-y-6 no-scrollbar">
                   <div className="flex items-center justify-between mb-4">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Active Profiles ({artists.length})</h4>
                      <button onClick={onAddArtistClick} className="text-[10px] font-black text-indigo-400 hover:underline">+ New Profile</button>
                   </div>
                   {artists.length === 0 ? (
                     <div className="py-20 text-center border-2 border-dashed border-zinc-900 rounded-[2.5rem]">
                        <p className="text-zinc-600 font-bold">No producer profiles registered.</p>
                        <button onClick={onAddArtistClick} className="mt-4 text-xs font-black text-white bg-indigo-600 px-6 py-3 rounded-xl">Register First Artist</button>
                     </div>
                   ) : (
                     <div className="space-y-4">
                        {artists.map(art => (
                           <div key={art.id} className="flex items-center justify-between p-5 bg-zinc-900/30 border border-zinc-800/40 rounded-[2rem] hover:bg-zinc-800/50 transition-all group">
                              <div className="flex items-center gap-5">
                                 <img src={art.profileImageUrl} className="w-14 h-14 rounded-2xl object-cover shadow-lg" />
                                 <div>
                                    <h5 className="font-black text-lg tracking-tighter">{art.name}</h5>
                                    <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">{art.genre}</p>
                                 </div>
                              </div>
                              <div className="flex flex-col items-end">
                                 <span className="text-[10px] font-black text-indigo-400">{allTracks.filter(t => t.artistId === art.id).length} Tracks</span>
                                 <button className="mt-1 text-[8px] font-black uppercase tracking-widest text-zinc-600 hover:text-white transition-colors">Edit Profile</button>
                              </div>
                           </div>
                        ))}
                     </div>
                   )}
                </div>
              </>
            )}

            {subView === 'library' && (
              <>
                {renderHeader('The Vault', 'Saved & Liked Productions', true)}
                <div className="flex-1 overflow-y-auto p-8 space-y-6 no-scrollbar">
                   <div className="flex items-center justify-between mb-4">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Liked Tracks ({likedTracks.length})</h4>
                      <button className="text-[10px] font-black text-indigo-400 hover:underline">Play All</button>
                   </div>
                   {likedTracks.length === 0 ? (
                     <div className="py-20 text-center border-2 border-dashed border-zinc-900 rounded-[2.5rem]">
                        <p className="text-zinc-600 font-bold">No saved tracks in your vault.</p>
                     </div>
                   ) : (
                     <div className="space-y-3">
                        {likedTracks.map(t => (
                           <div key={t.id} onClick={() => onTrackSelect?.(t)} className="flex items-center justify-between p-4 bg-zinc-900/30 border border-zinc-800/40 rounded-2xl hover:bg-zinc-800/50 transition-all group cursor-pointer">
                              <div className="flex items-center gap-4">
                                 <img src={t.coverUrl} className="w-12 h-12 rounded-lg object-cover" />
                                 <div className="max-w-[160px]">
                                    <h5 className="font-black text-sm truncate">{t.title}</h5>
                                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter truncate">{t.artistName}</p>
                                 </div>
                              </div>
                              <button onClick={(e) => onLikeTrack?.(e, t.id)} className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg">
                                 <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                              </button>
                           </div>
                        ))}
                     </div>
                   )}
                </div>
              </>
            )}

            {subView === 'history' && (
              <>
                {renderHeader('Distribution Log', 'Previous Master Downloads', true)}
                <div className="flex-1 overflow-y-auto p-8 space-y-6 no-scrollbar">
                   <div className="flex items-center justify-between mb-4">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Recently Downloaded ({downloadedRecords.length})</h4>
                      <button className="text-[10px] font-black text-zinc-400 hover:text-white transition-colors">Export CSV</button>
                   </div>
                   {downloadedRecords.length === 0 ? (
                     <div className="py-20 text-center border-2 border-dashed border-zinc-900 rounded-[2.5rem]">
                        <p className="text-zinc-600 font-bold">No download history found.</p>
                     </div>
                   ) : (
                     <div className="space-y-4">
                        {downloadedRecords.map((t, idx) => (
                           <div key={`${t.id}-${idx}`} className="flex items-center justify-between p-4 bg-zinc-900/30 border border-zinc-800/40 rounded-2xl hover:bg-zinc-800/50 transition-all group">
                              <div className="flex items-center gap-4">
                                 <div className="relative">
                                    <img src={t.coverUrl} className="w-12 h-12 rounded-lg object-cover opacity-60" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                       <svg className="w-5 h-5 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                    </div>
                                 </div>
                                 <div className="min-w-0">
                                    <h5 className="font-black text-sm truncate text-white">{t.title}</h5>
                                    <div className="flex flex-col gap-0.5">
                                       <div className="flex items-center gap-2">
                                          <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">{t.licenseType} LICENSE</p>
                                          <span className="w-1 h-1 bg-zinc-800 rounded-full" />
                                          <p className="text-[8px] font-mono text-zinc-600 tracking-tighter">ID: {t.id}</p>
                                       </div>
                                       <p className="text-[8px] font-bold text-zinc-500 uppercase tracking-tighter">Acquired: {formatDate(t.downloadedAt)}</p>
                                    </div>
                                 </div>
                              </div>
                              <button onClick={(e) => onDownloadTrack?.(e, t)} className="shrink-0 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all">Restore</button>
                           </div>
                        ))}
                     </div>
                   )}
                   <div className="mt-8 p-6 bg-indigo-600/5 border border-indigo-600/10 rounded-2xl text-center">
                      <p className="text-[10px] font-bold text-zinc-400">Total Studio Data Consumed</p>
                      <p className="text-2xl font-black text-indigo-400 mt-1">{(downloadedRecords.length * 45).toFixed(1)} MB</p>
                   </div>
                </div>
              </>
            )}

            {subView === 'settings' && (
              <>
                {renderHeader('Account HQ', 'Manage Creator Identity', true)}
                <div className="flex-1 overflow-y-auto p-8 space-y-10 no-scrollbar">
                   <div className="space-y-6">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Identity Details</h4>
                      <div className="space-y-4">
                         <div className="space-y-2">
                            <label className="text-[10px] font-bold text-zinc-600 ml-3 uppercase">Display Name</label>
                            <input 
                              defaultValue={user.username} 
                              onChange={(e) => onUpdateUser?.({ ...user, username: e.target.value })}
                              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4 font-bold outline-none focus:border-indigo-500" 
                            />
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-bold text-zinc-600 ml-3 uppercase">Avatar Seed</label>
                            <div className="flex gap-4">
                               <input 
                                 placeholder="Type anything to change look"
                                 onChange={(e) => onUpdateUser?.({ ...user, avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${e.target.value || 'buybeatz'}` })}
                                 className="flex-1 bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4 font-bold outline-none focus:border-indigo-500" 
                               />
                               <div className="w-14 h-14 bg-zinc-900 rounded-2xl flex-shrink-0 border border-zinc-800">
                                  <img src={user.avatar} className="w-full h-full object-contain" />
                               </div>
                            </div>
                         </div>
                      </div>
                   </div>

                   <div className="space-y-6">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Professional Status</h4>
                      <div className="flex items-center justify-between p-6 bg-zinc-900/30 border border-zinc-800/40 rounded-[2rem]">
                         <div>
                            <p className="font-black text-lg">Verified Artist</p>
                            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Global checkmark visible</p>
                         </div>
                         <div className="w-12 h-6 bg-indigo-600 rounded-full flex items-center px-1">
                            <div className="w-4 h-4 bg-white rounded-full ml-auto shadow-md" />
                         </div>
                      </div>
                   </div>

                   <div className="space-y-4 pt-10">
                      <button className="w-full bg-indigo-600 py-5 rounded-[2rem] font-black hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20">
                         Save Updated Profile
                      </button>
                      <button className="w-full text-rose-500/50 hover:text-rose-500 text-[10px] font-black uppercase tracking-widest transition-colors py-4">
                         Delete Identity Permanent
                      </button>
                   </div>
                </div>
              </>
            )}
          </>
        )}

        <div className="p-10 text-center border-t border-zinc-900">
           <p className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.4em]">Powered by buybeatz Global</p>
        </div>
      </div>
    </div>
  );
}
