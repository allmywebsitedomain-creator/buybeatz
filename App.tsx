
import React, { useState, useEffect, useRef } from 'react';
import { Track, Notification, User, Artist } from './types';
import Header from './components/Header';
import MusicCard from './components/MusicCard';
import MusicPlayer from './components/MusicPlayer';
import UploadModal from './components/UploadModal';
import AuthSidebar from './components/AuthSidebar';
import NeuralAccess from './components/NeuralAccess';
import { supabase } from './lib/supabase';

export type ViewType = 'explore' | 'songs' | 'beats' | 'blog' | 'dashboard' | 'admin';

const mapTrack = (t: any): Track => ({
  id: t.id,
  title: t.title,
  artistId: t.artist_id || t.artistId,
  artistName: t.artist_name || t.artistName,
  mainArtist: t.main_artist || t.mainArtist,
  featuredArtists: t.featured_artists || t.featuredArtists,
  genre: t.genre,
  bpm: t.bpm,
  mood: t.mood,
  coverUrl: t.cover_url || t.coverUrl,
  audioUrl: t.audio_url || t.audioUrl,
  description: t.description,
  tags: t.tags || [],
  credits: t.credits || { producedBy: t.artist_name || t.artistName },
  licenseType: t.license_type || t.licenseType,
  createdAt: t.created_at || t.createdAt,
  likes: t.likes || 0,
  downloads: t.downloads || 0,
  isLiked: false
});

const mapArtist = (a: any): Artist => ({
  id: a.id,
  name: a.name,
  bio: a.bio,
  genre: a.genre,
  profileImageUrl: a.profile_image_url || a.profileImageUrl,
  socials: a.socials || {},
  createdAt: a.created_at || a.createdAt
});

export default function App() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('buybeatz_user');
      if (!saved) return null;
      const parsed = JSON.parse(saved);
      return {
        ...parsed,
        likedTrackIds: parsed.likedTrackIds || [],
        followingArtistIds: parsed.followingArtistIds || [],
        downloadHistory: parsed.downloadHistory || []
      };
    } catch (e) { return null; }
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
  const [holdProgress, setHoldProgress] = useState(0);

  const holdTimer = useRef<number | null>(null);
  const progressInterval = useRef<number | null>(null);

  useEffect(() => {
    let title = 'buybeatz | Premium Beats';
    if (isPlaying && currentTrack) {
      title = `▶ Playing: ${currentTrack.title} - buybeatz`;
    } else {
      switch (activeView) {
        case 'explore': title = 'Explore New Production | buybeatz'; break;
        case 'blog': title = 'Music Production Blog | buybeatz'; break;
        case 'dashboard': title = 'Creator Studio | buybeatz'; break;
        case 'admin': title = 'System Admin | buybeatz'; break;
      }
    }
    document.title = title;
  }, [activeView, isPlaying, currentTrack]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: tracksData } = await supabase.from('tracks').select('*').order('created_at', { ascending: false });
        if (tracksData) setTracks(tracksData.map(mapTrack));
        const { data: artistsData } = await supabase.from('artists').select('*');
        if (artistsData) setArtists(artistsData.map(mapArtist));
      } catch (err) { console.error("DB Error:", err); }
    };
    fetchData();
  }, []);

  const handleLogoHoldStart = () => {
    setHoldProgress(0);
    const startTime = Date.now();
    progressInterval.current = window.setInterval(() => {
      const elapsed = Date.now() - startTime;
      setHoldProgress(Math.min((elapsed / 3000) * 100, 100));
    }, 50);
    holdTimer.current = window.setTimeout(() => {
      setIsNeuralAccessOpen(true);
      if (progressInterval.current) clearInterval(progressInterval.current);
      setHoldProgress(0);
    }, 3000);
  };

  const handleLogoHoldEnd = () => {
    if (holdTimer.current) clearTimeout(holdTimer.current);
    if (progressInterval.current) clearInterval(progressInterval.current);
    setHoldProgress(0);
  };

  const handleNeuralAccess = (key: string) => {
    if (key === 'BUYBEATZ_ADMIN_ROOT') {
      setIsAdminUnlocked(true);
      localStorage.setItem('buybeatz_admin_unlocked', 'true');
      addNotification("Admin Access Granted", "success");
      setActiveView('admin');
      setIsNeuralAccessOpen(false);
    } else { addNotification("Access Denied", "error"); }
  };

  const addNotification = (message: string, type: 'success' | 'info' | 'error' = 'info') => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => { setNotifications(prev => prev.filter(n => n.id !== id)); }, 3000);
  };

  const handleDownload = async (e: React.MouseEvent, track: Track) => {
    e.stopPropagation();
    const link = document.createElement('a');
    link.href = track.audioUrl;
    link.download = `${track.artistName} - ${track.title}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    await supabase.from('tracks').update({ downloads: track.downloads + 1 }).eq('id', track.id);
    setTracks(prev => prev.map(t => t.id === track.id ? { ...t, downloads: t.downloads + 1 } : t));
    addNotification(`Downloaded: ${track.title}`, 'success');
  };

  const handleLike = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!user) { setIsAuthOpen(true); return; }
    const isLiked = (user.likedTrackIds || []).includes(id);
    const newLikedIds = isLiked ? user.likedTrackIds.filter(lid => lid !== id) : [id, ...(user.likedTrackIds || [])];
    const updatedUser = { ...user, likedTrackIds: newLikedIds };
    setUser(updatedUser);
    localStorage.setItem('buybeatz_user', JSON.stringify(updatedUser));
    const track = tracks.find(t => t.id === id);
    if (track) {
      await supabase.from('tracks').update({ likes: Math.max(0, (track.likes || 0) + (isLiked ? -1 : 1)) }).eq('id', id);
      setTracks(prev => prev.map(t => t.id === id ? { ...t, isLiked: !isLiked, likes: Math.max(0, (t.likes || 0) + (isLiked ? -1 : 1)) } : t));
    }
  };

  const handleFollowArtist = (artistId: string) => {
    if (!user) { setIsAuthOpen(true); return; }
    const isFollowing = (user.followingArtistIds || []).includes(artistId);
    const newFollowingIds = isFollowing ? user.followingArtistIds.filter(id => id !== artistId) : [...(user.followingArtistIds || []), artistId];
    const updatedUser = { ...user, followingArtistIds: newFollowingIds };
    setUser(updatedUser);
    localStorage.setItem('buybeatz_user', JSON.stringify(updatedUser));
    const artist = artists.find(a => a.id === artistId);
    addNotification(isFollowing ? `Unfollowed ${artist?.name}` : `Following ${artist?.name}`, 'success');
  };

  const handleAuthAction = (action: 'login' | 'signup' | 'logout', userData?: any) => {
    if (action === 'logout') {
      setUser(null);
      localStorage.removeItem('buybeatz_user');
      setIsAuthOpen(false);
      setActiveView('explore');
    } else {
      const newUser: User = {
        id: 'user_local',
        username: userData?.username || 'Producer_X',
        email: userData?.email || 'studio@buybeatz.com',
        avatar: userData?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData?.username || 'buybeatz'}`,
        role: 'producer',
        isVerified: true,
        followingIds: [],
        followingArtistIds: [],
        likedTrackIds: [],
        downloadHistory: [],
        followerCount: 0
      };
      setUser(newUser);
      localStorage.setItem('buybeatz_user', JSON.stringify(newUser));
      setIsAuthOpen(false);
    }
  };

  const currentDisplayTracks = tracks.filter(t => {
    if (activeView === 'songs') return t.tags.includes('song');
    if (activeView === 'beats') return t.tags.includes('beat');
    return true;
  }).filter(t => 
    (t.title || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
    (t.artistName || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#050505] pb-32 text-white overflow-x-hidden">
      <Header 
        onUploadClick={() => user ? setIsUploadOpen(true) : setIsAuthOpen(true)} 
        onSearch={setSearchQuery} onMenuClick={() => setIsAuthOpen(true)}
        onViewChange={setActiveView} activeView={activeView} user={user}
        isAdminUnlocked={isAdminUnlocked} onLogoHoldStart={handleLogoHoldStart}
        onLogoHoldEnd={handleLogoHoldEnd} holdProgress={holdProgress}
      />
      
      <AuthSidebar 
        isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} user={user} onAuthAction={handleAuthAction} 
        allTracks={tracks} artists={artists} onTrackSelect={(t) => { setCurrentTrack(t); setIsPlaying(true); }}
        onLikeTrack={handleLike} onDownloadTrack={handleDownload} onAddArtistClick={() => { setIsAuthOpen(false); setIsAddingArtist(true); }}
        onFollowArtist={handleFollowArtist}
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
          <div className="animate-fade-in py-12 space-y-12">
             <h1 className="text-5xl font-black tracking-tighter uppercase text-emerald-500">buybeatz Admin Core</h1>
             <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl">
                   <p className="text-[10px] uppercase font-black text-zinc-500 mb-2">Inventory</p>
                   <p className="text-4xl font-black">{tracks.length} Tracks</p>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl">
                   <p className="text-[10px] uppercase font-black text-zinc-500 mb-2">Total Outreach</p>
                   <p className="text-4xl font-black">{tracks.reduce((a,c)=>a+(c.downloads || 0),0)} Downloads</p>
                </div>
             </div>
             <button onClick={() => { setIsAdminUnlocked(false); localStorage.removeItem('buybeatz_admin_unlocked'); setActiveView('explore'); }} className="text-zinc-600 hover:text-white uppercase font-black text-xs tracking-widest">Logout Admin</button>
          </div>
        )}

        {activeView === 'blog' && (
          <div className="animate-fade-in py-12 space-y-24">
             <div className="max-w-3xl mx-auto text-center space-y-6">
                <h1 className="text-7xl font-black tracking-tighter">Behind the <span className="text-indigo-500 italic">Sound</span></h1>
                <p className="text-zinc-500 text-xl">Articles, tips, and production notes from the buybeatz collective.</p>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                {tracks.slice(0, 4).map((t, idx) => (
                  <article key={t.id} className="space-y-6 group cursor-pointer">
                     <div className="aspect-[16/9] bg-zinc-900 rounded-[3rem] overflow-hidden border border-zinc-800 group-hover:border-indigo-500 transition-all">
                        <img src={t.coverUrl} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                     </div>
                     <div className="space-y-2">
                        <span className="text-indigo-500 font-black text-[10px] uppercase tracking-widest">{t.genre} • PRODUCTION NOTES</span>
                        <h2 className="text-3xl font-black tracking-tighter group-hover:text-indigo-400 transition-colors">How "{t.title}" was crafted for {t.artistName}</h2>
                        <p className="text-zinc-500 line-clamp-3 leading-relaxed">{t.description}</p>
                     </div>
                  </article>
                ))}
             </div>
          </div>
        )}

        {activeView === 'dashboard' && user && (
          <div className="animate-fade-in py-12 space-y-12">
             <div className="flex items-center justify-between">
                <h1 className="text-5xl font-black tracking-tighter">Creator <span className="text-indigo-500">Studio</span></h1>
                <button onClick={() => setIsUploadOpen(true)} className="bg-white text-black px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-zinc-200 transition-all">+ New Upload</button>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-[2.5rem]">
                   <h4 className="text-[10px] uppercase font-black text-zinc-600 mb-6">Library Stats</h4>
                   <div className="flex justify-between items-end">
                      <span className="text-6xl font-black leading-none">{user.likedTrackIds.length}</span>
                      <span className="text-zinc-500 text-xs font-bold mb-1">Liked Tracks</span>
                   </div>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-[2.5rem]">
                   <h4 className="text-[10px] uppercase font-black text-zinc-600 mb-6">Acquisitions</h4>
                   <div className="flex justify-between items-end">
                      <span className="text-6xl font-black leading-none">{user.downloadHistory.length}</span>
                      <span className="text-zinc-500 text-xs font-bold mb-1">Total Downloads</span>
                   </div>
                </div>
             </div>
             <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-[3rem] p-12">
                <h3 className="text-2xl font-black mb-8">Recent Activity</h3>
                <div className="space-y-4">
                   {user.downloadHistory.length === 0 ? (
                      <p className="text-zinc-600 italic">No recent activity found.</p>
                   ) : (
                      user.downloadHistory.slice(0, 5).map((h, i) => (
                         <div key={i} className="flex items-center justify-between py-4 border-b border-zinc-800 last:border-0">
                            <span className="font-bold text-zinc-300">Downloaded Track #{h.trackId.slice(0, 8)}</span>
                            <span className="text-zinc-600 text-xs">{new Date(h.downloadedAt).toLocaleDateString()}</span>
                         </div>
                      ))
                   )}
                </div>
             </div>
          </div>
        )}

        {(activeView === 'explore' || activeView === 'songs' || activeView === 'beats') && (
          <div className="space-y-16 animate-fade-in">
             <section className="relative h-[300px] rounded-[3rem] overflow-hidden flex items-center px-16 border border-zinc-900">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/40 to-transparent" />
                <div className="relative z-10">
                   <h2 className="text-6xl font-black tracking-tighter mb-4 capitalize">The Vault</h2>
                   <p className="text-zinc-400 text-xl font-medium">Industry standard production, ready for your next hit.</p>
                </div>
             </section>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {currentDisplayTracks.map(t => (
                <MusicCard 
                  key={t.id} track={t} 
                  onSelect={() => { setCurrentTrack(t); setIsPlaying(true); }}
                  onDownload={handleDownload} onLike={handleLike}
                  onFollow={() => handleFollowArtist(t.artistId)}
                  isFollowing={(user?.followingArtistIds || []).includes(t.artistId)}
                  isActive={currentTrack?.id === t.id} isPlaying={currentTrack?.id === t.id && isPlaying}
                />
              ))}
              {currentDisplayTracks.length === 0 && (
                <div className="col-span-full py-20 text-center border-2 border-dashed border-zinc-800 rounded-3xl">
                  <p className="text-zinc-500 font-bold">No tracks found matching your criteria.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {isAddingArtist && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setIsAddingArtist(false)} />
           <div className="relative bg-[#050505] border border-zinc-800 rounded-[4rem] w-full max-w-2xl p-12 shadow-2xl">
              <h2 className="text-4xl font-black tracking-tighter mb-8 text-center">Register Producer</h2>
              <form onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const artistName = formData.get('name') as string;
                const { data, error } = await supabase.from('artists').insert({
                  name: artistName, bio: formData.get('bio') as string, genre: formData.get('genre') as string,
                  profile_image_url: `https://api.dicebear.com/7.x/initials/svg?seed=${artistName}`,
                }).select();
                if (data) { setArtists(prev => [...prev, mapArtist(data[0])]); setIsAddingArtist(false); addNotification(`${artistName} profile live!`, 'success'); }
              }} className="space-y-6">
                 <input name="name" required className="w-full bg-zinc-900 border border-zinc-800 rounded-3xl px-8 py-5 text-xl font-bold outline-none" placeholder="Producer Name" />
                 <input name="genre" required className="w-full bg-zinc-900 border border-zinc-800 rounded-3xl px-8 py-5 text-xl font-bold outline-none" placeholder="Signature Genre" />
                 <textarea name="bio" required className="w-full bg-zinc-900 border border-zinc-800 rounded-3xl px-8 py-5 text-xl font-bold outline-none h-32" placeholder="Tell your story..." />
                 <button type="submit" className="w-full bg-indigo-600 py-6 rounded-3xl font-black text-xl hover:bg-indigo-500 transition-all">Publish Profile</button>
              </form>
           </div>
        </div>
      )}

      {isNeuralAccessOpen && <NeuralAccess onClose={() => setIsNeuralAccessOpen(false)} onSubmit={handleNeuralAccess} />}
      {isUploadOpen && <UploadModal onClose={() => setIsUploadOpen(false)} user={user} managedArtists={artists} onUpload={(t) => { setTracks(prev => [mapTrack(t), ...prev]); setIsUploadOpen(false); addNotification('Upload Successful', 'success'); }} />}
      <MusicPlayer track={currentTrack} isPlaying={isPlaying} onPlayPause={() => setIsPlaying(!isPlaying)} onNext={() => {}} onPrev={() => {}} onDownload={handleDownload} />
    </div>
  );
}
