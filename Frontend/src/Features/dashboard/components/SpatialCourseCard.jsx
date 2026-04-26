import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const courses = [
  {
    id: 1,
    title: "Cinematic Lighting",
    image: "https://images.unsplash.com/photo-1492691523567-30730029ad0a?auto=format&fit=crop&q=80&w=1000",
    description: "Sit back and enjoy. Breathtaking views come standard.",
  },
  {
    id: 2,
    title: "Urban Architecture",
    image: "https://images.unsplash.com/photo-1449156059579-730279261334?auto=format&fit=crop&q=80&w=1000",
    description: "Discover the geometry of modern cityscapes.",
  },
  {
    id: 3,
    title: "Aerial Perspective",
    image: "https://images.unsplash.com/photo-1473415781819-175f5b2b35bc?auto=format&fit=crop&q=80&w=1000",
    description: "A new way to look at the world from above.",
  },
];

export default function SpatialCourseCard() {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  useGSAP(() => {
    const cards = cardsRef.current;
    
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "+=400%", // Length of the scroll
        scrub: 1,
        pin: true,
        anticipatePin: 1,
      },
    });

    // SET INITIAL POSITIONS
    // Card 0: Center (Active)
    // Card 1: Bottom Right (Waiting)
    // Card 2+: Invisible
    gsap.set(cards[0], { xPercent: 0, yPercent: 0, scale: 1, opacity: 1 });
    gsap.set(cards.slice(1), { xPercent: 100, yPercent: 50, scale: 0.5, opacity: 0 });

    // TRANSITION 1: Card 0 moves to top-left, Card 1 moves to Center
    tl.to(cards[0], {
      xPercent: -120, // Move to left
      yPercent: -100, // Move up
      scale: 0.25,
      borderRadius: "20px",
      ease: "power2.inOut",
    })
    .fromTo(cards[1], 
      { opacity: 0, scale: 0.5, xPercent: 100, yPercent: 50 },
      { opacity: 1, scale: 1, xPercent: 0, yPercent: 0, ease: "power2.inOut" },
      "<" // Start at the same time as the previous animation
    )
    .to(".text-content-0", { opacity: 0, y: -20 }, "<")
    .fromTo(".text-content-1", { opacity: 0, y: 20 }, { opacity: 1, y: 0 }, "<0.2");

    // TRANSITION 2: Card 1 moves to top-left (replacing 0), Card 2 moves to Center
    tl.to(cards[0], { opacity: 0, duration: 0.2 }) // Fade out the first one
    .to(cards[1], {
      xPercent: -120,
      yPercent: -100,
      scale: 0.25,
      ease: "power2.inOut",
    })
    .fromTo(cards[2], 
      { opacity: 0, scale: 0.5, xPercent: 100, yPercent: 50 },
      { opacity: 1, scale: 1, xPercent: 0, yPercent: 0, ease: "power2.inOut" },
      "<"
    )
    .to(".text-content-1", { opacity: 0, y: -20 }, "<")
    .fromTo(".text-content-2", { opacity: 0, y: 20 }, { opacity: 1, y: 0 }, "<0.2");

  }, { scope: sectionRef });

  return (
    <div ref={sectionRef} className="relative h-screen w-full bg-[#f5f5f0] overflow-hidden">
      {/* Background Labels */}
      <div className="absolute top-10 left-10 text-xs font-bold uppercase tracking-widest text-black/30">
        Experience Highlights
      </div>

      <div className="relative flex h-full w-full items-center justify-center px-10">
        
        {/* The Cards "Theater" */}
        <div className="relative w-full max-w-6xl aspect-video flex items-center justify-center">
          
          {courses.map((course, index) => (
            <div
              key={course.id}
              ref={(el) => (cardsRef.current[index] = el)}
              className="absolute w-[60%] aspect-[4/5] md:aspect-video overflow-hidden rounded-[40px] shadow-2xl transition-shadow duration-500"
              style={{ zIndex: 10 - index }}
            >
              <img
                src={course.image}
                alt={course.title}
                className="h-full w-full object-cover"
              />
            </div>
          ))}

          {/* Text Descriptions (Right side) */}
          <div className="absolute right-0 w-[30%] pointer-events-none">
            {courses.map((course, index) => (
              <div 
                key={index} 
                className={`text-content-${index} absolute inset-0 opacity-0`}
              >
                <h2 className="text-3xl font-medium text-gray-900 mb-4">{course.title}</h2>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  {course.description}
                </p>
                <button className="border-b-2 border-black pb-1 font-bold text-sm hover:opacity-50 transition-opacity">
                  Discover the Course
                </button>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}