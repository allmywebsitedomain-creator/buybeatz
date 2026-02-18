
import React from 'react';
import { Track } from '../types';
import MusicCard from './MusicCard';

interface MusicGridProps {
  tracks: Track[];
  onTrackSelect: (track: Track) => void;
  currentTrackId?: string;
  isPlaying: boolean;
  // Fix: Renamed onAddToCart to onDownload to match the expected prop in MusicCard
  onDownload: (e: React.MouseEvent, track: Track) => void;
  onLike: (e: React.MouseEvent, id: string) => void;
}

export default function MusicGrid({ 
  tracks, 
  onTrackSelect, 
  currentTrackId, 
  isPlaying, 
  onDownload, 
  onLike 
}: MusicGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {tracks.map((track) => (
        <MusicCard 
          key={track.id} 
          track={track} 
          onSelect={() => onTrackSelect(track)}
          isActive={currentTrackId === track.id}
          isPlaying={currentTrackId === track.id && isPlaying}
          // Fix: Passing onDownload as expected by MusicCard
          onDownload={onDownload}
          onLike={onLike}
        />
      ))}
      {tracks.length === 0 && (
        <div className="col-span-full py-20 text-center border-2 border-dashed border-zinc-800 rounded-3xl">
           <p className="text-zinc-500 font-bold">No beats found match your search.</p>
        </div>
      )}
    </div>
  );
}
