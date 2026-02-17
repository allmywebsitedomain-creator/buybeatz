
import React from 'react';
import { Track } from '../types';
import MusicCard from './MusicCard';

interface MusicGridProps {
  tracks: Track[];
  onTrackSelect: (track: Track) => void;
  currentTrackId?: string;
  isPlaying: boolean;
}

export default function MusicGrid({ tracks, onTrackSelect, currentTrackId, isPlaying }: MusicGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {tracks.map((track) => (
        <MusicCard 
          key={track.id} 
          track={track} 
          onSelect={() => onTrackSelect(track)}
          isActive={currentTrackId === track.id}
          isPlaying={currentTrackId === track.id && isPlaying}
        />
      ))}
    </div>
  );
}
