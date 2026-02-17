
import React from 'react';
import { Track } from '../types';

interface MusicCardProps {
  track: Track;
  onSelect: () => void;
  isActive: boolean;
  isPlaying: boolean;
}

// Using React.FC to ensure the component is recognized as a React Functional Component, which implicitly supports the 'key' prop.
const MusicCard: React.FC<MusicCardProps> = ({ track, onSelect, isActive, isPlaying }) => {
  return (
    <div 
      className={`group relative bg-zinc-900/50 rounded-2xl p-4 border border-zinc-800 transition-all hover:bg-zinc-800/80 hover:border-zinc-700 hover:shadow-2xl hover:shadow-indigo-500/10 cursor-pointer ${isActive ? 'ring-2 ring-indigo-500' : ''}`}
      onClick={onSelect}
    >
      <div className="relative aspect-square overflow-hidden rounded-xl mb-4 bg-zinc-800">
        <img 
          src={track.coverUrl} 
          alt={track.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-transform">
            {isPlaying ? (
              <svg className="w-8 h-8 text-black fill-current" viewBox="0 0 24 24">
                <rect x="6" y="4" width="4" height="16" />
                <rect x="14" y="4" width="4" height="16" />
              </svg>
            ) : (
              <svg className="w-8 h-8 text-black fill-current translate-x-1" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-bold text-lg truncate pr-2">{track.title}</h3>
          <p className="text-zinc-500 text-sm font-medium">{track.artist}</p>
        </div>
        {track.price && (
          <span className="bg-indigo-600/20 text-indigo-400 text-xs font-bold px-2 py-1 rounded">
            ${track.price}
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {track.tags.slice(0, 3).map(tag => (
          <span key={tag} className="text-[10px] uppercase tracking-wider font-bold text-zinc-600 border border-zinc-800 px-1.5 py-0.5 rounded">
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between text-zinc-500 text-xs">
        <div className="flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{track.genre}</span>
        </div>
        <div className="flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13" />
          </svg>
          <span>{track.bpm} BPM</span>
        </div>
      </div>
    </div>
  );
};

export default MusicCard;
