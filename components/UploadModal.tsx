
import React, { useState, useEffect } from 'react';
import { Track, User, Artist, ProductionCredits, Contributor, SocialHandle } from '../types';
import { generateTrackDetails } from '../services/geminiService';
import { supabase } from '../lib/supabase';

interface UploadModalProps {
  onClose: () => void;
  onUpload: (track: Track) => void;
  user?: User | null;
  managedArtists?: Artist[];
}

const SOCIAL_PLATFORMS = ['Instagram', 'Twitter/X', 'TikTok', 'YouTube', 'SoundCloud', 'Spotify'];

const GENRES = ['Trap', 'Drill', 'Hip Hop', 'R&B', 'Soul', 'Pop', 'Rock', 'EDM', 'Lofi', 'Afrobeat'];

const MOODS = ['Energetic', 'Dark', 'Chill', 'Happy', 'Sad', 'Aggressive', 'Calm', 'Melodic'];

export default function UploadModal({ onClose, onUpload, user, managedArtists = [] }: UploadModalProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
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

  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [socials, setSocials] = useState<SocialHandle[]>([]);

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

  const uploadFile = async (file: File, bucket: string) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage.from(bucket).upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.audioFile || !formData.selectedArtistId) {
      alert('Missing required fields.');
      return;
    }

    setIsUploading(true);

    try {
      // 1. Upload Assets to Supabase Storage
      const audioUrl = await uploadFile(formData.audioFile, 'audio-assets');
      let coverUrl = 'https://picsum.photos/400/400?random=' + Date.now();
      
      if (formData.coverFile) {
        coverUrl = await uploadFile(formData.coverFile, 'image-assets');
      }

      const selectedArtist = managedArtists.find(a => a.id === formData.selectedArtistId);
      const artistName = selectedArtist?.name || user?.username || 'Studio Member';

      // 2. Prepare Metadata
      const newTrackData = {
        title: formData.title,
        artist_id: formData.selectedArtistId,
        artist_name: artistName,
        main_artist: formData.mainArtist || artistName,
        featured_artists: formData.featuredArtists,
        genre: formData.genre,
        bpm: parseInt(formData.bpm) || 120,
        mood: formData.mood,
        cover_url: coverUrl,
        audio_url: audioUrl,
        description: formData.description,
        tags: [formData.genre, formData.mood],
        license_type: formData.licenseType,
        likes: 0,
        downloads: 0
      };

      // 3. Insert into Supabase Database
      const { data, error } = await supabase.from('tracks').insert(newTrackData).select();

      if (error) throw error;
      if (data) onUpload(data[0]);

    } catch (err: any) {
      alert('Upload failed: ' + err.message);
    } finally {
      setIsUploading(false);
    }
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
          {/* Core Identity */}
          <div className="space-y-10">
             <div className="flex items-center justify-between border-b border-indigo-500/20 pb-2">
                <h3 className="text-xs font-black uppercase tracking-[0.4em] text-indigo-500">01 Track Core Identity</h3>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                   <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Release Title *</label>
                   <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-3xl px-8 py-5 text-xl font-bold focus:ring-2 ring-indigo-500 outline-none" placeholder="Track Title" />
                </div>
                <div className="space-y-3">
                   <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Managed Profile *</label>
                   <select required value={formData.selectedArtistId} onChange={e => setFormData({...formData, selectedArtistId: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-3xl px-8 py-5 font-bold outline-none cursor-pointer">
                      <option value="">-- Choose Profile --</option>
                      {managedArtists.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                   </select>
                </div>
             </div>
          </div>

          {/* Technical Specs */}
          <div className="space-y-8">
             <h3 className="text-xs font-black uppercase tracking-[0.4em] text-indigo-500 border-b border-indigo-500/20 pb-2">02 Technical Specifications</h3>
             <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-3">
                   <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Genre</label>
                   <select value={formData.genre} onChange={e => setFormData({...formData, genre: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4 outline-none font-bold">
                      {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
                   </select>
                </div>
                <div className="space-y-3">
                   <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">BPM</label>
                   <input type="number" value={formData.bpm} onChange={e => setFormData({...formData, bpm: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4 outline-none font-bold" />
                </div>
             </div>
          </div>

          {/* Files */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
             <div className="space-y-6">
                <div className="flex items-center justify-between">
                   <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Story & Marketing Copy</label>
                   <button type="button" onClick={handleMagicFill} disabled={isGenerating} className="text-[10px] font-black bg-indigo-600 px-5 py-2.5 rounded-2xl">✨ AI Optimization</button>
                </div>
                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-[2.5rem] px-8 py-6 h-48 outline-none leading-relaxed text-zinc-300" placeholder="Session notes..." />
             </div>
             <div className="grid grid-cols-2 gap-6">
                <label className="flex flex-col items-center justify-center w-full h-full border-2 border-dashed border-zinc-800 rounded-[3.5rem] cursor-pointer hover:bg-zinc-900 transition-all overflow-hidden group">
                   {formData.audioFile ? (
                      <div className="text-center p-4">
                         <svg className="w-12 h-12 text-indigo-500 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 19V6l12-3v13" /></svg>
                         <p className="text-[10px] font-black text-indigo-400 truncate w-40">{formData.audioFile.name}</p>
                      </div>
                   ) : (
                      <div className="text-center">
                         <span className="text-[10px] font-black uppercase text-zinc-600 tracking-widest">UPLOAD WAV *</span>
                      </div>
                   )}
                   <input type="file" accept="audio/*" className="hidden" onChange={e => setFormData({...formData, audioFile: e.target.files?.[0] || null})} />
                </label>
                <label className="flex flex-col items-center justify-center w-full h-full border-2 border-dashed border-zinc-800 rounded-[3.5rem] cursor-pointer hover:bg-zinc-900 transition-all overflow-hidden group">
                   {formData.coverFile ? (
                      <img src={URL.createObjectURL(formData.coverFile)} className="w-full h-full object-cover" />
                   ) : (
                      <div className="text-center">
                         <span className="text-[10px] font-black uppercase text-zinc-600 tracking-widest">Cover Art</span>
                      </div>
                   )}
                   <input type="file" accept="image/*" className="hidden" onChange={e => setFormData({...formData, coverFile: e.target.files?.[0] || null})} />
                </label>
             </div>
          </div>

          <button type="submit" disabled={isUploading} className={`w-full bg-indigo-600 py-8 rounded-[2.5rem] font-black text-2xl transition-all shadow-2xl ${isUploading ? 'opacity-50 cursor-wait' : 'hover:bg-indigo-500 active:scale-95'}`}>
             {isUploading ? 'UPLOADING TO CLOUD...' : 'Publish Industry Release'}
          </button>
        </form>
      </div>
    </div>
  );
}
