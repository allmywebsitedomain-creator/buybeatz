
import React, { useState } from 'react';
import { Track } from '../types';
import { generateTrackDetails } from '../services/geminiService';

interface UploadModalProps {
  onClose: () => void;
  onUpload: (track: Track) => void;
}

export default function UploadModal({ onClose, onUpload }: UploadModalProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    genre: 'Trap',
    bpm: '140',
    price: '29.99',
    description: '',
    tags: [] as string[],
    audioFile: null as File | null,
    coverFile: null as File | null
  });

  const handleMagicFill = async () => {
    if (!formData.title) return alert('Please enter a title first');
    setIsGenerating(true);
    const details = await generateTrackDetails(formData.title, formData.genre);
    setFormData(prev => ({
      ...prev,
      description: details.description,
      tags: details.tags,
      bpm: details.suggestedBpm.toString()
    }));
    setIsGenerating(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.audioFile) return alert('Title and Audio file are required');

    // Create a mock track object with local object URLs for the demo
    const newTrack: Track = {
      id: Date.now().toString(),
      title: formData.title,
      artist: 'You',
      genre: formData.genre,
      bpm: parseInt(formData.bpm),
      price: parseFloat(formData.price),
      coverUrl: formData.coverFile ? URL.createObjectURL(formData.coverFile) : 'https://picsum.photos/400/400?random=' + Date.now(),
      audioUrl: URL.createObjectURL(formData.audioFile),
      description: formData.description || 'No description provided.',
      tags: formData.tags.length > 0 ? formData.tags : [formData.genre],
      createdAt: new Date().toISOString()
    };

    onUpload(newTrack);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto no-scrollbar shadow-2xl">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-black">Upload New Beat</h2>
            <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-full transition-colors">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-zinc-400">Track Title</label>
                <input 
                  type="text"
                  required
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="e.g. Midnight Waves"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-zinc-400">Genre</label>
                <select 
                  value={formData.genre}
                  onChange={e => setFormData({...formData, genre: e.target.value})}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option>Trap</option>
                  <option>Lofi</option>
                  <option>Drill</option>
                  <option>R&B</option>
                  <option>Synthwave</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-zinc-400">BPM</label>
                <input 
                  type="number"
                  value={formData.bpm}
                  onChange={e => setFormData({...formData, bpm: e.target.value})}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-zinc-400">Price ($)</label>
                <input 
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={e => setFormData({...formData, price: e.target.value})}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-zinc-400">AI Magic Fill</label>
                <button 
                  type="button"
                  onClick={handleMagicFill}
                  disabled={isGenerating || !formData.title}
                  className="flex items-center gap-2 text-xs font-black uppercase tracking-widest bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-2 rounded-lg hover:opacity-90 disabled:opacity-50 transition-all"
                >
                  {isGenerating ? 'Analyzing...' : (
                    <>
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
                      </svg>
                      Generate Metadata
                    </>
                  )}
                </button>
              </div>
              <textarea 
                placeholder="Describe your track vibe..."
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none h-24"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-zinc-400">Audio File (.mp3)</label>
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-zinc-800 border-dashed rounded-2xl cursor-pointer hover:bg-zinc-800/50 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-8 h-8 mb-3 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-xs text-zinc-500">
                      {formData.audioFile ? formData.audioFile.name : 'Click to upload audio'}
                    </p>
                  </div>
                  <input type="file" className="hidden" accept="audio/*" onChange={e => setFormData({...formData, audioFile: e.target.files?.[0] || null})} />
                </label>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-zinc-400">Cover Art (.jpg/png)</label>
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-zinc-800 border-dashed rounded-2xl cursor-pointer hover:bg-zinc-800/50 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-8 h-8 mb-3 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 002-2H4a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-xs text-zinc-500">
                      {formData.coverFile ? formData.coverFile.name : 'Click to upload cover'}
                    </p>
                  </div>
                  <input type="file" className="hidden" accept="image/*" onChange={e => setFormData({...formData, coverFile: e.target.files?.[0] || null})} />
                </label>
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4 rounded-xl transition-all active:scale-95 shadow-xl shadow-indigo-500/20"
            >
              Confirm Upload
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
