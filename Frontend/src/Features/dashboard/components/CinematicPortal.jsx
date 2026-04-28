import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Lenis from "@studio-freight/lenis";
import { Clock, BadgeCheck, PhoneCall, ArrowRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const courses = [
  {
    id: 1,
    title: "Java Programming Mastery: Core Java + OOP + DSA",
    image: "https://images.unsplash.com/photo-1768836180167-6d4a25c421b2?w=1200&auto=format&fit=crop&q=80",
    description: "Master Java programming from basics to advanced, learn OOP concepts, solve DSA problems, and build real-world projects for strong fundamentals.",
    duration: "4-5 Months",
    certified: "Yes Certified",
    support: "24/7 Mentor Support",
    price: "6999",
    oldPrice: "13998"
  },
  {
    id: 2,
    title: "Full Stack Mastery: Modern Web Systems & Architecture",
    image: "https://images.unsplash.com/photo-1775896194071-f3311de4dabb?w=1200&auto=format&fit=crop&q=80",
    description: "Build complete web applications using React, Node.js, and MongoDB with modern development practices.",
    duration: "6 Months",
    certified: "Yes Certified",
    support: "24/7 Mentor Support",
    price: "7499",
    oldPrice: "14998"
  },
  {
    id: 3,
    title: "Data Science & Gen-AI: From Zero to Deployment",
    image: "https://images.unsplash.com/photo-1761839259488-2bdeeae794f5?q=80&w=1200&auto=format&fit=crop",
    description: "Explore data analysis, visualization, and machine learning using Python and real-world datasets.",
    duration: "8 Months",
    certified: "Yes Certified",
    support: "24/7 Mentor Support",
    price: "9999",
    oldPrice: "19998"
  },
];

export default function CinematicPortal() {
  const containerRef = useRef(null);
  const word1Ref = useRef(null);
  const plusRef = useRef(null);
  const word2Ref = useRef(null);
  const cardsRef = useRef([]);
  const textRefs = useRef([]);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      smooth: true,
    });
    function update(time) { lenis.raf(time * 1000); }
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
        end: "+=1100%",
        scrub: 1.8,
        pin: true,
        anticipatePin: 1,
      },
    });

    gsap.set([word1Ref.current, word2Ref.current, plusRef.current], {
      transformPerspective: 1000,
      willChange: "transform, opacity",
    });

    gsap.set(cards, { opacity: 0, scale: 0.85, yPercent: 30 });
    gsap.set(texts, { autoAlpha: 0, x: 40 });

    tl.to([word1Ref.current, plusRef.current, word2Ref.current], {
      z: 1500, scale: 15, opacity: 0, filter: "blur(20px)",
      stagger: 0.1, ease: "power2.inOut", duration: 3
    });

    courses.forEach((_, index) => {
      tl.to(cards[index], {
        opacity: 1, scale: 1, yPercent: 0,
        duration: 2.5, ease: "power2.out"
      }, "-=1.5")
        .to(texts[index], {
          autoAlpha: 1, x: 0,
          duration: 2, ease: "power2.out"
        }, "-=2");

      tl.to({}, { duration: 3 });

      if (index < courses.length - 1) {
        tl.to(cards[index], {
          xPercent: -130, scale: 0.5, opacity: 0,
          duration: 3, ease: "power2.inOut",
        })
          .to(texts[index], {
            autoAlpha: 0, x: -40,
            duration: 2, ease: "power2.in"
          }, "-=3");
      }
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="relative w-full h-screen overflow-hidden bg-bg" style={{ perspective: "1200px" }}>
      <div className="noise-bg" />

      {/* 1. ZOOMING TEXT LAYER */}
      <div className="absolute inset-0 z-[20] flex items-center justify-center pointer-events-none">
        <div className="relative flex flex-col md:flex-row items-center justify-center gap-4 md:gap-16 whitespace-nowrap px-4" style={{ transformStyle: "preserve-3d" }}>
          <h1 ref={word1Ref} className="font-display text-6xl md:text-[9vw] text-text font-bold tracking-tighter select-none uppercase">Learn</h1>
          <span ref={plusRef} className="font-display text-5xl md:text-[9vw] text-accent font-light select-none uppercase">Build</span>
          <h1 ref={word2Ref} className="font-display text-6xl md:text-[9vw] text-text font-bold tracking-tighter select-none uppercase">Grow</h1>
        </div>
      </div>

      {/* 2. CONTENT LAYER */}
      <div className="relative h-full w-full flex items-center justify-center px-6 md:px-10 z-[50]">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-center w-full max-w-7xl">

          {/* Card Container */}
          <div className="md:col-span-6 relative aspect-[4/5] md:aspect-video flex items-center justify-center w-full max-h-[40vh] md:max-h-none">
            {courses.map((course, index) => (
              <div
                key={course.id}
                ref={(el) => (cardsRef.current[index] = el)}
                className="absolute inset-0 overflow-hidden rounded-[32px] shadow-[0_40px_80px_rgba(0,0,0,0.6)] border border-border/50"
                style={{ zIndex: 10 - index }}
              >
                <img src={course.image} alt={course.title} className="h-full w-full object-cover" />
                <div className="absolute inset-0 gloss-overlay pointer-events-none" />
              </div>
            ))}
          </div>

          {/* Text Container */}
          <div className="md:col-span-6 relative h-[520px] flex flex-col justify-center">
            {courses.map((course, index) => (
              <div key={index} ref={(el) => (textRefs.current[index] = el)} className="absolute inset-0 flex flex-col justify-center text-left items-start">

                {/* Title - FONT BOLD REMOVED */}
                <h2 className="font-display text-2xl md:text-[2.75rem] font-medium text-text mb-4 leading-[1.15] tracking-tight">
                  {course.title}
                </h2>

                <p className="font-sans text-sm md:text-base text-text-secondary mb-8 leading-relaxed max-w-lg">
                  {course.description}
                </p>

                {/* Info Badges */}
                <div className="flex flex-wrap gap-6 mb-10">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-accent/10 text-accent"><Clock size={20} /></div>
                    <div className="flex flex-col"><span className="text-sm font-bold text-text leading-none">{course.duration.split(' ')[0]}</span><span className="text-[10px] uppercase tracking-wider text-text-secondary font-medium">Months</span></div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-accent/10 text-accent"><BadgeCheck size={20} /></div>
                    <div className="flex flex-col"><span className="text-sm font-bold text-text leading-none">Yes</span><span className="text-[10px] uppercase tracking-wider text-text-secondary font-medium">Certified</span></div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-accent/10 text-accent"><PhoneCall size={20} /></div>
                    <div className="flex flex-col"><span className="text-sm font-bold text-text leading-none">24/7</span><span className="text-[10px] uppercase tracking-wider text-text-secondary font-medium">Mentor Support</span></div>
                  </div>
                </div>

                {/* Price Labeling */}
                <div className="flex items-baseline gap-2 mb-8">
                  <span className="text-3xl font-medium text-text">Price</span>
                  <span className="text-4xl font-bold text-accent">Rs.{course.price}</span>
                  <span className="text-sm text-text-secondary/60 line-through">Rs.{course.oldPrice}</span>
                  <span className="text-sm text-text-secondary/60">(+GST)</span>
                </div>

                <button className="group flex items-center gap-3 bg-accent text-[#131014] px-8 py-4 rounded-xl font-display font-bold text-sm transition-all hover:brightness-110 hover:scale-[1.02] active:scale-95 pointer-events-auto shadow-lg shadow-accent/20">
                  CHECK COURSE
                  <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ambient Visuals */}
      <div className="ambient-glow absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] bg-accent/5 rounded-full blur-[140px]" />
      </div>
    </div>
  );
}