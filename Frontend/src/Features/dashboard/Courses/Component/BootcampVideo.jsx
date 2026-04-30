import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Volume2, Maximize, Square } from "lucide-react";

export default function BootcampVideo() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef(null);

  const togglePlay = () => {
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleTimeUpdate = () => {
    const currentProgress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
    setProgress(currentProgress);
  };

  return (
    <div className="group relative max-w-5xl mx-auto aspect-video bg-black rounded-xl overflow-hidden border border-white/10 shadow-2xl">
      {/* Video Element */}
      <video
        ref={videoRef}
        onTimeUpdate={handleTimeUpdate}
        onClick={togglePlay}
        className="w-full h-full object-cover cursor-pointer"
        poster="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2070"
      >
        <source src="your-video-url.mp4" type="video/mp4" />
      </video>

      {/* Large Center Play Button (Visible only when paused) */}
      <AnimatePresence>
        {!isPlaying && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px] pointer-events-none"
          >
            <button className="w-20 h-20 flex items-center justify-center rounded-full bg-white text-black shadow-2xl">
              <Play fill="currentColor" size={32} className="ml-1" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Control Bar Overlay */}
      <div className="absolute inset-x-0 bottom-0 p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
        
        {/* Progress Bar */}
        <div className="w-full h-1 bg-white/20 rounded-full mb-4 overflow-hidden">
          <motion.div 
            className="h-full bg-white" 
            style={{ width: `${progress}%` }} 
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={togglePlay} className="text-white hover:text-white/70 transition-colors">
              {isPlaying ? <Square size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
            </button>
            
            {/* Timestamp */}
            <span className="text-[10px] font-mono text-white/50 tracking-widest uppercase">
              {isPlaying ? "Live_Stream" : "Paused"}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Volume2 size={18} className="text-white/60 hover:text-white cursor-pointer transition-colors" />
            <Maximize 
              size={18} 
              className="text-white/60 hover:text-white cursor-pointer transition-colors"
              onClick={() => videoRef.current.requestFullscreen()}
            />
          </div>
        </div>
      </div>
    </div>
  );
}