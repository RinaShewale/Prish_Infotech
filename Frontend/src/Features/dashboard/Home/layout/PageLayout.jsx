import React from 'react';

const PageLayout = ({ title, subtitle, children }) => {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#ebdfdc] font-sans selection:bg-accent selection:text-black flex flex-col justify-center">
      {/* Noise Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-50 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      
      <div className="max-w-6xl mx-auto w-full px-8 py-16">
        <header className="mb-16 border-b border-white/10 pb-8">
          <h4 className="text-accent text-[10px] font-bold tracking-[0.3em] uppercase mb-3">
            {subtitle || "Prish Infotech"}
          </h4>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight uppercase font-display">
            {title}
          </h1>
        </header>
        
        <main className="prose prose-invert prose-sm max-w-none">
          {children}
        </main>
      </div>
    </div>
  );
};

export default PageLayout;