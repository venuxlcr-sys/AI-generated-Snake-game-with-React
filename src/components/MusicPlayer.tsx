
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, SkipForward, SkipBack, Music, Volume2, ListMusic } from 'lucide-react';
import { TRACKS } from '../constants';

export const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [showList, setShowList] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(() => setIsPlaying(false));
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const skipForward = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setProgress(0);
  };

  const skipBack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setProgress(0);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newProgress = parseFloat(e.target.value);
    setProgress(newProgress);
    if (audioRef.current) {
      audioRef.current.currentTime = (newProgress / 100) * audioRef.current.duration;
    }
  };

  return (
    <div className="w-full max-w-md glass rounded-3xl p-6 neon-border relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-neon-pink/10 blur-[100px] rounded-full" />
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-neon-blue/10 blur-[100px] rounded-full" />

      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={skipForward}
      />

      <div className="flex flex-col gap-6 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 glass rounded-lg border-white/5">
              <Music size={18} className="text-neon-pink" />
            </div>
            <div>
              <h3 className="text-sm font-orbitron font-bold tracking-tight">SYNTH_PLAYER v1.0</h3>
              <p className="text-[10px] text-white/40 uppercase tracking-widest font-medium">System Ready</p>
            </div>
          </div>
          <button 
            onClick={() => setShowList(!showList)}
            className={`p-2 transition-colors rounded-lg ${showList ? 'bg-neon-blue text-black' : 'hover:bg-white/5 text-white/60'}`}
          >
            <ListMusic size={18} />
          </button>
        </div>

        <div className="flex gap-6 items-center">
          <motion.div 
            key={currentTrack.id}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-32 h-32 rounded-2xl overflow-hidden neon-border shrink-0"
          >
            <img src={currentTrack.cover} alt={currentTrack.title} className="w-full h-full object-cover" />
          </motion.div>

          <div className="flex flex-col min-w-0">
            <h2 className="text-xl font-orbitron font-black truncate neon-text-pink leading-tight">
              {currentTrack.title}
            </h2>
            <p className="text-white/60 font-medium text-sm truncate mb-4">
              {currentTrack.artist}
            </p>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={skipBack}
                className="p-2 rounded-full hover:bg-white/5 text-white/80 transition-all hover:scale-110 active:scale-95"
              >
                <SkipBack size={20} fill="currentColor" />
              </button>
              <button 
                onClick={togglePlay}
                className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-[0_0_15px_rgba(255,255,255,0.3)]"
              >
                {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} className="ml-1" fill="currentColor" />}
              </button>
              <button 
                onClick={skipForward}
                className="p-2 rounded-full hover:bg-white/5 text-white/80 transition-all hover:scale-110 active:scale-95"
              >
                <SkipForward size={20} fill="currentColor" />
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <input
            type="range"
            min="0"
            max="100"
            step="0.1"
            value={progress}
            onChange={handleProgressChange}
            className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-neon-blue"
          />
          <div className="flex justify-between text-[10px] font-orbitron text-white/40 tracking-widest">
            <span>0{Math.floor((audioRef.current?.currentTime || 0) / 60)}:{Math.floor((audioRef.current?.currentTime || 0) % 60).toString().padStart(2, '0')}</span>
            <span>{currentTrack.duration}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 px-4 py-3 glass rounded-2xl border-white/5">
          <Volume2 size={16} className="text-white/40" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="flex-1 h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-neon-pink"
          />
        </div>

        <AnimatePresence>
          {showList && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-4 border-t border-white/5 space-y-2">
                {TRACKS.map((track, idx) => (
                  <button
                    key={track.id}
                    onClick={() => {
                      setCurrentTrackIndex(idx);
                      setIsPlaying(true);
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                      idx === currentTrackIndex ? 'bg-neon-blue/10 text-neon-blue' : 'hover:bg-white/5 text-white/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-orbitron opacity-40">0{idx + 1}</span>
                      <div className="text-left">
                        <div className="text-xs font-bold font-orbitron">{track.title}</div>
                        <div className="text-[10px] opacity-60 leading-none">{track.artist}</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-orbitron opacity-40">{track.duration}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
