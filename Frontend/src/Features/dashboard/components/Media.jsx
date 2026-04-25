import React from 'react';
import { Play } from 'lucide-react'; // Optional: npm i lucide-react

export const Media = () => {
  return (
    <section className="w-full h-[80vh] p-4 md:p-8 bg-bg font-sans">
      <div className="grid grid-cols-1 md:grid-cols-[0.8fr_1.2fr] lg:grid-cols-[1fr_1.5fr] gap-4 h-full max-w-7xl mx-auto">
        
        {/* LEFT SIDE: REELS (Large Vertical Div) */}
        <div className="md:row-span-2 glow-card glass rounded-3xl overflow-hidden group relative">
          <div className="noise-bg" />
          
          {/* Reel Content Placeholder (Video or Image) */}
          <div className="absolute inset-0 bg-card">
            <img 
              src="https://images.unsplash.com/photo-1621600411688-4be93cd68504?q=80&w=1000" 
              alt="Reel content"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80"
            />
            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-linear-to-t from-bg via-transparent to-transparent opacity-60" />
          </div>

          {/* Reel UI Elements */}
          <div className="relative z-10 h-full p-6 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <span className="px-3 py-1 bg-accent/20 backdrop-blur-md border border-accent/30 text-accent text-xs font-display uppercase tracking-widest rounded-full">
                Reels
              </span>
            </div>
            
            <div className="flex flex-col items-center justify-center">
               <div className="w-16 h-16 rounded-full glass flex items-center justify-center border-accent/40 group-hover:scale-110 transition-transform">
                  <Play className="text-text fill-text ml-1" size={24} />
               </div>
            </div>

            <div>
              <h2 className="text-2xl font-display font-semibold text-text mb-1">Cinematic Series</h2>
              <p className="text-text-secondary text-sm">@creative_studio • 0:15</p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: TOP IMAGE */}
        <div className="glow-card glass rounded-3xl overflow-hidden relative group">
          <div className="noise-bg" />
          <img 
            src="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1000" 
            alt="Photography 1"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-70"
          />
          <div className="relative z-10 p-6 h-full flex flex-col justify-end">
             <p className="text-accent font-display text-xs uppercase tracking-tighter">Photography / 01</p>
          </div>
        </div>

        {/* RIGHT SIDE: BOTTOM IMAGE */}
        <div className="glow-card glass rounded-3xl overflow-hidden relative group">
          <div className="noise-bg" />
          <img 
            src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000" 
            alt="Photography 2"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-70"
          />
          <div className="relative z-10 p-6 w-full h-full flex flex-col justify-end">
             <p className="text-accent font-display text-xs uppercase tracking-tighter">Photography / 02</p>
          </div>
        </div>

      </div>
    </section>
  );
};