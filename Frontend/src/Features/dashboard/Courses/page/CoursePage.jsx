import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Zap, Sparkles } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

// Components
import {Nav} from "../../components/Nav";
import {FluidBackground} from "../../components/FluidBackground";
import { Footer } from "../../components/Footer";
import CourseCard from "../Component/CourseCard";
import ComparisonSection from "../../components/ComparisonSection";
import { FAQSection } from "../../components/FAQSection";
import { CTASection } from "../../components/CTASection";

const COURSES_DATA = [
  {
    id: 1,
    title: "AI & Machine Learning Mastery Cohort",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800",
    techTags: ["Gen-AI", "LLMs"],
    features: ["Product Building", "Community Access", "Gamified Learning"],
    price: "4,999",
    oldPrice: "11,999",
    isLive: true,
  },
  {
    id: 2,
    title: "Data Science with Generative AI",
    image: "https://images.unsplash.com/photo-1775896194071-f3311de4dabb?w=1200&auto=format&fit=crop&q=80",
    techTags: ["Python", "Data Viz"],
    features: ["1-on-1 Mentorship", "Job Portal", "Live Projects"],
    price: "3,499",
    oldPrice: "7,999",
    isLive: false,
  },
  {
    id: 3,
    title: "Full Stack Web Development 2024",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=800",
    techTags: ["React", "Node.js", "Docker"],
    features: ["Zero to Hero", "Open Source", "Interview Prep"],
    price: "5,999",
    oldPrice: "12,999",
    isLive: true,
  },
];

export default function CoursesPage() {
  const containerRef = useRef(null);

  // GSAP 3D Mouse Follow Effect for Hero
  useGSAP(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const xPos = (clientX / window.innerWidth - 0.5) * 15;
      const yPos = (clientY / window.innerHeight - 0.5) * 15;

      gsap.to(".hero-3d-content", {
        rotationY: xPos,
        rotationX: -yPos,
        transformPerspective: 1200,
        duration: 1,
        ease: "power2.out",
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="relative min-h-screen bg-bg text-text selection:bg-accent/30 overflow-x-hidden perspective-1000">
      
      {/* BACKGROUND LAYERS */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
        <FluidBackground />
      </div>
      
      {/* TECHNICAL GRID & ORBS */}
      <div className="fixed inset-0 z-[1] bg-[linear-gradient(to_right,#2a232b_1px,transparent_1px),linear-gradient(to_bottom,#2a232b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />
      <div className="fixed inset-0 z-[1] pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-accent/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-accent/5 rounded-full blur-[120px]" />
      </div>

      <div className="noise-bg z-[1]" />

      {/* CONTENT LAYER */}
      <div className="relative z-10">
        <Nav />

        <main className="pt-32 pb-24 px-6">
          
          {/* HERO SECTION */}
          <section className="max-w-7xl mx-auto py-20 text-center hero-3d-content">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/5 border border-accent/20 text-accent text-xs font-bold uppercase tracking-[0.3em] mb-10 backdrop-blur-sm">
                <Zap className="w-3 h-3 fill-accent animate-pulse" />
                Next Cohort starting May 15
              </div>

              <h1 className="font-display text-6xl md:text-8xl lg:text-[110px] leading-[0.9] tracking-tight mb-8 text-white">
                Master Your{" "}
                <span className="italic font-serif text-accent block md:inline mt-2">
                  Craft
                </span>
              </h1>

              <p className="max-w-2xl mx-auto text-lg md:text-xl text-white/60 font-light leading-relaxed mb-12">
                Premium cohort-based courses for{" "}
                <span className="text-white font-medium italic underline decoration-accent/30 underline-offset-4">
                  software architects
                </span>{" "}
                and high-growth engineers looking to dominate the industry.
              </p>
            </motion.div>
          </section>

          {/* COURSES GRID */}
          <section className="max-w-7xl mx-auto py-12">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.15 },
                },
              }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10"
            >
              {COURSES_DATA.map((course) => (
                <motion.div 
                  key={course.id}
                  variants={{
                    hidden: { opacity: 0, y: 30, scale: 0.95 },
                    visible: { opacity: 1, y: 0, scale: 1 }
                  }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="group"
                >
                  <div className="h-full transition-transform duration-500 group-hover:-translate-y-2">
                    <CourseCard course={course} />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </section>

          {/* COMPARISON - With Perspective Reveal */}
          <ScrollReveal rotateX={10}>
            <section className="mt-32">
              <div className="glass rounded-[48px] p-1 border-white/5 bg-gradient-to-b from-white/5 to-transparent">
                <ComparisonSection />
              </div>
            </section>
          </ScrollReveal>

          {/* FAQ */}
          <ScrollReveal y={40}>
            <section className="mt-32 max-w-4xl mx-auto">
              <FAQSection />
            </section>
          </ScrollReveal>

          {/* CTA */}
          <ScrollReveal scale={0.95}>
            <section className="mt-32">
              <CTASection />
            </section>
          </ScrollReveal>

        </main>

        <Footer />
      </div>
    </div>
  );
}

// Scroll Reveal Helper for 3D entry
function ScrollReveal({ children, rotateX = 0, y = 30, scale = 1 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: y, rotateX: rotateX, scale: scale }}
      animate={isInView ? { opacity: 1, y: 0, rotateX: 0, scale: 1 } : {}}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      style={{ transformStyle: "preserve-3d" }}
    >
      {children}
    </motion.div>
  );
}