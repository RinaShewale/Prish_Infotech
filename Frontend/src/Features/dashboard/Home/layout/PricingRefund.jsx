import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, CreditCard, RefreshCcw, HelpCircle, ArrowRight, Zap } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import PageLayout from './PageLayout';

export default function PricingRefund() {
  const cardRef = useRef(null);

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // GSAP 3D Tilt Effect for the Refund Card
  useGSAP(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const xPos = (clientX / window.innerWidth - 0.5) * 12;
      const yPos = (clientY / window.innerHeight - 0.5) * 12;

      gsap.to(".refund-3d-card", {
        rotationY: xPos,
        rotationX: -yPos,
        transformPerspective: 1000,
        duration: 0.8,
        ease: "power2.out",
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <PageLayout 
      title={<span className="font-display">Transparent <br /><span className="italic font-serif text-accent text-6xl md:text-8xl">Value</span></span>}
      subtitle="Pricing & Refund"
    >
      <div className="max-w-6xl mx-auto space-y-24">
        
        {/* TOP SECTION: REFUND POLICY FEATURE */}
        <section className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/10 border border-accent/20 rounded-full text-accent text-[10px] font-bold uppercase tracking-widest">
              <ShieldCheck className="w-3 h-3" /> Peace of Mind
            </div>
            <h2 className="text-4xl font-display text-white leading-tight uppercase">
              Our 7-Day <br /> <span className="text-accent">Satisfaction</span> Guarantee
            </h2>
            <p className="text-lg text-text-secondary font-light leading-relaxed">
              We believe in the quality of our digital architecture. If the experience doesn't align with your expectations, we offer a <span className="text-white italic">no-questions-asked</span> full refund within the first week.
            </p>
            <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-white/40">
              <RefreshCcw className="w-4 h-4 text-accent" /> Secure Processing via Stripe / Razorpay
            </div>
          </div>

          <div className="lg:col-span-7">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="refund-3d-card group relative p-1 rounded-[48px] bg-gradient-to-br from-white/20 via-transparent to-white/5 border border-white/10 backdrop-blur-3xl overflow-hidden"
            >
              <div className="bg-bg/60 rounded-[44px] p-10 md:p-16 relative overflow-hidden">
                <div className="relative z-10">
                  <div className="w-20 h-20 bg-accent/20 rounded-3xl flex items-center justify-center text-accent mb-8 group-hover:scale-110 transition-transform duration-700">
                    <ShieldCheck size={40} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-3xl font-display text-white mb-4 uppercase">100% Risk-Free</h3>
                  <p className="text-text-secondary leading-relaxed mb-8 max-w-md">
                    Purchase with confidence. You have 168 hours to explore the curriculum, interact with mentors, and decide if this is the right path for your career.
                  </p>
                  <button className="flex items-center gap-3 text-accent text-[10px] font-bold uppercase tracking-[0.3em] group/btn">
                    Read Full Terms <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-2 transition-transform" />
                  </button>
                </div>
                
                {/* Decorative element */}
                <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-accent/5 rounded-full blur-[100px] pointer-events-none" />
              </div>
            </motion.div>
          </div>
        </section>

        {/* PRICING INFO GRID */}
        <section className="grid md:grid-cols-3 gap-6">
          <InfoCard 
            icon={<Zap className="text-accent" />}
            title="Course Pricing"
            desc="Each cohort's pricing is reflective of its depth and duration. Early-bird slots are typically available at a 20% discount."
          />
          <InfoCard 
            icon={<CreditCard className="text-accent" />}
            title="Modular Payments"
            desc="We provide EMI options and split-payment plans for long-term programs to ensure education is accessible."
          />
          <InfoCard 
            icon={<HelpCircle className="text-accent" />}
            title="Custom Services"
            desc="For enterprise-grade consulting or custom curriculum design, pricing is project-based. Contact sales for a quote."
          />
        </section>

        {/* CALL TO ACTION */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="p-12 border border-white/5 bg-white/[0.02] rounded-[40px] text-center"
        >
          <h4 className="font-display text-2xl text-white mb-4 uppercase tracking-wider">Have a specific question?</h4>
          <p className="text-text-secondary mb-8 max-w-xl mx-auto">Our billing team is available to help with any payment-related inquiries or refund requests.</p>
          <a 
            href="mailto:billing@prishinfotech.com" 
            className="inline-flex items-center gap-4 px-10 py-5 bg-white text-bg font-bold text-[10px] uppercase tracking-[0.4em] rounded-full hover:bg-accent hover:text-white transition-all"
          >
            Contact Billing Team
          </a>
        </motion.div>

      </div>
    </PageLayout>
  );
}

// Internal Helper Component
const InfoCard = ({ icon, title, desc }) => (
  <div className="p-8 border border-white/5 bg-white/[0.01] rounded-3xl hover:border-accent/20 transition-all duration-500">
    <div className="mb-6">{icon}</div>
    <h3 className="text-lg font-display text-white mb-3 uppercase tracking-tight">{title}</h3>
    <p className="text-sm text-text-secondary leading-relaxed font-light">{desc}</p>
  </div>
);