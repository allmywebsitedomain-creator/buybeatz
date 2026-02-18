
import React, { useState, useEffect } from 'react';
import { Track, User, Artist, ProductionCredits, Contributor, SocialHandle } from '../types';
import { generateTrackDetails } from '../services/geminiService';

interface UploadModalProps {
  onClose: () => void;
  onUpload: (track: Track) => void;
  user?: User | null;
  managedArtists?: Artist[];
}

const SOCIAL_PLATFORMS = [
  'Instagram',
  'Twitter/X',
  'TikTok',
  'YouTube',
  'Facebook',
  'SoundCloud',
  'Spotify',
  'Apple Music',
  'Tidal',
  'Bandcamp',
  'Audiomack',
  'Linktree',
  'Website',
  'Discord',
  'Twitch',
  'Threads',
  'Snapchat',
  'Pinterest',
  'LinkedIn',
  'Behance',
  'Vimeo',
  'Other'
];

const GENRES = [
  'Trap', 'Drill', 'Hip Hop', 'R&B', 'Soul', 'Pop', 'Rock', 'Metal', 'Punk', 
  'EDM', 'House', 'Techno', 'Trance', 'Drum & Bass', 'Dubstep', 'Hyperpop', 
  'Lofi', 'Chillhop', 'Afrobeat', 'Reggaeton', 'Dancehall', 'Funk', 'Jazz', 
  'Blues', 'Country', 'Classical', 'Cinematic', 'Ambient', 'Phonk', 'Latin'
];

const MOODS = [
  'Energetic', 'Dark', 'Chill', 'Happy', 'Sad', 'Aggressive', 'Calm', 
  'Inspiring', 'Melodic', 'Atmospheric', 'Nostalgic', 'Romantic', 'Tense', 
  'Mysterious', 'Dreamy', 'Angry', 'Epic', 'Groovy', 'Somber', 'Uplifting'
];

export default function UploadModal({ onClose, onUpload, user, managedArtists = [] }: UploadModalProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    title: '',
    selectedArtistId: '',
    mainArtist: '',
    featuredArtists: '',
    genre: 'Trap',
    bpm: '140',
    mood: 'Energetic',
    description: '',
    licenseType: 'Free' as 'Free' | 'Standard' | 'Premium',
    producedBy: '',
    mixedBy: '',
    masteredBy: '',
    writtenBy: '',
    audioFile: null as File | null,
    coverFile: null as File | null
  });

  // Dynamic Lists State
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [socials, setSocials] = useState<SocialHandle[]>([]);

  // Sync main artist with profile selection if main artist is empty
  useEffect(() => {
    const selected = managedArtists.find(a => a.id === formData.selectedArtistId);
    if (selected && !formData.mainArtist) {
      setFormData(prev => ({ ...prev, mainArtist: selected.name, producedBy: selected.name }));
    }
  }, [formData.selectedArtistId, managedArtists]);

  const handleMagicFill = async () => {
    if (!formData.title) return alert('Enter title first');
    setIsGenerating(true);
    const details = await generateTrackDetails(formData.title, formData.genre);
    setFormData(prev => ({ ...prev, description: details.description, bpm: details.suggestedBpm.toString() }));
    setIsGenerating(false);
  };

  const addContributor = () => {
    setContributors([...contributors, { id: Date.now().toString(), name: '', role: '' }]);
  };

  const removeContributor = (id: string) => {
    setContributors(contributors.filter(c => c.id !== id));
  };

  const updateContributor = (id: string, field: keyof Contributor, value: string) => {
    setContributors(contributors.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const addSocial = () => {
    setSocials([...socials, { id: Date.now().toString(), platform: 'Instagram', handle: '' }]);
  };

  const removeSocial = (id: string) => {
    setSocials(socials.filter(s => s.id !== id));
  };

  const updateSocial = (id: string, field: keyof SocialHandle, value: string) => {
    setSocials(socials.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.audioFile || !formData.selectedArtistId) {
      alert('Please provide Track Title, Audio File, and select a Managed Profile.');
      return;
    }

    const selectedArtist = managedArtists.find(a => a.id === formData.selectedArtistId);
    const artistName = selectedArtist?.name || user?.username || 'Studio Member';

    const credits: ProductionCredits = {
      producedBy: formData.producedBy || formData.mainArtist || artistName,
      mixedBy: formData.mixedBy,
      masteredBy: formData.masteredBy,
      writtenBy: formData.writtenBy,
      additionalContributors: contributors.filter(c => c.name.trim() !== '')
    };

    const newTrack: Track = {
      id: 'trk_' + Date.now(),
      title: formData.title,
      artistId: formData.selectedArtistId,
      artistName: artistName,
      mainArtist: formData.mainArtist || artistName,
      featuredArtists: formData.featuredArtists,
      genre: formData.genre,
      bpm: parseInt(formData.bpm) || 120,
      mood: formData.mood,
      coverUrl: formData.coverFile ? URL.createObjectURL(formData.coverFile) : 'https://picsum.photos/400/400?random=' + Date.now(),
      audioUrl: URL.createObjectURL(formData.audioFile),
      description: formData.description,
      tags: [formData.genre, formData.mood],
      credits: credits,
      releaseSocials: socials.filter(s => s.handle.trim() !== ''),
      licenseType: formData.licenseType,
      createdAt: new Date().toISOString(),
      likes: 0,
      downloads: 0
    };

    onUpload(newTrack);
  };

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/85 backdrop-blur-md" onClick={onClose} />
      <div className="relative bg-[#050505] border border-zinc-800 rounded-[3.5rem] w-full max-w-5xl max-h-[90vh] overflow-y-auto no-scrollbar shadow-2xl p-8 lg:p-16">
        <div className="flex items-center justify-between mb-12">
           <div>
              <h2 className="text-5xl font-black tracking-tighter mb-2">Upload Production</h2>
              <p className="text-zinc-500 font-medium">Distribute high-quality sound with deep metadata & credits.</p>
           </div>
          <button onClick={onClose} className="p-5 bg-zinc-900 hover:bg-zinc-800 rounded-3xl transition-colors">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-12">
          {/* Track Core Identity */}
          <div className="space-y-10">
             <div className="flex items-center justify-between border-b border-indigo-500/20 pb-2">
                <h3 className="text-xs font-black uppercase tracking-[0.4em] text-indigo-500">01 Track Core Identity</h3>
                <div className="flex gap-4">
                   <button type="button" onClick={addContributor} className="text-[10px] font-black bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-xl hover:bg-zinc-800 transition-all">+ Add Contributor Credit</button>
                   <button type="button" onClick={addSocial} className="text-[10px] font-black bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-xl hover:bg-zinc-800 transition-all">+ Add Social Handle</button>
                </div>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                   <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Release Title *</label>
                   <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-3xl px-8 py-5 text-xl font-bold focus:ring-2 ring-indigo-500 outline-none" placeholder="e.g. Moonlight Sonata 2" />
                </div>
                <div className="space-y-3">
                   <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Managed Profile *</label>
                   <select required value={formData.selectedArtistId} onChange={e => setFormData({...formData, selectedArtistId: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-3xl px-8 py-5 font-bold outline-none cursor-pointer">
                      <option value="">-- Choose Profile --</option>
                      {managedArtists.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                   </select>
                </div>
                <div className="space-y-3">
                   <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Main Artist (Primary Billing)</label>
                   <input value={formData.mainArtist} onChange={e => setFormData({...formData, mainArtist: e.target.value})} className="w-full bg-zinc-900/50 border border-zinc-800 rounded-3xl px-8 py-5 font-bold outline-none" placeholder="Artist Name" />
                </div>
                <div className="space-y-3">
                   <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Featuring Artist(s)</label>
                   <input value={formData.featuredArtists} onChange={e => setFormData({...formData, featuredArtists: e.target.value})} className="w-full bg-zinc-900/50 border border-zinc-800 rounded-3xl px-8 py-5 font-bold outline-none" placeholder="e.g. Gunna, Drake" />
                </div>
             </div>

             {/* Dynamic Contributors List */}
             {contributors.length > 0 && (
                <div className="space-y-4 animate-fade-in">
                   <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Additional Contributors</label>
                   <div className="space-y-3">
                      {contributors.map(c => (
                        <div key={c.id} className="flex gap-4 animate-slide-in">
                           <input 
                              className="flex-1 bg-zinc-900/30 border border-zinc-800 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:border-indigo-500" 
                              placeholder="Name" 
                              value={c.name} 
                              onChange={e => updateContributor(c.id, 'name', e.target.value)}
                           />
                           <input 
                              className="flex-1 bg-zinc-900/30 border border-zinc-800 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:border-indigo-500" 
                              placeholder="Role (e.g. Guitarist)" 
                              value={c.role} 
                              onChange={e => updateContributor(c.id, 'role', e.target.value)}
                           />
                           <button type="button" onClick={() => removeContributor(c.id)} className="p-4 text-rose-500 hover:bg-rose-500/10 rounded-2xl transition-all">
                              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                           </button>
                        </div>
                      ))}
                   </div>
                </div>
             )}

             {/* Dynamic Social Handles List */}
             {socials.length > 0 && (
                <div className="space-y-4 animate-fade-in">
                   <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Release Social Presence</label>
                   <div className="space-y-3">
                      {socials.map(s => (
                        <div key={s.id} className="flex gap-4 animate-slide-in">
                           <select 
                              className="w-48 bg-zinc-900/30 border border-zinc-800 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:border-indigo-500"
                              value={s.platform}
                              onChange={e => updateSocial(s.id, 'platform', e.target.value)}
                           >
                              {SOCIAL_PLATFORMS.map(platform => (
                                <option key={platform} value={platform}>{platform}</option>
                              ))}
                           </select>
                           <input 
                              className="flex-1 bg-zinc-900/30 border border-zinc-800 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:border-indigo-500" 
                              placeholder="Handle or URL" 
                              value={s.handle} 
                              onChange={e => updateSocial(s.id, 'handle', e.target.value)}
                           />
                           <button type="button" onClick={() => removeSocial(s.id)} className="p-4 text-rose-500 hover:bg-rose-500/10 rounded-2xl transition-all">
                              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                           </button>
                        </div>
                      ))}
                   </div>
                </div>
             )}
          </div>

          {/* Production Credits */}
          <div className="space-y-8">
             <h3 className="text-xs font-black uppercase tracking-[0.4em] text-indigo-500 border-b border-indigo-500/20 pb-2">02 Production Team & Engineering</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-3">
                   <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Main Producer</label>
                   <input value={formData.producedBy} onChange={e => setFormData({...formData, producedBy: e.target.value})} className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl px-6 py-4 font-bold outline-none" placeholder="Producer Name" />
                </div>
                <div className="space-y-3">
                   <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Mixed By</label>
                   <input value={formData.mixedBy} onChange={e => setFormData({...formData, mixedBy: e.target.value})} className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl px-6 py-4 font-bold outline-none" placeholder="Mix Engineer" />
                </div>
                <div className="space-y-3">
                   <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Mastered By</label>
                   <input value={formData.masteredBy} onChange={e => setFormData({...formData, masteredBy: e.target.value})} className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl px-6 py-4 font-bold outline-none" placeholder="Mastering Engineer" />
                </div>
                <div className="space-y-3">
                   <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Legal Composer</label>
                   <input value={formData.writtenBy} onChange={e => setFormData({...formData, writtenBy: e.target.value})} className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl px-6 py-4 font-bold outline-none" placeholder="First & Last Name" />
                </div>
             </div>
          </div>

          {/* Technical Specs */}
          <div className="space-y-8">
             <h3 className="text-xs font-black uppercase tracking-[0.4em] text-indigo-500 border-b border-indigo-500/20 pb-2">03 Technical Specifications</h3>
             <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-3">
                   <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Genre</label>
                   <select 
                      value={formData.genre} 
                      onChange={e => setFormData({...formData, genre: e.target.value})} 
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4 outline-none font-bold appearance-none cursor-pointer"
                   >
                      {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
                   </select>
                </div>
                <div className="space-y-3">
                   <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">BPM</label>
                   <input type="number" value={formData.bpm} onChange={e => setFormData({...formData, bpm: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4 outline-none font-bold" />
                </div>
                <div className="space-y-3">
                   <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Vibe/Mood</label>
                   <select 
                      value={formData.mood} 
                      onChange={e => setFormData({...formData, mood: e.target.value})} 
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4 outline-none font-bold appearance-none cursor-pointer"
                   >
                      {MOODS.map(m => <option key={m} value={m}>{m}</option>)}
                   </select>
                </div>
                <div className="space-y-3">
                   <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">License</label>
                   <select value={formData.licenseType} onChange={e => setFormData({...formData, licenseType: e.target.value as any})} className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4 outline-none font-bold appearance-none">
                      <option>Free</option><option>Standard</option><option>Premium</option>
                   </select>
                </div>
             </div>
          </div>

          {/* Files */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
             <div className="space-y-6">
                <div className="flex items-center justify-between">
                   <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Story & Marketing Copy</label>
                   <button type="button" onClick={handleMagicFill} disabled={isGenerating} className="text-[10px] font-black bg-indigo-600 px-5 py-2.5 rounded-2xl active:scale-95 transition-all shadow-lg shadow-indigo-600/20">✨ AI Optimization</button>
                </div>
                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-[2.5rem] px-8 py-6 h-48 outline-none leading-relaxed text-zinc-300" placeholder="Tell the world the creative story behind this session..." />
             </div>
             <div className="grid grid-cols-2 gap-6">
                <label className="flex flex-col items-center justify-center w-full h-full border-2 border-dashed border-zinc-800 rounded-[3.5rem] cursor-pointer hover:bg-zinc-900 transition-all overflow-hidden group">
                   {formData.audioFile ? (
                      <div className="text-center p-4">
                         <svg className="w-12 h-12 text-indigo-500 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" /></svg>
                         <p className="text-[10px] font-black text-indigo-400 truncate w-40">{formData.audioFile.name}</p>
                      </div>
                   ) : (
                      <div className="text-center group-hover:scale-110 transition-transform">
                         <svg className="w-10 h-10 text-zinc-700 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12" /></svg>
                         <span className="text-[10px] font-black uppercase text-zinc-600 tracking-widest">WAV / MP3 *</span>
                      </div>
                   )}
                   <input type="file" accept="audio/*" className="hidden" onChange={e => setFormData({...formData, audioFile: e.target.files?.[0] || null})} />
                </label>
                <label className="flex flex-col items-center justify-center w-full h-full border-2 border-dashed border-zinc-800 rounded-[3.5rem] cursor-pointer hover:bg-zinc-900 transition-all overflow-hidden group">
                   {formData.coverFile ? (
                      <img src={URL.createObjectURL(formData.coverFile)} className="w-full h-full object-cover" />
                   ) : (
                      <div className="text-center group-hover:scale-110 transition-transform">
                         <svg className="w-10 h-10 text-zinc-700 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                         <span className="text-[10px] font-black uppercase text-zinc-600 tracking-widest">Cover Art</span>
                      </div>
                   )}
                   <input type="file" accept="image/*" className="hidden" onChange={e => setFormData({...formData, coverFile: e.target.files?.[0] || null})} />
                </label>
             </div>
          </div>

          <button type="submit" className="w-full bg-indigo-600 py-8 rounded-[2.5rem] font-black text-2xl hover:bg-indigo-500 transition-all shadow-2xl shadow-indigo-600/20 active:scale-95">
             Publish Industry Release
          </button>
        </form>
      </div>
    </div>
  );
}
