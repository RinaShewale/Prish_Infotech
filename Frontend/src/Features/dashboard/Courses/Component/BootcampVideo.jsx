import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Volume2, VolumeX, Maximize } from "lucide-react";

// 👇 MEDIA HOOK
import { useMedia } from "../../Home/components/hooks/useMedia";

export default function BootcampVideo() {
  const { media } = useMedia(); // Removed 'loading' to show UI instantly
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false); // New state for smoothness
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef(null);
  const videoSource = media?.courseInfoVideo || media?.reelVideo;

  const togglePlay = async () => {
    const video = videoRef.current;
    if (!video || !videoSource) return;

    if (video.paused) {
      try {
        await video.play();
      } catch (err) {
        console.error("Playback failed", err);
      }
    } else {
      video.pause();
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const { currentTime: time, duration: videoDuration } = videoRef.current;
    setCurrentTime(time);
    if (videoDuration) {
      setProgress((time / videoDuration) * 100);
    }
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    if (videoRef.current && videoRef.current.duration) {
      videoRef.current.currentTime = percentage * videoRef.current.duration;
    }
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className="group relative max-w-5xl mx-auto aspect-video bg-black rounded-xl overflow-hidden border border-white/10 shadow-2xl ring-1 ring-white/5">
      
      {/* 🎥 VIDEO ELEMENT */}
      <video
        ref={videoRef}
        key={videoSource} // Crucial for smooth source switching
        src={videoSource} // Direct src is more stable than <source> tags
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onClick={togglePlay}
        onWaiting={() => setIsBuffering(true)}
        onPlaying={() => {
            setIsBuffering(false);
            setIsPlaying(true);
        }}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        className="w-full h-full object-contain cursor-pointer"
        playsInline
        preload="auto"
      />

      {/* 🛡️ OVERLAY: TOP BADGE */}
      <div className="absolute top-4 left-4 pointer-events-none z-20">
        <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
          <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-red-500 animate-pulse' : 'bg-white/40'}`} />
          <span className="text-[10px] font-bold text-white/90 uppercase tracking-tighter">
            Bootcamp Overview
          </span>
        </div>
      </div>

      {/* ▶ CENTER PLAY BUTTON */}
      <AnimatePresence>
        {!isPlaying && !isBuffering && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[1px] pointer-events-none z-10"
          >
            <motion.button 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="w-20 h-20 flex items-center justify-center rounded-full bg-white text-black shadow-2xl"
            >
              <Play fill="currentColor" size={32} className="ml-1" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🎛 CONTROL BAR */}
      <div className="absolute inset-x-0 bottom-0 p-6 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 bg-gradient-to-t from-black via-black/60 to-transparent z-30">
        
        {/* Seekable Progress Bar */}
        <div 
          className="group/progress w-full h-1.5 bg-white/20 rounded-full mb-6 cursor-pointer relative"
          onClick={handleSeek}
        >
          <motion.div
            className="absolute top-0 left-0 h-full bg-white rounded-full z-10"
            style={{ width: `${progress}%` }}
          />
          <div className="absolute top-0 left-0 w-full h-full bg-white/10 opacity-0 group-hover/progress:opacity-100 transition-opacity" />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button
              onClick={togglePlay}
              className="text-white hover:scale-110 transition-transform"
            >
              {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
            </button>

            {/* Time Display */}
            <div className="flex items-center gap-2 font-mono text-[11px] text-white/70">
              <span className="text-white">{formatTime(currentTime)}</span>
              <span className="opacity-30">/</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <button 
              onClick={() => {
                const newMuted = !isMuted;
                setIsMuted(newMuted);
                videoRef.current.muted = newMuted;
              }}
              className="text-white/60 hover:text-white transition-colors"
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
            
            <button
              onClick={() => videoRef.current?.requestFullscreen()}
              className="text-white/60 hover:text-white transition-colors"
            >
              <Maximize size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}