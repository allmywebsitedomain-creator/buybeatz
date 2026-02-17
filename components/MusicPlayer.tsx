
import React, { useRef, useEffect, useState } from 'react';
import { Track } from '../types';

interface MusicPlayerProps {
  track: Track | null;
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function MusicPlayer({ track, isPlaying, onPlayPause, onNext, onPrev }: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);

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
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#09090b]/95 border-t border-zinc-800 backdrop-blur-xl px-4 py-3 sm:py-4">
      <audio 
        ref={audioRef}
        src={track.audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={onNext}
      />
      
      <div className="container mx-auto flex items-center justify-between gap-4 sm:gap-8">
        {/* Track Info */}
        <div className="flex items-center gap-4 w-1/4 min-w-0">
          <img 
            src={track.coverUrl} 
            alt={track.title} 
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg object-cover shadow-lg flex-shrink-0"
          />
          <div className="min-w-0">
            <h4 className="font-bold text-sm sm:text-base truncate">{track.title}</h4>
            <p className="text-zinc-500 text-xs sm:text-sm truncate font-medium">{track.artist}</p>
          </div>
          <button className="text-zinc-500 hover:text-white flex-shrink-0 hidden sm:block">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>

        {/* Controls */}
        <div className="flex-1 flex flex-col items-center gap-2 max-w-2xl">
          <div className="flex items-center gap-4 sm:gap-6">
            <button onClick={onPrev} className="text-zinc-400 hover:text-white transition-colors">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 fill-current" viewBox="0 0 24 24">
                <path d="M6 6h2v12H6zm3.5 6L19 18V6z" />
              </svg>
            </button>
            <button 
              onClick={onPlayPause}
              className="w-10 h-10 sm:w-12 sm:h-12 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
            >
              {isPlaying ? (
                <svg className="w-5 h-5 sm:w-6 sm:h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6zm8 0h4v16h-4z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 sm:w-6 sm:h-6 fill-current translate-x-0.5" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>
            <button onClick={onNext} className="text-zinc-400 hover:text-white transition-colors">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 fill-current" viewBox="0 0 24 24">
                <path d="M6 18l8.5-6L6 6zM16 6v12h2V6z" />
              </svg>
            </button>
          </div>
          <div className="w-full flex items-center gap-3">
            <span className="text-[10px] sm:text-xs text-zinc-500 w-10 text-right">{formatTime(audioRef.current?.currentTime || 0)}</span>
            <div className="relative flex-1 group h-4 flex items-center">
              <input 
                type="range"
                value={progress}
                onChange={handleSeek}
                className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:h-1.5 transition-all"
              />
            </div>
            <span className="text-[10px] sm:text-xs text-zinc-500 w-10">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Volume & Extras */}
        <div className="w-1/4 hidden md:flex items-center justify-end gap-4">
          <div className="flex items-center gap-2 group">
            <svg className="w-5 h-5 text-zinc-500 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
            <input 
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setVolume(val);
                if (audioRef.current) audioRef.current.volume = val;
              }}
              className="w-20 h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>
          <a 
            href={track.audioUrl} 
            download={`${track.title}.mp3`}
            className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors text-zinc-400 hover:text-white"
            title="Download Demo"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
