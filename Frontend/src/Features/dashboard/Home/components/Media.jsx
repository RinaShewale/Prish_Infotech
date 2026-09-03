import { useEffect, useRef, useState } from "react";
import { useMedia } from "../../Home/components/hooks/useMedia";

export const Media = () => {
  const { media } = useMedia(); // Loading is no longer used to block the UI
  const reelVideoRef = useRef(null);
  const [failedReelVideo, setFailedReelVideo] = useState(null);

  useEffect(() => {
    // Ensuring the video plays if the browser allows autoplay
    if (reelVideoRef.current && media?.reelVideo) {
      reelVideoRef.current.play().catch(() => {});
    }
  }, [media?.reelVideo]);

  return (
    <section className="w-full h-[80vh] p-4 md:p-8 bg-bg font-sans">
      <div className="grid grid-cols-1 md:grid-cols-[0.8fr_1.2fr] lg:grid-cols-[1fr_1.5fr] gap-4 h-full max-w-7xl mx-auto">

        {/* 🎥 LEFT SIDE: VIDEO (REEL) */}
        <div className="md:row-span-2 glow-card glass rounded-3xl overflow-hidden group relative">
          <div className="absolute inset-0 bg-card">
            {media?.reelVideo && failedReelVideo !== media.reelVideo ? (
              <video
                ref={reelVideoRef}
                key={media.reelVideo} // Fixes "stuck" video by refreshing element on source change
                src={media.reelVideo}
                // Changed object-contain to object-cover to make it FULL
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90"
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                onError={() => setFailedReelVideo(media.reelVideo)}
              />
            ) : (
              <img
                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1000"
                className="w-full h-full object-cover opacity-80"
                alt="Fallback"
              />
            )}
            {/* GRADIENT OVERLAY */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80" />
          </div>

          <div className="relative z-10 h-full p-6 flex flex-col justify-between pointer-events-none">
            <span className="px-3 py-1 bg-accent/20 backdrop-blur-md border border-accent/30 text-accent text-xs font-display uppercase tracking-widest rounded-full w-fit">
              Prish Infotech
            </span>

            <div className="flex-grow"></div>

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
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-70" />
          <div className="relative z-10 p-6 h-full flex flex-col justify-end" />
        </div>

        {/* 🖼 RIGHT BOTTOM IMAGE */}
        <div className="glow-card glass rounded-3xl overflow-hidden relative group">
          <img
            src={media?.img2 || "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1000"}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90"
            alt="Tech 2"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-70" />
          <div className="relative z-10 p-6 w-full h-full flex flex-col justify-end" />
        </div>

      </div>
    </section>
  );
};