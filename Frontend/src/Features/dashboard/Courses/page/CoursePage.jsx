import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Zap } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

// Components
import { Nav } from "../../components/Nav";
import { FluidBackground } from "../../components/FluidBackground";
import { Footer } from "../../components/Footer";
import CourseCard from "../Component/CourseCard";
import ComparisonSection from "../../components/ComparisonSection";
import { FAQSection } from "../../components/FAQSection";
import { CTASection } from "../../components/CTASection";

export const COURSES_DATA = [
  {
    id: 1,
    title: "AI & Machine Learning Mastery Cohort",
    heading: "AI & Machine Learning",
    subheading: "Mastery Cohort",
    slug: "ai-ml-mastery",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800",
    description: "Master the most sought-after AI skills. Build intelligent systems powered by Large Language Models, RAG architecture, and agentic AI workflows.",
    techTags: ["Gen-AI", "LLMs"],
    features: ["Product Building", "Community Access", "Gamified Learning"],
    price: "4,999",
    oldPrice: "11,999",
    isLive: true,
    pricing: {
      originalPrice: 11999,
      basePrice: 4999,
      discount: 7000,
      discountPercent: 58,
      platformFee: 100,
      gst: 918,
      total: 6017
    }
  },
  {
    id: 2,
    title: "Data Science Mastery Cohort",
    heading: "Data Science",
    subheading: "Mastery Cohort",
    slug: "data-science",
    image: "https://images.unsplash.com/photo-1775896194071-f3311de4dabb?w=1200&auto=format&fit=crop&q=80",
    description: "Master the full data lifecycle. From complex statistical modeling to deploying AI-driven predictive systems in production with global mentors.",
    techTags: ["Python", "Machine Learning", "Gen-AI", "Data Viz"],
    features: ["1-on-1 Mentorship", "Job Portal", "Live Projects"],
    price: "3,499",
    oldPrice: "7,999",
    isLive: false,
    pricing: {
      originalPrice: 7999,
      basePrice: 3499,
      discount: 4500,
      discountPercent: 56,
      platformFee: 70,
      gst: 642,
      total: 4211
    }
  },
  {
    id: 3,
    title: "Full Stack Web Engineering Cohort",
    heading: "Full Stack Web",
    subheading: "Engineering Cohort",
    slug: "full-stack",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=800",
    description: "Build enterprise-grade applications from scratch. Master MERN stack, system design, DevOps automation, and cloud deployment with industry architects.",
    techTags: ["React", "Node.js", "Docker", "System Design"],
    features: ["Zero to Hero", "Open Source", "Interview Prep"],
    price: "5,999",
    oldPrice: "12,999",
    isLive: true,
    pricing: {
      originalPrice: 12999,
      basePrice: 5999,
      discount: 7000,
      discountPercent: 54,
      platformFee: 120,
      gst: 1101,
      total: 7220
    }
  },
];

export default function CoursesPage() {
  const containerRef = useRef(null);

  // GSAP Mouse Effect - Slightly throttled for performance
  useGSAP(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const xPos = (clientX / window.innerWidth - 0.5) * 10; // Reduced intensity
      const yPos = (clientY / window.innerHeight - 0.5) * 10;

      gsap.to(".hero-3d-content", {
        rotationY: xPos,
        rotationX: -yPos,
        transformPerspective: 1200,
        duration: 0.6, // Snappier follow
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
      
      <div className="fixed inset-0 z-[1] bg-[linear-gradient(to_right,#2a232b_1px,transparent_1px),linear-gradient(to_bottom,#2a232b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />
      
      <div className="noise-bg z-[1]" />

      <div className="relative z-10">
        <Nav />

        <main className="pt-32 pb-24 px-6">
          
          {/* HERO SECTION */}
          <section className="max-w-7xl mx-auto py-20 text-center hero-3d-content">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }} // Reduced duration from 1s to 0.6s
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
                Premium cohort-based courses for software architects and high-growth engineers.
              </p>
            </motion.div>
          </section>

          {/* COURSES GRID */}
          <section className="max-w-7xl mx-auto py-12">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "0px" }} // Changed from -100px to 0px for instant trigger
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.08 }, // Faster stagger (0.15 -> 0.08)
                },
              }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10"
            >
              {COURSES_DATA.map((course) => (
                <motion.div 
                  key={course.id}
                  variants={{
                    hidden: { opacity: 0, y: 20, scale: 0.98 },
                    visible: { opacity: 1, y: 0, scale: 1 }
                  }}
                  transition={{ duration: 0.4, ease: "easeOut" }} // Reduced duration (0.8 -> 0.4)
                  className="group will-change-transform" // Added will-change for GPU acceleration
                >
                  <div className="h-full transition-transform duration-300 group-hover:-translate-y-2">
                    <CourseCard course={course} />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </section>

          {/* OTHER SECTIONS - Snappier Revelations */}
          <ScrollReveal rotateX={5} y={20}>
            <section className="mt-32">
              <div className="glass rounded-[48px] p-1 border-white/5 bg-gradient-to-b from-white/5 to-transparent">
                <ComparisonSection />
              </div>
            </section>
          </ScrollReveal>

          <ScrollReveal y={20}>
            <section className="mt-32 max-w-4xl mx-auto">
              <FAQSection />
            </section>
          </ScrollReveal>

          <ScrollReveal scale={0.98}>
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

// Optimized Scroll Reveal Helper
function ScrollReveal({ children, rotateX = 0, y = 20, scale = 1 }) {
  const ref = useRef(null);
  // Trigger as soon as 1px is in view (no margin delay)
  const isInView = useInView(ref, { once: true, margin: "0px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: y, rotateX: rotateX, scale: scale }}
      animate={isInView ? { opacity: 1, y: 0, rotateX: 0, scale: 1 } : {}}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} // Snappier timing function
      style={{ transformStyle: "preserve-3d" }}
      className="will-change-transform"
    >
      {children}
    </motion.div>
  );
}