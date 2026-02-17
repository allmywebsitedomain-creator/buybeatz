
import React, { useState } from 'react';
import { Track } from './types';
import Header from './components/Header';
import MusicGrid from './components/MusicGrid';
import MusicPlayer from './components/MusicPlayer';
import UploadModal from './components/UploadModal';

/** 
 * --- INITIAL DATA ---
 */
const INITIAL_TRACKS: Track[] = [
  {
    id: '1',
    title: 'Neon Nights',
    artist: 'Metro Boomin Type',
    genre: 'Trap',
    bpm: 140,
    price: 29.99,
    coverUrl: 'https://picsum.photos/id/123/400/400',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    description: 'Dark, atmospheric trap beat with heavy 808s and sharp hi-hats.',
    tags: ['Dark', 'Hard', '808'],
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Sunset Lofi',
    artist: 'ChillHop King',
    genre: 'Lofi',
    bpm: 85,
    price: 19.99,
    coverUrl: 'https://picsum.photos/id/234/400/400',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    description: 'Perfect for studying or relaxing. Dusty drums and jazz piano.',
    tags: ['Chill', 'Study', 'Smooth'],
    createdAt: new Date().toISOString()
  }
];

/**
 * --- MAIN APP ---
 */
export default function App() {
  const [tracks, setTracks] = useState<Track[]>(INITIAL_TRACKS);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Filtering logic to search through titles, genres, and tags
  const filtered = tracks.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.genre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSelect = (track: Track) => {
    if (currentTrack?.id === track.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);
    }
  };

  const handleNext = () => {
    const currentIndex = tracks.findIndex(t => t.id === currentTrack?.id);
    if (currentIndex !== -1 && currentIndex < tracks.length - 1) {
      handleSelect(tracks[currentIndex + 1]);
    }
  };

  const handlePrev = () => {
    const currentIndex = tracks.findIndex(t => t.id === currentTrack?.id);
    if (currentIndex > 0) {
      handleSelect(tracks[currentIndex - 1]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#09090b] pb-24 text-white">
      {/* 
        Using modular Header component for better separation of concerns and correct typing.
      */}
      <Header 
        onUploadClick={() => setIsUploadOpen(true)} 
        onSearch={setSearchQuery} 
      />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-black tracking-tight">Featured Beatz</h2>
          <div className="text-sm font-medium text-zinc-500 bg-zinc-900/50 px-3 py-1 rounded-full border border-zinc-800">
            {filtered.length} track{filtered.length !== 1 ? 's' : ''} found
          </div>
        </div>

        {/* 
          Resolved TypeScript error in App.tsx by using the modular MusicGrid component.
          The error was caused by the inline MusicCard component not being typed to accept 
          the 'key' prop in a list context. Modular components are properly typed.
        */}
        {filtered.length > 0 ? (
          <MusicGrid 
            tracks={filtered} 
            onTrackSelect={handleSelect}
            currentTrackId={currentTrack?.id}
            isPlaying={isPlaying}
          />
        ) : (
          <div className="flex flex-col items-center justify-center py-24 bg-zinc-900/20 rounded-3xl border border-dashed border-zinc-800">
            <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center mb-4 border border-zinc-800">
              <svg className="w-8 h-8 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-zinc-400">No results found</h3>
            <p className="text-zinc-600">Try adjusting your search filters</p>
          </div>
        )}
      </main>

      {/* 
        The modular MusicPlayer provides full playback controls and is properly typed.
      */}
      <MusicPlayer 
        track={currentTrack} 
        isPlaying={isPlaying} 
        onPlayPause={() => setIsPlaying(!isPlaying)} 
        onNext={handleNext} 
        onPrev={handlePrev} 
      />

      {/* 
        UploadModal includes the AI-powered metadata generation using Gemini API.
      */}
      {isUploadOpen && (
        <UploadModal 
          onClose={() => setIsUploadOpen(false)} 
          onUpload={t => { 
            setTracks([t, ...tracks]); 
            setIsUploadOpen(false); 
          }} 
        />
      )}
    </div>
  );
}
