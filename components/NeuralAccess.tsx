
import React, { useState, useEffect } from 'react';

interface NeuralAccessProps {
  onClose: () => void;
  onSubmit: (key: string) => void;
}

export default function NeuralAccess({ onClose, onSubmit }: NeuralAccessProps) {
  const [key, setKey] = useState('');
  const [status, setStatus] = useState<'idle' | 'scanning' | 'success' | 'denied'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('scanning');
    
    // Removed artificial delay for instant access as requested
    onSubmit(key);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black backdrop-blur-3xl" />
      
      {/* Scanline Effect Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />

      <div className="relative w-full max-w-xl bg-black border border-emerald-500/20 rounded-[3rem] p-12 lg:p-20 shadow-[0_0_100px_rgba(16,185,129,0.05)] text-center">
        <div className="mb-12 flex justify-center">
          <div className="w-24 h-24 rounded-full border-2 border-emerald-500 flex items-center justify-center animate-pulse shadow-[0_0_40px_rgba(16,185,129,0.2)]">
            <svg className="w-12 h-12 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09m15.802-1.222a10.042 10.042 0 01-1.397 1.222m-13.92-10.434c1.744-2.772 4.79-4.546 8.24-4.546 3.517 0 6.518 1.83 8.24 4.546m-16.48 0A10.003 10.003 0 0112 3c4.545 0 8.288 3.03 9.427 7.152" />
            </svg>
          </div>
        </div>

        <div className="space-y-4 mb-12">
          <h2 className="text-4xl font-black tracking-tighter text-emerald-500 uppercase">Neural Access Protocol</h2>
          <p className="text-zinc-600 font-mono text-xs uppercase tracking-[0.3em]">Identity Verification Required</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="relative">
            <input 
              autoFocus
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className="w-full bg-emerald-500/5 border border-emerald-500/20 rounded-2xl px-8 py-6 text-center text-2xl font-mono text-emerald-400 placeholder:text-emerald-900/40 outline-none focus:border-emerald-500/50 transition-all shadow-[inset_0_0_20px_rgba(16,185,129,0.05)]"
              placeholder="••••••••••••"
            />
            {status === 'scanning' && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-2xl animate-pulse">
                <span className="text-emerald-500 font-mono text-xs tracking-[0.5em] uppercase">Authenticating...</span>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4">
            <button 
              type="submit"
              disabled={status === 'scanning'}
              className="w-full bg-emerald-600 text-black py-6 rounded-2xl font-black text-lg uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-[0_10px_40px_rgba(16,185,129,0.2)] disabled:opacity-50"
            >
              Initiate Uplink
            </button>
            <button 
              type="button"
              onClick={onClose}
              className="text-zinc-600 hover:text-emerald-500/50 transition-colors font-mono text-[10px] uppercase tracking-widest"
            >
              Terminate Session
            </button>
          </div>
        </form>

        <div className="mt-16 pt-12 border-t border-emerald-500/10 flex flex-col gap-2">
          <p className="text-zinc-800 font-mono text-[8px] uppercase tracking-[0.4em]">Unauthorized Access attempts are logged in bio-metrics database.</p>
          <p className="text-zinc-900 font-mono text-[8px] uppercase tracking-[0.4em]">Session ID: {Math.random().toString(36).substring(2, 15).toUpperCase()}</p>
        </div>
      </div>
    </div>
  );
}
