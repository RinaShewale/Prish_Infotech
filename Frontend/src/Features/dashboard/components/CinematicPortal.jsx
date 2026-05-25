import React, { useRef, useEffect, useMemo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Lenis from "@studio-freight/lenis";
import { Clock, BadgeCheck, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useCourse } from "../../dashboard/Courses/hooks/useCourse";

gsap.registerPlugin(ScrollTrigger);

export default function CinematicPortal() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const word1Ref = useRef(null);
  const plusRef = useRef(null);
  const word2Ref = useRef(null);
  const cardsRef = useRef([]);
  const textRefs = useRef([]);

  const { handleGetCourses } = useCourse();
  const { courses } = useSelector((state) => state.course);

  useEffect(() => {
    handleGetCourses();
    
    // 1. Force browser to NOT restore scroll position on back button
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // 2. Immediate scroll to top on mount
    window.scrollTo(0, 0);

    return () => {
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'auto';
      }
    };
  }, []);

  const latestCourses = useMemo(() => {
    return courses ? courses.slice(0, 3) : [];
  }, [courses]);

  const generateSlug = (title) =>
    title.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
    });
    function update(time) { lenis.raf(time * 1000); }
    gsap.ticker.add(update);
    return () => {
      gsap.ticker.remove(update);
      lenis.destroy();
    };
  }, []);

  useGSAP(() => {
    if (!latestCourses || latestCourses.length === 0) return;

    // 3. Clear existing triggers to prevent overlapping instances on back-navigation
    ScrollTrigger.getAll().forEach(t => t.kill());

    const cards = cardsRef.current;
    const texts = textRefs.current;

    // Reset initial styles immediately to prevent the "blink"
    gsap.set([word1Ref.current, plusRef.current, word2Ref.current], {
        z: 0,
        scale: 1,
        opacity: 1,
        filter: "blur(0px)"
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=1200%",
        scrub: 1.5,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    gsap.set([word1Ref.current, word2Ref.current, plusRef.current], {
      transformPerspective: 1000,
      willChange: "transform, opacity",
    });

    gsap.set(cards, { opacity: 0, scale: 0.85, yPercent: 30 });
    gsap.set(texts, { autoAlpha: 0, x: 40 });

    tl.to({}, { duration: 3 });

    // The Portal Zoom Effect
    tl.to([word1Ref.current, plusRef.current, word2Ref.current], {
      z: 1500,
      scale: 15,
      opacity: 0,
      filter: "blur(20px)",
      stagger: 0.1,
      ease: "power2.inOut",
      duration: 4
    });

    latestCourses.forEach((_, index) => {
      tl.to(cards[index], {
        opacity: 1, scale: 1, yPercent: 0,
        duration: 2.5, ease: "power2.out"
      }, "-=1.5")
        .to(texts[index], {
          autoAlpha: 1, x: 0,
          duration: 2, ease: "power2.out"
        }, "-=2");

      tl.to({}, { duration: 3 });

      if (index < latestCourses.length - 1) {
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

    // 4. Final calculation refresh
    ScrollTrigger.refresh();

  }, { scope: containerRef, dependencies: [latestCourses] });

  if (!latestCourses || latestCourses.length === 0) return <div className="h-screen bg-bg" />;

  return (
    <div ref={containerRef} className="relative w-full h-screen overflow-hidden bg-bg" style={{ perspective: "1200px" }}>
      <div className="noise-bg" />

      {/* 1. ZOOMING TEXT LAYER */}
      <div className="absolute inset-0 z-[20] flex items-center justify-center pointer-events-none">
        <div className="relative flex flex-col md:flex-row items-center justify-center gap-4 md:gap-16 whitespace-nowrap px-4" style={{ transformStyle: "preserve-3d" }}>
          <h1 ref={word1Ref} className="font-display text-5xl md:text-[9vw] text-text font-bold tracking-tighter select-none uppercase">Learn</h1>
          <span ref={plusRef} className="font-display text-4xl md:text-[9vw] text-accent font-light select-none uppercase">Build</span>
          <h1 ref={word2Ref} className="font-display text-5xl md:text-[9vw] text-text font-bold tracking-tighter select-none uppercase">Grow</h1>
        </div>
      </div>

      {/* 2. CONTENT LAYER */}
      <div className="relative h-full w-full flex items-center justify-center px-6 md:px-10 z-[50]">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-16 items-center w-full max-w-7xl h-[90vh] md:h-auto">

          {/* Card Container */}
          <div className="md:col-span-6 relative aspect-[16/10] md:aspect-video flex items-center justify-center w-full">
            {latestCourses.map((course, index) => (
              <div
                key={course._id}
                ref={(el) => (cardsRef.current[index] = el)}
                className="absolute inset-0 overflow-hidden rounded-2xl md:rounded-[32px] shadow-[0_40px_80px_rgba(0,0,0,0.6)] border border-border/50 bg-bg"
                style={{ zIndex: latestCourses.length - index }}
              >
                {course.type === "live" && (
                  <div className="absolute top-4 right-4 md:top-6 md:right-6 z-20 flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-red-600 rounded-full shadow-xl border border-white/20">
                    <span className="relative flex h-1.5 w-1.5 md:h-2 md:w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 md:h-2 md:w-2 bg-white"></span>
                    </span>
                    <span className="text-[8px] md:text-[10px] font-black text-white uppercase tracking-widest">Live Now</span>
                  </div>
                )}
                <img src={course.thumbnail} alt={course.title} className="h-full w-full object-cover" />
                <div className="absolute inset-0 gloss-overlay pointer-events-none" />
              </div>
            ))}
          </div>

          {/* Text Container */}
          <div className="md:col-span-6 relative h-[45vh] md:h-[520px] flex flex-col justify-center">
            {latestCourses.map((course, index) => (
              <div key={course._id} ref={(el) => (textRefs.current[index] = el)} className="absolute inset-0 flex flex-col justify-start md:justify-center text-left items-start">
                <h2 className="font-display text-xl md:text-[2.75rem] font-medium text-text mb-2 md:mb-4 leading-[1.15] tracking-tight">
                  {course.title}
                </h2>
                <p className="font-sans text-xs md:text-base text-text-secondary mb-4 md:mb-8 leading-relaxed max-w-lg line-clamp-2 md:line-clamp-none">
                  {course.description}
                </p>

                <div className="flex flex-wrap gap-3 md:gap-6 mb-4 md:mb-10">
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="p-1.5 md:p-2.5 rounded-xl bg-accent/10 text-accent"><Clock size={16} /></div>
                    <div className="flex flex-col">
                      <span className="text-xs md:text-sm font-bold text-text leading-none">{course.duration || "5"}</span>
                      <span className="text-[8px] md:text-[10px] uppercase tracking-wider text-text-secondary font-medium">Duration</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="p-1.5 md:p-2.5 rounded-xl bg-accent/10 text-accent"><BadgeCheck size={16} /></div>
                    <div className="flex flex-col">
                      <span className="text-xs md:text-sm font-bold text-text leading-none">Yes</span>
                      <span className="text-[8px] md:text-[10px] uppercase tracking-wider text-text-secondary font-medium">Certified</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-baseline gap-3 mb-4 md:mb-8">
                  <span className="text-lg md:text-2xl font-medium text-text-secondary">Price</span>
                  <span className="text-xl md:text-4xl font-bold text-accent">₹{course.price}</span>
                  {course.oldPrice && (
                    <span className="text-sm md:text-xl text-text-secondary/40 line-through font-light">
                      ₹{course.oldPrice}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => {
                    navigate(`/cohort/${generateSlug(course.title)}`);
                  }}
                  className="group flex items-center gap-2 md:gap-3 bg-accent text-[#131014] px-5 py-3 md:px-8 md:py-4 rounded-xl font-display font-bold text-[12px] md:text-sm transition-all hover:brightness-110 hover:scale-[1.02] active:scale-95 pointer-events-auto shadow-lg shadow-accent/20"
                >
                  CHECK COURSE
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="ambient-glow absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] bg-accent/5 rounded-full blur-[140px]" />
      </div>
    </div>
  );
}