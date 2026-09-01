import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Mail, MessageSquare, Phone, ChevronRight, Search, Zap, ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

// Layout & Background Components
import { Nav } from "../../Home/components/Nav";
import { FluidBackground } from "../../Home/components/FluidBackground";
import { Footer } from "../../Home/components/Footer";

// --- START: YOUR EXACT FAQ UI COMPONENTS ---
const FAQItem = ({ question, answer, isOpen, onClick }) => {
  return (
    <div
      className={`glow-card rounded-xl mb-3 border transition-all duration-500 ${
        isOpen ? "border-accent/40 bg-card/20" : "border-border/40 bg-transparent"
      }`}
    >
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between p-4 md:p-5 text-left cursor-pointer group"
      >
        <span
          className={`text-[17px] md:text-[19px] font-display font-normal tracking-tight transition-colors duration-300 ${
            isOpen ? "text-text" : "text-text-secondary group-hover:text-text"
          }`}
        >
          {question}
        </span>

        {/* Compact Interaction Icon */}
        <div
          className={`flex items-center justify-center w-8 h-8 rounded-full border transition-all duration-500 ${
            isOpen ? "bg-accent border-accent rotate-90" : "border-border group-hover:border-accent/50"
          }`}
        >
          <ChevronRight
            className={`w-4 h-4 transition-colors duration-300 ${isOpen ? "text-white" : "text-text-secondary"}`}
          />
        </div>
      </button>

      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="px-4 md:px-5 pb-5">
              <p className="text-text-secondary font-sans font-light leading-relaxed text-[15px] border-t border-border/20 pt-4 max-w-3xl">
                {answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: "Are Prish Infotech courses suitable for beginners?",
      answer:
        "Yes, we provide beginner-friendly tracks alongside advanced modules. Our path starts with logic building and core principles before moving into production-scale architecture.",
    },
    {
      question: "What technology stacks are covered in the curriculum?",
      answer:
        "We focus on high-demand modern stacks including MERN, Python Full Stack, and Cloud Engineering, ensuring you're ready for industry-standard roles.",
    },
    {
      question: "Is there mentorship support available after hours?",
      answer:
        "Absolutely. Our private Discord community provides 24/7 access to mentors and peers, with dedicated review slots during weekends.",
    },
    {
      question: "Do you offer flexible payment plans?",
      answer:
        "Yes, we offer EMI options and modular payment plans to ensure high-quality engineering education is accessible to serious learners.",
    },
  ];

  return (
    <section className="py-20 px-6 relative">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-1 border border-accent/20 mb-4 md:mb-6 bg-accent/5">
            <span className="text-accent text-[8px] md:text-[10px] tracking-[0.4em] uppercase font-bold">FAQS</span>
          </div>

          <h2 className="font-display text-4xl md:text-5xl font-normal tracking-tight text-text leading-[1.1]">
            Frequently Asked <br />
            Questions From Our Students
          </h2>
        </div>

        {/* Compact Accordion List */}
        <div className="space-y-1">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
// --- END: YOUR EXACT FAQ UI COMPONENTS ---

export const Support = () => {
  const containerRef = useRef(null);

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // GSAP Mouse Interaction for Support Cards
  useGSAP(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const xPos = (clientX / window.innerWidth - 0.5) * 15;
      const yPos = (clientY / window.innerHeight - 0.5) * 15;

      gsap.to(".support-3d-card", {
        rotationY: xPos,
        rotationX: -yPos,
        transformPerspective: 1200,
        duration: 1.2,
        ease: "power2.out",
        stagger: 0.05,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div ref={containerRef} className="bg-bg text-text selection:bg-accent/30 overflow-x-hidden perspective-1000">
      {/* BACKGROUND LAYERS */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
        <FluidBackground />
      </div>

      {/* TECHNICAL GRID & DEPTH ORBS */}
      <div className="fixed inset-0 z-[1] bg-[linear-gradient(to_right,#2a232b_1px,transparent_1px),linear-gradient(to_bottom,#2a232b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />
      <div className="noise-bg z-[1]" />

      <Nav />

      <main className="relative z-10 pt-32 pb-24 px-6 ">
        {/* HERO SECTION */}
        <section className="max-w-7xl mx-auto py-16 text-center mb-50">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/5 border border-accent/20 text-accent text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] mb-10 backdrop-blur-md">
              <Zap className="w-3 h-3 fill-accent animate-pulse" />
              Support Concierge 2.0
            </div>

            <h1 className="font-display text-6xl md:text-8xl leading-[0.9] tracking-tight mb-10 text-white">
              We're here to <br />
              <span className="italic font-serif text-accent">Help</span> you grow.
            </h1>

          
          </motion.div>
        </section>

        {/* CONTACT CARDS */}
        <section className="max-w-7xl mx-auto grid md:grid-cols-3 gap-6 mb-24">
          <SupportCard
            icon={<Mail />}
            title="Tech Support"
            desc="Issue with lectures or classroom?"
            link="mailto:support@prishinfotech.com"
            linkText="support@prishinfotech.com"
          />
          <SupportCard
            icon={<MessageSquare />}
            title="Community"
            desc="Join our Discord for live assistance."
            link="https://discord.com"
            linkText="Join Discord Server"
          />
          <SupportCard
            icon={<Phone />}
            title="Direct Line"
            desc="Speak with a student counselor."
            link="tel:+919993478545"
            linkText="+91 9993478545"
          />
        </section>

        {/* YOUR FAQ SECTION (Used exactly as provided) */}
        <FAQSection />
      </main>

      <Footer />
    </div>
  );
};

// Internal Helper for 3D Cards
const SupportCard = ({ icon, title, desc, link, linkText }) => (
  <motion.a
    href={link}
    className="support-3d-card group relative p-10 bg-white/[0.01] border border-white/5 rounded-[40px] overflow-hidden block"
  >
    <div className="relative z-10">
      <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent mb-8 group-hover:scale-110 transition-transform duration-500">
        {React.cloneElement(icon, { size: 24 })}
      </div>
      <h3 className="text-2xl font-display text-white mb-4 uppercase tracking-tighter">{title}</h3>
      <p className="text-text-secondary font-light text-sm mb-8 leading-relaxed">{desc}</p>
      <div className="flex items-center gap-2 text-accent font-bold text-[10px] uppercase tracking-widest">
        {linkText} <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
      </div>
    </div>
    <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
  </motion.a>
);

export default Support;