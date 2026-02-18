
import React, { useRef, useEffect, useState } from 'react';
import { Track } from '../types';

interface MusicPlayerProps {
  track: Track | null;
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  onDownload?: (e: React.MouseEvent, track: Track) => void;
}

export default function MusicPlayer({ track, isPlaying, onPlayPause, onNext, onPrev, onDownload }: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.play().catch(() => {});
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, track]);

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
  };

  const handleLoadedMetadata = () => {
    if (!audioRef.current) return;
    setDuration(audioRef.current.duration);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    const time = (parseFloat(e.target.value) / 100) * audioRef.current.duration;
    audioRef.current.currentTime = time;
    setProgress(parseFloat(e.target.value));
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!track) return null;

  return (
    <div className="fixed bottom-8 left-8 right-8 z-[90] animate-fade-in">
      <div className="container mx-auto max-w-7xl bg-[#0a0a0a]/90 backdrop-blur-3xl border border-zinc-800/80 rounded-[3rem] px-10 py-6 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.9)]">
        <audio 
          ref={audioRef}
          src={track.audioUrl}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={onNext}
        />
        
        <div className="flex items-center justify-between gap-12">
          {/* Track Info */}
          <div className="flex items-center gap-6 w-[320px] shrink-0">
            <div className="relative w-16 h-16 rounded-2xl overflow-hidden shadow-2xl flex-shrink-0 group">
              <img 
                src={track.coverUrl} 
                alt={track.title} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <h4 className="font-black text-xl tracking-tight truncate leading-tight mb-1">{track.title}</h4>
              <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest truncate">{track.artistName}</p>
            </div>
          </div>

          {/* Player Controls & Progress */}
          <div className="flex-1 flex flex-col gap-3">
            <div className="flex items-center justify-center gap-12">
              <button onClick={onPrev} className="text-zinc-600 hover:text-white transition-all transform active:scale-90">
                <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24"><path d="M6 6h2v12H6zm3.5 6L19 18V6z" /></svg>
              </button>
              
              <button 
                onClick={onPlayPause}
                className="w-16 h-16 bg-white text-black rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-2xl shadow-white/10"
              >
                {isPlaying ? (
                  <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24"><path d="M6 4h4v16H6zm8 0h4v16h-4z" /></svg>
                ) : (
                  <svg className="w-7 h-7 fill-current translate-x-1" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                )}
              </button>

              <button onClick={onNext} className="text-zinc-600 hover:text-white transition-all transform active:scale-90">
                <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6zM16 6v12h2V6z" /></svg>
              </button>
            </div>

            <div className="flex items-center gap-6">
               <span className="text-[10px] font-black text-zinc-600 w-12 text-right tracking-widest">{formatTime(audioRef.current?.currentTime || 0)}</span>
               <div className="relative flex-1 group h-6 flex items-center">
                  <div className="absolute inset-0 flex items-center">
                     <div className="w-full h-1.5 bg-zinc-900 rounded-full" />
                  </div>
                  <div 
                    className="absolute h-1.5 bg-indigo-600 rounded-full transition-all duration-100 shadow-[0_0_20px_rgba(79,70,229,0.5)]" 
                    style={{width: `${progress}%`}} 
                  />
                  <input 
                    type="range"
                    min="0"
                    max="100"
                    step="0.1"
                    value={progress}
                    onChange={handleSeek}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
               </div>
               <span className="text-[10px] font-black text-zinc-600 w-12 tracking-widest">{formatTime(duration)}</span>
            </div>
          </div>

          {/* Volume & Download */}
          <div className="flex items-center justify-end gap-10 w-[320px] shrink-0">
             <div className="flex items-center gap-4 group">
                <button onClick={() => {
                  const newMute = !isMuted;
                  setIsMuted(newMute);
                  if (audioRef.current) audioRef.current.volume = newMute ? 0 : volume;
                }} className="text-zinc-600 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                </button>
                <div className="relative w-24 h-1 bg-zinc-900 rounded-full transition-all">
                   <div 
                      className="absolute h-full bg-white rounded-full" 
                      style={{width: `${isMuted ? 0 : volume * 100}%`}} 
                    />
                </div>
             </div>
             
             <button 
                onClick={(e) => onDownload?.(e, track)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-[1.5rem] transition-all font-black text-xs uppercase tracking-widest shadow-2xl shadow-indigo-600/20 active:scale-95"
             >
                Get WAV File
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
