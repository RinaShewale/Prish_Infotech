import React from 'react';
import { CheckCircle } from 'lucide-react';

const CertificateCard = React.forwardRef(
  (
    {
      displayCourseName,
      displayUserName,
      displayDate,
      skillsLearned,
      isPreview = false,
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        id="certificate-capture-area"
        className={`relative shadow-2xl text-black flex flex-col justify-between ${
          isPreview
            ? "rounded-[24px] md:rounded-[40px] p-6 sm:p-10 md:p-12"
            : "p-16"
        }`}
        style={{
          width: isPreview ? "100%" : "1120px",
          height: isPreview ? "100%" : "790px",
          backgroundColor: "#FDFDFD",
          color: "black",
          fontFamily: "serif",
          WebkitFontSmoothing: "antialiased",
        }}
      >
        {/* Ribbon */}
        <div className="absolute top-0 right-6 sm:right-12 w-8 sm:w-12 h-14 sm:h-20 bg-indigo-600 shadow-lg flex items-center justify-center rounded-b-lg z-10">
          <div className="w-5 h-5 sm:w-8 sm:h-8 rounded-full bg-yellow-400 border-2 sm:border-4 border-white/20 flex items-center justify-center">
            <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-indigo-900" />
          </div>
        </div>

        {/* Brand Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-black rounded-lg md:rounded-xl flex items-center justify-center text-white font-black text-xl md:text-2xl">
            P
          </div>

          <div>
            <h4 className="text-[10px] md:text-xs font-black tracking-tighter uppercase leading-none">
              Prish <span className="text-gray-400 font-medium">Infotech</span>
            </h4>
            <p className="text-[7px] md:text-[8px] tracking-[0.2em] font-bold text-gray-400 uppercase mt-1">
              Engineering League
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="space-y-4 md:space-y-6">
          <p className="text-[8px] md:text-[10px] tracking-[0.2em] md:tracking-[0.3em] font-bold text-gray-400 uppercase">
            Certificate of Completion
          </p>

          <h3 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-none mb-2 md:mb-4">
            {displayCourseName}
          </h3>

          <div className="py-2 md:py-4">
            <p className="text-[8px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 md:mb-2">
              This honor is presented to
            </p>

            <p className="text-2xl sm:text-4xl md:text-5xl font-serif italic text-black break-words">
              {displayUserName}
            </p>

            <div className="w-full h-px bg-gray-200 mt-3 md:mt-4" />
          </div>

          <p className="text-[11px] md:text-sm text-gray-600 leading-relaxed max-w-md">
            For successfully demonstrating expert-level proficiency in
            <span className="font-bold text-black"> {skillsLearned}</span> during
            the 2025 Prish Incubator program.
          </p>
        </div>

        {/* Footer */}
        <div className="mt-8 flex flex-row justify-between items-end gap-4">
          <div>
            <p className="text-xs md:text-lg font-bold mb-0.5 md:mb-1 uppercase text-black">
              {displayDate}
            </p>
            <p className="text-[7px] md:text-[8px] font-bold text-gray-400 uppercase tracking-widest">
              Issue Date
            </p>
          </div>

          <div className="text-right">
            <p className="text-xl md:text-3xl font-serif italic text-black mb-0.5 md:mb-1 tracking-tighter leading-none">
              Adarsh Gupta
            </p>
            <div className="w-20 md:w-32 h-px bg-gray-200 ml-auto mb-1 md:mb-2" />
            <p className="text-[7px] md:text-[9px] font-black text-black uppercase">
              Program Director
            </p>
          </div>
        </div>
      </div>
    );
  }
);

CertificateCard.displayName = "CertificateCard";

export default CertificateCard;