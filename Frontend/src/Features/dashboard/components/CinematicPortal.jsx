import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Lenis from "@studio-freight/lenis"; // Using the specific package requested

gsap.registerPlugin(ScrollTrigger);

const courses = [
  {
    id: 1,
    title: "Cinematic Lighting",
    image: "https://images.unsplash.com/photo-1768836180167-6d4a25c421b2?w=1200&auto=format&fit=crop&q=80",
    description: "Sit back and enjoy. Breathtaking views come standard with every seat.",
  },
  {
    id: 2,
    title: "Urban Architecture",
    image: "https://images.unsplash.com/photo-1775896194071-f3311de4dabb?w=1200&auto=format&fit=crop&q=80",
    description: "Discover the geometry of modern cityscapes through a new lens.",
  },
  {
    id: 3,
    title: "Aerial Perspective",
    image: "https://images.unsplash.com/photo-1761839259488-2bdeeae794f5?q=80&w=1200&auto=format&fit=crop",
    description: "A new way to look at the world from above with total clarity.",
  },
];

export default function CinematicPortal() {
  const containerRef = useRef(null);
  const word1Ref = useRef(null);
  const plusRef = useRef(null);
  const word2Ref = useRef(null);
  const cardsRef = useRef([]);
  const textRefs = useRef([]);

  // 1. SILKY SMOOTH SCROLL INITIALIZATION
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4, // Smoothness "weight"
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
    });

    // Synchronize Lenis with GSAP's Ticker for frame-perfect motion
    function update(time) {
      lenis.raf(time * 1000);
    }
    
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(update);
      lenis.destroy();
    };
  }, []);

  useGSAP(() => {
    const cards = cardsRef.current;
    const texts = textRefs.current;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=1100%", // Long scroll duration for cinematic feel
        scrub: 1.8,    // High scrub value creates that "liquid" follow effect
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    // Optimization: Force GPU for elements that will scale/blur
    gsap.set([word1Ref.current, word2Ref.current, plusRef.current], {
      transformPerspective: 1000,
      willChange: "transform, opacity, filter",
      backfaceVisibility: "hidden"
    });
    
    gsap.set(cards, { 
      opacity: 0, 
      scale: 0.85, 
      yPercent: 30, 
      force3D: true, 
      willChange: "transform, opacity" 
    });
    
    gsap.set(texts, { autoAlpha: 0, x: 40 });

    // 1. TEXT ZOOM ANIMATION
    tl.to([word1Ref.current, word2Ref.current, plusRef.current], {
      z: 1500,
      scale: 12,
      opacity: 0,
      filter: "blur(15px)",
      stagger: {
        amount: 0.2,
        ease: "power2.inOut"
      },
      ease: "power2.inOut",
      force3D: true,
      duration: 3
    });

    // 2. CARD SEQUENCE (Integrated for max smoothness)
    courses.forEach((_, index) => {
      // Entrance: Blending the start slightly with the zoom out (-=1.0)
      tl.to(cards[index], {
        opacity: 1,
        scale: 1,
        yPercent: 0,
        duration: 2.5,
        ease: "power2.out"
      }, "-=1.0")
      .to(texts[index], {
        autoAlpha: 1,
        x: 0,
        duration: 2,
        ease: "power2.out"
      }, "-=2");

      // Hold time for user to read
      tl.to({}, { duration: 3 });

      // Exit (Transition to next)
      if (index < courses.length - 1) {
        tl.to(cards[index], {
          xPercent: -130,
          yPercent: -100,
          scale: 0.2,
          opacity: 0,
          duration: 3,
          ease: "power2.inOut",
        })
        .to(texts[index], {
          autoAlpha: 0,
          x: -40,
          duration: 2,
          ease: "power2.in"
        }, "-=3");
      }
    });

    // Background Glow expansion
    tl.to(".ambient-glow", {
      scale: 2.5,
      opacity: 0.5,
      ease: "power2.inOut"
    }, 0);

  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="relative w-full h-screen overflow-hidden bg-bg" style={{ perspective: "1200px" }}>
      {/* 1. ZOOMING TEXT LAYER */}
      <div className="absolute inset-0 z-[100] flex items-center justify-center pointer-events-none">
        <div className="relative flex flex-row items-center justify-center gap-6 md:gap-16 whitespace-nowrap px-4" style={{ transformStyle: "preserve-3d" }}>
          <h1 ref={word1Ref} className="font-display text-5xl md:text-[9vw] text-text font-bold tracking-tighter select-none">LEARN</h1>
          <span ref={plusRef} className="font-display text-5xl md:text-[9vw] text-accent font-light select-none">BUILD</span>
          <h1 ref={word2Ref} className="font-display text-5xl md:text-[9vw] text-text font-bold tracking-tighter select-none">GROW</h1>
        </div>
      </div>

      {/* 2. CARD INTERACTIVE LAYER */}
      <div className="relative h-full w-full flex items-center justify-center px-10 z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center w-full max-w-7xl">
          
          <div className="md:col-span-7 relative aspect-[4/5] md:aspect-video flex items-center justify-center">
            {courses.map((course, index) => (
              <div
                key={course.id}
                ref={(el) => (cardsRef.current[index] = el)}
                className="absolute inset-0 overflow-hidden rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-border/50"
                style={{ zIndex: 10 - index }}
              >
                <img src={course.image} alt={course.title} className="h-full w-full object-cover" />
                <div className="absolute top-8 left-8 text-text font-bold bg-bg/40 px-5 py-2 rounded-full backdrop-blur-md border border-border/50">
                  0{index + 1}
                </div>
              </div>
            ))}
          </div>

          <div className="md:col-span-5 relative h-80 flex flex-col justify-center z-[110]">
            {courses.map((course, index) => (
              <div key={index} ref={(el) => (textRefs.current[index] = el)} className="absolute inset-0 flex flex-col justify-center">
                <h2 className="font-display text-4xl md:text-6xl font-bold text-text mb-6 leading-tight uppercase">
                    {course.title}
                </h2>
                <p className="font-sans text-lg text-text-secondary mb-10 leading-relaxed max-w-md">
                    {course.description}
                </p>
                <button className="w-fit border-b-2 border-accent pb-1 font-display font-bold text-sm text-text hover:text-accent transition-colors pointer-events-auto">
                  DISCOVER THE EXPERIENCE
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ambient Visuals */}
      <div className="ambient-glow absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-accent/15 rounded-full blur-[140px]" />
      </div>
      <div className="noise-bg absolute inset-0 z-[60] opacity-40 pointer-events-none" />
    </div>
  );
}