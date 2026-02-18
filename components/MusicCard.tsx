
import React from 'react';
import { Track } from '../types';

interface MusicCardProps {
  track: Track;
  onSelect: () => void;
  onDownload: (e: React.MouseEvent, track: Track) => void;
  onLike: (e: React.MouseEvent, id: string) => void;
  onFollow?: () => void;
  isFollowing?: boolean;
  isActive: boolean;
  isPlaying: boolean;
}

const MusicCard: React.FC<MusicCardProps> = ({ 
  track, onSelect, onDownload, onLike, onFollow, isFollowing, isActive, isPlaying 
}) => {
  return (
    <div 
      className={`group relative bg-zinc-900/10 rounded-[2.5rem] p-5 border border-zinc-800/30 transition-all duration-500 hover:bg-zinc-800/40 hover:border-zinc-700 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)] cursor-pointer flex flex-col h-full ${isActive ? 'ring-2 ring-indigo-500/50 bg-zinc-800/60 shadow-2xl' : ''}`}
      onClick={onSelect}
    >
      <div className="relative aspect-square overflow-hidden rounded-[2rem] mb-6 bg-zinc-900 shadow-2xl group/cover">
        <img src={track.coverUrl} alt={track.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
        
        <div className={`absolute inset-0 bg-black/50 backdrop-blur-[3px] flex items-center justify-center transition-all duration-500 ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
          <div className="w-20 h-20 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-full flex items-center justify-center shadow-2xl active:scale-90 transition-all transform hover:scale-110">
            {isPlaying ? (
              <svg className="w-9 h-9 text-white fill-current" viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
            ) : (
              <svg className="w-9 h-9 text-white fill-current translate-x-1" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
            )}
          </div>
        </div>

        <div className="absolute top-5 left-5 right-5 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button 
            onClick={(e) => onLike(e, track.id)}
            className={`p-3.5 rounded-2xl backdrop-blur-xl transition-all active:scale-90 ${track.isLiked ? 'bg-rose-500 text-white shadow-xl shadow-rose-500/20' : 'bg-black/30 text-white hover:bg-white/20'}`}
          >
            <svg className={`w-6 h-6 ${track.isLiked ? 'fill-current' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
          </button>
          
          <button 
            onClick={(e) => { e.stopPropagation(); onFollow?.(); }}
            className={`px-5 py-2.5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${isFollowing ? 'bg-indigo-600 text-white' : 'bg-white text-black hover:bg-zinc-200'}`}
          >
            {isFollowing ? 'Following' : '+ Follow'}
          </button>
        </div>

        <div className="absolute bottom-5 left-5 right-5 flex justify-between items-center">
            <div className="bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
               <span className="text-[10px] font-black text-white/90 uppercase tracking-[0.1em]">{track.bpm} BPM</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-black text-white/80 border border-white/5 uppercase tracking-tighter">
                {track.downloads.toLocaleString()} DLs
            </div>
        </div>
      </div>

      <div className="mb-6 flex-1">
        <h3 className="font-black text-2xl truncate group-hover:text-indigo-400 transition-colors tracking-tighter leading-tight mb-2">
           {track.title}
           {track.featuredArtists && <span className="text-zinc-500 text-base font-bold ml-2 italic">ft. {track.featuredArtists}</span>}
        </h3>
        <div className="flex items-center gap-2">
           <p className="text-zinc-500 text-sm font-bold truncate uppercase tracking-widest">{track.mainArtist || track.artistName}</p>
           <div className="w-4 h-4 bg-indigo-500 rounded-full flex items-center justify-center text-[8px] text-white">✓</div>
        </div>
      </div>

      <button 
        onClick={(e) => onDownload(e, track)}
        className="w-full bg-zinc-900 group-hover:bg-indigo-600 text-white font-black py-4 rounded-[1.5rem] transition-all flex items-center justify-center gap-3 active:scale-95 shadow-lg group-hover:shadow-indigo-600/30"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
        Free Download
      </button>
    </div>
  );
};

export default MusicCard;
