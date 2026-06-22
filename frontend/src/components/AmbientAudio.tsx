import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

// Using a high-quality, professionally mixed luxury lounge/deep house track
// You can replace this URL with any local file (e.g., '/assets/premium-lounge.mp3')
const PREMIUM_TRACK_URL = "https://cdn.pixabay.com/download/audio/2022/05/16/audio_dbdd365bc9.mp3?filename=deep-house-114389.mp3";

export default function AmbientAudio() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [volume, setVolume] = useState(0.4); // Start at a sophisticated, non-intrusive volume
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize the audio element once
  useEffect(() => {
    const audio = new Audio(PREMIUM_TRACK_URL);
    audio.loop = true;
    audio.volume = volume;
    // Preload audio for seamless playback
    audio.preload = "auto";
    
    // Add a gentle fade-in effect on play
    audio.addEventListener('play', () => {
        audio.volume = 0;
        let vol = 0;
        const fadeInterval = setInterval(() => {
            if (vol < volume) {
                vol += 0.05;
                audio.volume = Math.min(vol, volume);
            } else {
                clearInterval(fadeInterval);
            }
        }, 100);
    });

    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.removeAttribute('src');
      audio.load();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync volume slider with actual audio volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      // Gentle fade out before pausing
      let vol = volume;
      const fadeInterval = setInterval(() => {
          if (vol > 0.05) {
              vol -= 0.05;
              audioRef.current!.volume = vol;
          } else {
              clearInterval(fadeInterval);
              audioRef.current?.pause();
              setIsPlaying(false);
          }
      }, 50);
    } else {
      audioRef.current.play().catch(e => console.error("Audio playback failed:", e));
      setIsPlaying(true);
      setHasInteracted(true);
    }
  };

  // Attempt to play on first interaction (required by modern browsers for audio playback)
  useEffect(() => {
    const handleFirstInteraction = () => {
      if (!hasInteracted && audioRef.current && !isPlaying) {
        audioRef.current.play().then(() => {
            setIsPlaying(true);
            setHasInteracted(true);
        }).catch(() => {
            // Autoplay blocked, wait for manual click
        });
      }
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
    };

    document.addEventListener('click', handleFirstInteraction);
    document.addEventListener('keydown', handleFirstInteraction);
    
    return () => {
        document.removeEventListener('click', handleFirstInteraction);
        document.removeEventListener('keydown', handleFirstInteraction);
    };
  }, [hasInteracted, isPlaying]);

  return (
    <div className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-[100] flex items-center gap-3 group">
      <AnimatePresence>
        {isPlaying && (
          <motion.div 
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             exit={{ opacity: 0, x: 20 }}
             className="hidden md:flex items-center gap-3 bg-paper-white/90 backdrop-blur-md border border-gallery-gold/20 px-4 py-2 shadow-sm pointer-events-auto"
          >
            <div className="flex items-center gap-1">
                {/* Visualizer bars that pulse gently */}
                {[1, 2, 3].map((i) => (
                    <motion.div 
                      key={i}
                      className="w-1 bg-gallery-gold rounded-t-sm"
                      animate={{ height: ['4px', `${8 + i * 4}px`, '4px'] }}
                      transition={{ 
                          duration: 0.8, 
                          repeat: Infinity, 
                          delay: i * 0.2,
                          ease: "easeInOut" 
                      }}
                      style={{ transformOrigin: 'bottom' }}
                    />
                ))}
            </div>
            <span className="font-label-caps text-[9px] uppercase tracking-[0.2em] text-primary/60 pr-2 border-r border-gallery-gold/20">PREMIUM AUDIO</span>
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.05" 
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              aria-label="Volume Control"
              className="w-16 h-0.5 bg-gallery-gold/30 appearance-none outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:bg-gallery-gold [&::-webkit-slider-thumb]:rounded-full cursor-pointer"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <button 
        onClick={togglePlay}
        className="w-10 h-10 md:w-12 md:h-12 bg-paper-white/90 backdrop-blur-md border border-gallery-gold/20 flex items-center justify-center text-primary group-hover:text-gallery-gold transition-colors shadow-[0_4px_15px_rgba(212,175,55,0.1)] pointer-events-auto relative overflow-hidden"
        aria-label={isPlaying ? "Mute Ambience" : "Play Ambience"}
      >
        <span className="material-symbols-outlined text-[16px] md:text-[18px] relative z-10 transition-transform duration-300">
          {isPlaying ? 'volume_up' : 'volume_off'}
        </span>
      </button>
    </div>
  );
}
