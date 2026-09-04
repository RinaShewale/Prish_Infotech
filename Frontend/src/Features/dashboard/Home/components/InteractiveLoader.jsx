import React, { useEffect, useRef } from "react";
import gsap from "gsap";

export default function InteractiveLoader({ onComplete }) {
  const containerRef = useRef(null);
  const pPathRef = useRef(null);
  const iPathRef = useRef(null);
  const textRef = useRef(null);
  const glowRef = useRef(null);
  const svgRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Initial Setup: Hide everything immediately to prevent glitches
      const pLength = pPathRef.current.getTotalLength();
      const iLength = iPathRef.current.getTotalLength();

      gsap.set([pPathRef.current, iPathRef.current], {
        strokeDasharray: (i) => i === 0 ? pLength : iLength,
        strokeDashoffset: (i) => i === 0 ? pLength : iLength,
        opacity: 1,
      });

      // Now that paths are "erased", make the SVG visible
      gsap.set(svgRef.current, { visibility: "visible" });

      const tl = gsap.timeline({
        onComplete: () => {
          gsap.to(containerRef.current, {
            opacity: 0,
            duration: 0.8,
            ease: "power2.inOut",
            onComplete: onComplete,
          });
        },
      });

      // 2. Animation Sequence
      tl.to(pPathRef.current, {
        strokeDashoffset: 0,
        duration: 1.5,
        ease: "power2.inOut",
      })
      .to(iPathRef.current, {
        strokeDashoffset: 0,
        duration: 0.8,
        ease: "power2.inOut",
      }, "-=0.2")
      
      .to([pPathRef.current, iPathRef.current], {
        stroke: "#926868", // accent color
        filter: "drop-shadow(0 0 8px rgba(146, 104, 104, 0.8))",
        duration: 0.5,
      })
      .to(glowRef.current, {
        opacity: 0.3,
        scale: 1.2,
        duration: 1,
        repeat: 1,
        yoyo: true,
      }, "-=0.5")

      .to(textRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "back.out(1.7)",
      }, "-=0.3")

      .to({}, { duration: 1 }); 
    });

    return () => ctx.revert();
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-bg"
    >
      <div className="noise-bg" />
      
      <div 
        ref={glowRef}
        className="absolute w-64 h-64 bg-accent/20 rounded-full blur-[100px] opacity-0 pointer-events-none" 
      />

      <div className="relative flex flex-col items-center">
        <svg
          ref={svgRef}
          width="160"
          height="160"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-2xl"
          style={{ visibility: "hidden" }} // Prevents initial flash glitch
        >
          <path
            ref={pPathRef}
            d="M30 75V25C30 25 65 25 65 42.5C65 60 30 60 30 60"
            stroke="#ebdfdc"
            strokeWidth="6"
            strokeLinecap="square"
          />
          <path
            ref={iPathRef}
            d="M75 25V75"
            stroke="#ebdfdc"
            strokeWidth="6"
            strokeLinecap="square"
          />
        </svg>

        <div 
          ref={textRef}
          className="mt-8 overflow-hidden opacity-0 translate-y-4"
        >
          <h1 className="font-display text-xl tracking-[0.3em] text-text uppercase">
            Prish <span className="italic font-serif text-accent">Infotech</span>
          </h1>
          <div className="h-[1px] w-full bg-linear-to-r from-transparent via-border to-transparent mt-2" />
        </div>
      </div>
    </div>
  );
}