
import React, { useState, useEffect, useRef } from 'react';
import { Track, Notification, BlogPost, User, Artist } from './types';
import Header from './components/Header';
import MusicCard from './components/MusicCard';
import MusicPlayer from './components/MusicPlayer';
import UploadModal from './components/UploadModal';
import AuthSidebar from './components/AuthSidebar';
import NeuralAccess from './components/NeuralAccess';

const INITIAL_TRACKS: Track[] = [
  {
    id: '1',
    title: 'Vortex',
    artistId: 'art_1',
    artistName: 'Metro Boomin Type',
    mainArtist: 'Metro Boomin Type',
    genre: 'Trap',
    bpm: 140,
    mood: 'Dark',
    coverUrl: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=400&h=400',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    description: 'Dark, atmospheric trap beat with heavy 808s.',
    tags: ['Dark', 'Hard', '808', 'beat'],
    credits: { producedBy: 'Metro Type', mixedBy: 'Studio One', writtenBy: 'Creator' },
    licenseType: 'Free',
    createdAt: new Date().toISOString(),
    likes: 1245,
    downloads: 4500
  },
  {
    id: '2',
    title: 'Neon Nights',
    artistId: 'art_2',
    artistName: 'Lofi Girl',
    mainArtist: 'Lofi Girl',
    featuredArtists: 'Summer Walker',
    genre: 'R&B',
    bpm: 90,
    mood: 'Chill',
    coverUrl: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?auto=format&fit=crop&q=80&w=400&h=400',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    description: 'Smooth R&B track with soulful vocals.',
    tags: ['Smooth', 'Vocal', 'Chill', 'song'],
    credits: { producedBy: 'Lofi Girl', mixedBy: 'Engine Room', writtenBy: 'S. Walker' },
    licenseType: 'Standard',
    createdAt: new Date().toISOString(),
    likes: 850,
    downloads: 1200
  }
];

export type ViewType = 'explore' | 'songs' | 'beats' | 'blog' | 'dashboard' | 'admin';

export default function App() {
  const [tracks, setTracks] = useState<Track[]>(() => {
    const saved = localStorage.getItem('buybeatz_tracks');
    return saved ? JSON.parse(saved) : INITIAL_TRACKS;
  });
  const [artists, setArtists] = useState<Artist[]>(() => {
    const saved = localStorage.getItem('buybeatz_artists');
    return saved ? JSON.parse(saved) : [];
  });
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('buybeatz_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(() => {
    return localStorage.getItem('buybeatz_admin_unlocked') === 'true';
  });
  
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isNeuralAccessOpen, setIsNeuralAccessOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeView, setActiveView] = useState<ViewType>('explore');
  const [isAddingArtist, setIsAddingArtist] = useState(false);
  const [selectedDashboardArtist, setSelectedDashboardArtist] = useState<string | 'all'>('all');
  const [holdProgress, setHoldProgress] = useState(0);

  const holdTimer = useRef<number | null>(null);
  const progressInterval = useRef<number | null>(null);

  const handleLogoHoldStart = () => {
    if (holdTimer.current) window.clearTimeout(holdTimer.current);
    if (progressInterval.current) window.clearInterval(progressInterval.current);
    
    setHoldProgress(0);
    const startTime = Date.now();
    
    progressInterval.current = window.setInterval(() => {
      const elapsed = Date.now() - startTime;
      // UI feedback extended to 10 seconds (10000ms)
      setHoldProgress(Math.min((elapsed / 10000) * 100, 100));
    }, 50);

    holdTimer.current = window.setTimeout(() => {
      setIsNeuralAccessOpen(true);
      if (progressInterval.current) window.clearInterval(progressInterval.current);
      setHoldProgress(0);
      holdTimer.current = null;
    }, 10000); // Trigger after 10 seconds of continuous hold
  };

  const handleLogoHoldEnd = () => {
    if (holdTimer.current) {
      window.clearTimeout(holdTimer.current);
      holdTimer.current = null;
    }
    if (progressInterval.current) {
      window.clearInterval(progressInterval.current);
      progressInterval.current = null;
    }
    setHoldProgress(0);
  };

  const handleNeuralAccess = (key: string) => {
    if (key === 'BUYBEATZ_ADMIN_ROOT') {
      setIsAdminUnlocked(true);
      localStorage.setItem('buybeatz_admin_unlocked', 'true');
      addNotification("God Mode Unlocked. Accessing Root...", "success");
      setActiveView('admin');
      setIsNeuralAccessOpen(false);
    } else {
      addNotification("Access Denied. Identity Logged.", "error");
    }
  };

  useEffect(() => {
    let title = 'buybeatz | Premium Beat Marketplace';
    if (activeView === 'admin') title = 'ADMIN_ROOT | buybeatz System';
    else if (currentTrack) title = `Playing ${currentTrack.title} by ${currentTrack.artistName} | buybeatz`;
    else {
      switch (activeView) {
        case 'songs': title = 'Explore Premium Vocal Songs | buybeatz'; break;
        case 'beats': title = 'High-Quality Instrumentals & Beats | buybeatz'; break;
        case 'dashboard': title = 'Studio HQ | buybeatz'; break;
      }
    }
    document.title = title;
  }, [activeView, currentTrack]);

  useEffect(() => { localStorage.setItem('buybeatz_tracks', JSON.stringify(tracks)); }, [tracks]);
  useEffect(() => { localStorage.setItem('buybeatz_artists', JSON.stringify(artists)); }, [artists]);
  useEffect(() => { localStorage.setItem('buybeatz_user', JSON.stringify(user)); }, [user]);

  const addNotification = (message: string, type: 'success' | 'info' | 'error' = 'info') => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => { setNotifications(prev => prev.filter(n => n.id !== id)); }, 3000);
  };

  const handleDownload = (e: React.MouseEvent, track: Track) => {
    e.stopPropagation();
    const link = document.createElement('a');
    link.href = track.audioUrl;
    link.download = `${track.artistName} - ${track.title}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTracks(prev => prev.map(t => t.id === track.id ? { ...t, downloads: t.downloads + 1 } : t));
    if (user) {
      const historyEntry = { trackId: track.id, downloadedAt: new Date().toISOString() };
      setUser({ ...user, downloadHistory: [historyEntry, ...user.downloadHistory] });
    }
    addNotification(`Master Downloaded: ${track.title}`, 'success');
  };

  const handleLike = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!user) { setIsAuthOpen(true); return; }
    const isLiked = user.likedTrackIds.includes(id);
    const newLikedIds = isLiked ? user.likedTrackIds.filter(lid => lid !== id) : [id, ...user.likedTrackIds];
    setUser({ ...user, likedTrackIds: newLikedIds });
    setTracks(prev => prev.map(t => t.id === id ? { ...t, isLiked: !isLiked, likes: t.likes + (isLiked ? -1 : 1) } : t));
  };

  const handleAddArtist = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newArtist: Artist = {
      id: 'art_' + Date.now(),
      name: formData.get('name') as string,
      legalName: formData.get('legalName') as string,
      bio: formData.get('bio') as string,
      genre: formData.get('genre') as string,
      profileImageUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${formData.get('name')}`,
      socials: {},
      createdAt: new Date().toISOString()
    };
    setArtists([...artists, newArtist]);
    setIsAddingArtist(false);
    addNotification(`${newArtist.name} registered to your studio!`, 'success');
  };

  const handleAuthAction = (action: 'login' | 'signup' | 'logout', userData?: any) => {
    if (action === 'logout') {
      setUser(null);
      setIsAuthOpen(false);
      setActiveView('explore');
    } else {
      setUser({
        id: 'user_123',
        username: userData?.username || 'Studio_Manager',
        email: userData?.email || 'mgmt@buybeatz.com',
        avatar: userData?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=buybeatz',
        role: 'producer',
        isVerified: true,
        followingIds: [],
        likedTrackIds: [],
        downloadHistory: [],
        followerCount: 3420
      });
      setIsAuthOpen(false);
    }
  };

  const currentDisplayTracks = tracks.filter(t => {
    if (activeView === 'songs') return t.featuredArtists || t.tags.includes('song');
    if (activeView === 'beats') return !t.featuredArtists || t.tags.includes('beat');
    return true;
  }).filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.artistName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const dashboardTracks = selectedDashboardArtist === 'all' 
    ? tracks 
    : tracks.filter(t => t.artistId === selectedDashboardArtist);

  return (
    <div className="min-h-screen flex flex-col bg-[#050505] pb-32 text-white overflow-x-hidden">
      <Header 
        onUploadClick={() => user ? setIsUploadOpen(true) : setIsAuthOpen(true)} 
        onSearch={setSearchQuery} onMenuClick={() => setIsAuthOpen(true)}
        onViewChange={setActiveView} activeView={activeView} user={user}
        isAdminUnlocked={isAdminUnlocked} 
        onLogoHoldStart={handleLogoHoldStart}
        onLogoHoldEnd={handleLogoHoldEnd}
        holdProgress={holdProgress}
      />
      
      <AuthSidebar 
        isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} 
        user={user} onAuthAction={handleAuthAction} 
        allTracks={tracks} artists={artists}
        onTrackSelect={(t) => { setCurrentTrack(t); setIsPlaying(true); }}
        onLikeTrack={handleLike} onDownloadTrack={handleDownload}
        onUpdateUser={(updated) => setUser(updated)}
        onAddArtistClick={() => { setIsAuthOpen(false); setIsAddingArtist(true); }}
      />

      <div className="fixed top-24 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
        {notifications.map(n => (
          <div key={n.id} className="px-6 py-4 rounded-2xl shadow-2xl animate-slide-in pointer-events-auto bg-indigo-500/10 border border-indigo-500/20 backdrop-blur-xl text-indigo-400 font-bold text-sm">
            {n.message}
          </div>
        ))}
      </div>

      <main className="flex-1 container mx-auto px-4 md:px-8 py-8">
        {activeView === 'admin' && isAdminUnlocked && (
          <div className="animate-fade-in py-12 space-y-16">
             <header className="space-y-4 border-l-4 border-emerald-500 pl-8">
                <div className="flex items-center gap-4">
                   <div className="w-4 h-4 bg-emerald-500 rounded-full animate-pulse" />
                   <h1 className="text-6xl font-black tracking-tighter text-emerald-500 uppercase">System Root Access</h1>
                </div>
                <p className="text-zinc-500 font-mono text-xl tracking-tight">Global Administrative Management Protocol active.</p>
             </header>

             <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {[
                  { label: 'Total Inventory', val: tracks.length, unit: 'Tracks' },
                  { label: 'Platform Usage', val: tracks.reduce((acc, t) => acc + t.downloads, 0), unit: 'Downloads' },
                  { label: 'Verified Roster', val: artists.length, unit: 'artist/producers' },
                  { label: 'Global Engagement', val: tracks.reduce((acc, t) => acc + t.likes, 0), unit: 'Total Likes' },
                ].map((stat, i) => (
                  <div key={i} className="bg-emerald-500/5 border border-emerald-500/20 p-8 rounded-[2.5rem] space-y-2">
                     <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500/60">{stat.label}</p>
                     <p className="text-5xl font-black tracking-tighter text-emerald-400">{stat.val.toLocaleString()}</p>
                     <p className="text-[9px] font-bold text-zinc-600 uppercase">{stat.unit}</p>
                  </div>
                ))}
             </div>

             <section className="space-y-8">
                <div className="flex items-center justify-between border-b border-zinc-900 pb-6">
                   <h2 className="text-3xl font-black tracking-tighter uppercase text-emerald-500/80">Global Track Inventory</h2>
                   <div className="flex gap-4">
                      <button className="px-6 py-3 bg-emerald-500 text-black font-black rounded-2xl text-[10px] uppercase tracking-widest hover:bg-emerald-400 transition-colors">Export DB</button>
                      <button className="px-6 py-3 bg-zinc-900 text-emerald-500 border border-emerald-500/30 font-black rounded-2xl text-[10px] uppercase tracking-widest">Wipe Test Data</button>
                   </div>
                </div>
                
                <div className="overflow-hidden border border-zinc-900 rounded-[3rem] bg-zinc-950">
                   <table className="w-full text-left font-mono text-sm">
                      <thead>
                        <tr className="bg-zinc-900/50 border-b border-zinc-900">
                          <th className="px-8 py-5 text-[10px] font-black uppercase text-zinc-500">ID</th>
                          <th className="px-8 py-5 text-[10px] font-black uppercase text-zinc-500">Track Info</th>
                          <th className="px-8 py-5 text-[10px] font-black uppercase text-zinc-500">Analytics</th>
                          <th className="px-8 py-5 text-[10px] font-black uppercase text-zinc-500">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-900">
                        {tracks.map(t => (
                          <tr key={t.id} className="hover:bg-emerald-500/5 transition-colors">
                             <td className="px-8 py-6 text-zinc-700">#{t.id}</td>
                             <td className="px-8 py-6">
                                <div className="flex items-center gap-4">
                                   <img src={t.coverUrl} className="w-12 h-12 rounded-xl object-cover grayscale" />
                                   <div>
                                      <p className="font-black text-emerald-500">{t.title}</p>
                                      <p className="text-[10px] text-zinc-500">{t.artistName}</p>
                                   </div>
                                </div>
                             </td>
                             <td className="px-8 py-6">
                                <div className="flex gap-4">
                                   <span className="text-zinc-400">{t.downloads} DL</span>
                                   <span className="text-zinc-600">|</span>
                                   <span className="text-zinc-400">{t.likes} LIKES</span>
                                </div>
                             </td>
                             <td className="px-8 py-6">
                                <button 
                                  onClick={() => setTracks(prev => prev.filter(track => track.id !== t.id))}
                                  className="text-rose-500 font-black uppercase text-[10px] tracking-widest hover:underline"
                                >
                                  Remove
                                </button>
                             </td>
                          </tr>
                        ))}
                      </tbody>
                   </table>
                </div>
             </section>

             <div className="p-12 border-2 border-dashed border-emerald-500/20 rounded-[4rem] text-center space-y-4">
                <p className="text-zinc-600 font-mono text-xs uppercase tracking-widest">Security Clearance: LEVEL 10 (OMEGA)</p>
                <button 
                   onClick={() => { setIsAdminUnlocked(false); localStorage.removeItem('buybeatz_admin_unlocked'); setActiveView('explore'); }}
                   className="text-emerald-500 hover:text-white transition-colors font-black text-sm uppercase tracking-[0.5em]"
                >
                   Close Session & Lock Access
                </button>
             </div>
          </div>
        )}

        {(activeView === 'explore' || activeView === 'songs' || activeView === 'beats') && (
          <div className="space-y-16 animate-fade-in">
             <section className="relative h-[300px] rounded-[3rem] overflow-hidden flex items-center px-16 border border-zinc-900">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/40 to-transparent" />
                <div className="relative z-10">
                   <h2 className="text-6xl font-black tracking-tighter mb-4 capitalize">
                     {activeView === 'explore' ? 'Discovery Board' : activeView}
                   </h2>
                   <p className="text-zinc-400 text-xl font-medium">
                     {activeView === 'songs' ? 'Vocal-driven tracks and full song compositions.' : 
                      activeView === 'beats' ? 'Pure instrumentals for your next recording session.' : 
                      'Explore fresh tracks from our verified production roster.'}
                   </p>
                </div>
             </section>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {currentDisplayTracks.map(t => (
                <MusicCard 
                  key={t.id} track={t} 
                  onSelect={() => { setCurrentTrack(t); setIsPlaying(true); }}
                  onDownload={handleDownload} onLike={handleLike}
                  isActive={currentTrack?.id === t.id} isPlaying={currentTrack?.id === t.id && isPlaying}
                />
              ))}
            </div>
          </div>
        )}

        {activeView === 'dashboard' && (
          <div className="py-8 animate-fade-in space-y-12">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-12 border-b border-zinc-900">
               <div className="space-y-2">
                  <h1 className="text-7xl font-black tracking-tighter">Studio HQ</h1>
                  <p className="text-zinc-500 text-xl font-medium">Manage production profiles and track-level metadata.</p>
               </div>
               <div className="flex gap-4">
                  <button onClick={() => setIsAddingArtist(true)} className="bg-zinc-900 border border-zinc-800 text-white px-8 py-4 rounded-[1.5rem] font-black hover:bg-zinc-800 transition-all">
                    Register Profile
                  </button>
                  <button onClick={() => setIsUploadOpen(true)} className="bg-indigo-600 text-white px-10 py-5 rounded-[2rem] font-black hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20">
                    Upload Production
                  </button>
               </div>
            </header>

            <section className="space-y-8">
               <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-black tracking-tighter">Production Roster</h2>
                  <div className="flex gap-2">
                     <button onClick={() => setSelectedDashboardArtist('all')} className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${selectedDashboardArtist === 'all' ? 'bg-indigo-600 text-white' : 'bg-zinc-900 text-zinc-500'}`}>All Tracks</button>
                     {artists.map(art => (
                        <button key={art.id} onClick={() => setSelectedDashboardArtist(art.id)} className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${selectedDashboardArtist === art.id ? 'bg-indigo-600 text-white' : 'bg-zinc-900 text-zinc-500'}`}>{art.name}</button>
                     ))}
                  </div>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {artists.map(art => (
                    <div key={art.id} onClick={() => setSelectedDashboardArtist(art.id)} className={`bg-zinc-900/20 border p-8 rounded-[3rem] transition-all cursor-pointer ${selectedDashboardArtist === art.id ? 'border-indigo-600 bg-indigo-600/5' : 'border-zinc-800/40 hover:border-zinc-600'}`}>
                       <div className="flex items-center gap-6">
                          <img src={art.profileImageUrl} className="w-20 h-20 rounded-2xl object-cover" />
                          <div>
                             <h4 className="font-black text-2xl tracking-tighter">{art.name}</h4>
                             <p className="text-indigo-400 text-[10px] font-black uppercase tracking-widest">{art.genre}</p>
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
            </section>

            <section className="space-y-8">
               <h2 className="text-3xl font-black tracking-tighter">Production Inventory</h2>
               <div className="bg-zinc-900/20 border border-zinc-900 rounded-[3rem] overflow-hidden">
                  <div className="divide-y divide-zinc-900">
                     {dashboardTracks.map(t => (
                       <div key={t.id} className="p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-8 hover:bg-zinc-900/40 transition-all group">
                          <div className="flex items-center gap-6">
                             <img src={t.coverUrl} className="w-20 h-20 rounded-2xl object-cover" />
                             <div className="cursor-pointer" onClick={() => { setCurrentTrack(t); setIsPlaying(true); }}>
                                <h4 className="font-black text-2xl tracking-tighter group-hover:text-indigo-400 transition-colors">{t.title}</h4>
                                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mt-1">{t.genre} • {t.bpm} BPM</p>
                             </div>
                          </div>
                          <div className="flex gap-4">
                             <button onClick={(e) => handleDownload(e, t)} className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl hover:text-indigo-400 transition-all"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg></button>
                             <button onClick={() => setTracks(prev => prev.filter(track => track.id !== t.id))} className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl hover:text-rose-500 transition-all"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                          </div>
                       </div>
                     ))}
                  </div>
               </div>
            </section>
          </div>
        )}
      </main>

      {isAddingArtist && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setIsAddingArtist(false)} />
           <div className="relative bg-[#050505] border border-zinc-800 rounded-[4rem] w-full max-w-2xl p-12 lg:p-16">
              <h2 className="text-4xl font-black tracking-tighter mb-8 text-center">Register Producer Profile</h2>
              <form onSubmit={handleAddArtist} className="space-y-6">
                 <input name="name" required className="w-full bg-zinc-900 border border-zinc-800 rounded-3xl px-8 py-5 text-xl font-bold focus:ring-2 ring-indigo-500 outline-none" placeholder="Producer Name" />
                 <input name="genre" required className="w-full bg-zinc-900 border border-zinc-800 rounded-3xl px-8 py-5 text-xl font-bold focus:ring-2 ring-indigo-500 outline-none" placeholder="Primary Genre" />
                 <textarea name="bio" required className="w-full bg-zinc-900 border border-zinc-800 rounded-3xl px-8 py-5 text-xl font-bold focus:ring-2 ring-indigo-500 outline-none h-32" placeholder="Bio..." />
                 <button type="submit" className="w-full bg-indigo-600 py-6 rounded-3xl font-black text-xl hover:bg-indigo-500 transition-all shadow-2xl">Confirm Profile</button>
              </form>
           </div>
        </div>
      )}

      {isNeuralAccessOpen && (
        <NeuralAccess 
          onClose={() => setIsNeuralAccessOpen(false)}
          onSubmit={handleNeuralAccess}
        />
      )}

      {isUploadOpen && <UploadModal onClose={() => setIsUploadOpen(false)} user={user} managedArtists={artists} onUpload={(t) => { setTracks([t, ...tracks]); setIsUploadOpen(false); addNotification('Master Uploaded Successfully', 'success'); }} />}
      <MusicPlayer track={currentTrack} isPlaying={isPlaying} onPlayPause={() => setIsPlaying(!isPlaying)} onNext={() => {}} onPrev={() => {}} onDownload={handleDownload} />
    </div>
  );
}
