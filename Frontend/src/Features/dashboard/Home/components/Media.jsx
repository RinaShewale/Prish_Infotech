import { useEffect, useRef, useState, useMemo } from "react";
import { useMedia } from "../../Home/components/hooks/useMedia";

export const Media = () => {
  const { media } = useMedia();
  const reelVideoRef = useRef(null);
  const [failedReelVideo, setFailedReelVideo] = useState(null);

  // Memoize the video URL to prevent unnecessary re-renders
  const videoSrc = useMemo(() => media?.reelVideo, [media?.reelVideo]);

  useEffect(() => {
    const playVideo = async () => {
      if (reelVideoRef.current && videoSrc && failedReelVideo !== videoSrc) {
        try {
          // Explicitly trigger play to handle browser nuances
          await reelVideoRef.current.play();
        } catch (err) {
          console.warn("Autoplay was prevented or video failed:", err);
        }
      }
    };
    playVideo();
  }, [videoSrc, failedReelVideo]);

  return (
    <section className="w-full h-[80vh] p-4 md:p-8 bg-bg font-sans">
      <div className="grid grid-cols-1 md:grid-cols-[0.8fr_1.2fr] lg:grid-cols-[1fr_1.5fr] gap-4 h-full max-w-7xl mx-auto">
        
        {/* 🎥 LEFT SIDE: VIDEO (REEL) */}
        <div className="md:row-span-2 glow-card glass rounded-3xl overflow-hidden group relative bg-black">
          <div className="absolute inset-0">
            {videoSrc && failedReelVideo !== videoSrc ? (
              <video
                ref={reelVideoRef}
                key={videoSrc} // Critical: Only re-mounts if the URL actually changes
                autoPlay
                muted
                loop
                playsInline
                disablePictureInPicture
                preload="auto"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 transform-gpu"
                style={{ 
                  backfaceVisibility: "hidden", 
                  WebkitBackfaceVisibility: "hidden" 
                }}
                onError={() => setFailedReelVideo(videoSrc)}
              >
                <source src={videoSrc} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <img
                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1000"
                className="w-full h-full object-cover opacity-80"
                alt="Fallback"
              />
            )}
            {/* GRADIENT OVERLAY */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 pointer-events-none" />
          </div>

          <div className="relative z-10 h-full p-6 flex flex-col justify-between pointer-events-none">
            <span className="px-3 py-1 bg-accent/20 backdrop-blur-md border border-accent/30 text-accent text-xs font-display uppercase tracking-widest rounded-full w-fit">
              Prish Infotech
            </span>

            <div>
              <h2 className="text-3xl font-display font-bold text-white mb-1 uppercase tracking-tight drop-shadow-md">
                Start Learning
              </h2>
              <p className="text-gray-200 text-sm drop-shadow-sm">
                Elevate your skills with Prish Infotech
              </p>
            </div>
          </div>
        </div>

        {/* 🖼 RIGHT TOP IMAGE */}
        <div className="glow-card glass rounded-3xl overflow-hidden relative group">
          <img
            src={media?.img1 || "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000"}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90"
            alt="Tech 1"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-70 pointer-events-none" />
        </div>

        {/* 🖼 RIGHT BOTTOM IMAGE */}
        <div className="glow-card glass rounded-3xl overflow-hidden relative group">
          <img
            src={media?.img2 || "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1000"}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90"
            alt="Tech 2"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-70 pointer-events-none" />
        </div>

      </div>
    </section>
  );
};