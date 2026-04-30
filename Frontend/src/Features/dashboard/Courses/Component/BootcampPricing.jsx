import React, { useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Check, ArrowUpRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const pricing = [
    {
        code: "KODEX",
        name: "Online Bootcamp",
        price: "29,500",
        details: "25,000 + 18% GST",
        features: ["One-on-One Challenges", "Exclusive Masterclasses", "Debug Battles", "Mini Hack Sprints", "Live Doubt Solving"],
        isPremium: false,
    },
    {
        code: "KODR",
        name: "Offline Bootcamp",
        price: "59,000",
        details: "50,000 + 18% GST",
        features: ["In-Person Challenges", "Daily Classroom Sessions", "On-Campus Masterclasses", "Real-Time Mentor Support", "Offline Debug Arena"],
        isPremium: true,
    }
];

export const BootcampPricing = () => {
    const containerRef = useRef(null);
    const cardRef = useRef(null);
    const spotlightRef = useRef(null);

    useGSAP(() => {
        const container = containerRef.current;
        const card = cardRef.current;
        const spotlight = spotlightRef.current;

        // 1. Background Spotlight Follow
        const handleGlobalMove = (e) => {
            const { clientX, clientY } = e;
            const rect = container.getBoundingClientRect();
            const x = clientX - rect.left;
            const y = clientY - rect.top;

            gsap.to(spotlight, {
                x: x,
                y: y,
                duration: 2,
                ease: "power2.out",
            });
        };

        // 2. Card 3D Tilt
        const handleCardMove = (e) => {
            const { left, top, width, height } = card.getBoundingClientRect();
            const x = (e.clientX - left) / width - 0.5;
            const y = (e.clientY - top) / height - 0.5;

            gsap.to(card, {
                rotationY: x * 6,
                rotationX: -y * 6,
                transformPerspective: 1200,
                ease: "power2.out",
                duration: 0.6,
            });
        };

        const handleMouseLeave = () => {
            gsap.to(card, { rotationY: 0, rotationX: 0, duration: 1.5, ease: "elastic.out(1, 0.3)" });
        };

        container.addEventListener("mousemove", handleGlobalMove);
        card.addEventListener("mousemove", handleCardMove);
        card.addEventListener("mouseleave", handleMouseLeave);

        // 3. Entrance Animations
        gsap.from(".pricing-line", {
            scaleY: 0,
            stagger: 0.3,
            duration: 2,
            ease: "expo.out",
            scrollTrigger: { trigger: container, start: "top 70%" }
        });

        return () => {
            container.removeEventListener("mousemove", handleGlobalMove);
            card.removeEventListener("mousemove", handleCardMove);
            card.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="relative py-40 px-4 bg-[#0a0a0a] overflow-hidden">

            {/* --- NEW DYNAMIC BACKGROUND LAYERS --- */}

            {/* 1. Deep Radial Gradient Base */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#1a1518_0%,#0a0a0a_100%)]" />

            {/* 2. GSAP Spotlight (Follows mouse) */}
            <div
                ref={spotlightRef}
                className="absolute w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 bg-accent/5 rounded-full blur-[120px] pointer-events-none opacity-50"
            />

            {/* 3. Static Center Aura (Makes card glow) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-96 bg-accent/10 blur-[150px] opacity-30 pointer-events-none" />

            {/* 4. Fine Grid Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

            {/* 5. Giant Background Text */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center pointer-events-none select-none overflow-hidden">
                <h2 className="text-[22vw] font-display font-bold leading-none uppercase text-white/[0.02] tracking-tighter">
                    Tiers
                </h2>
            </div>

            {/* --- CONTENT --- */}
            <div className="relative z-10 max-w-6xl mx-auto">

                {/* HEADER */}
                <div className="mb-14 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center mb-8"
                    >
                        <div className="inline-block px-4 py-1 border border-accent/20 mb-4 bg-accent/5">
                            <span className="text-accent text-[8px] md:text-[10px] tracking-[0.4em] uppercase font-bold">
                                Membership
                            </span>
                        </div>
                    </motion.div>

                    <h3 className="font-display text-6xl md:text-7xl text-text tracking-tighter">
                        Simple Pricing
                    </h3>
                </div>

                {/* 3D Glass Container */}
                <div
                    ref={cardRef}
                    className="relative grid grid-cols-1 md:grid-cols-2 border border-white/10 bg-white/[0.01] backdrop-blur-3xl rounded-[40px] overflow-hidden shadow-2xl"
                    style={{ transformStyle: "preserve-3d" }}
                >
                    {/* Animated Vertical Line */}
                    <div className="pricing-line absolute left-1/2 top-0 w-[1px] h-full bg-gradient-to-b from-transparent via-white/20 to-transparent hidden md:block z-20" />

                    {pricing.map((plan, i) => (
                        <div
                            key={plan.code}
                            className={`relative p-10 md:p-20 flex flex-col group transition-all duration-700 ${i === 0 ? "hover:bg-white/[0.02]" : "hover:bg-accent/[0.02]"
                                }`}
                        >
                            {/* Internal Card Dotted Grid */}
                            <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]" />

                            <div className="relative z-10">
                                <div className="flex justify-between items-center mb-16">
                                    <span className="px-5 py-1.5 border border-white/10 bg-bg/50 backdrop-blur-md text-[9px] font-bold tracking-[0.3em] text-accent rounded-full uppercase">
                                        {plan.code}
                                    </span>
                                    {plan.isPremium && (
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                                            <span className="text-[9px] text-text-secondary font-bold uppercase tracking-widest">Premium Track</span>
                                        </div>
                                    )}
                                </div>

                                <h4 className="font-display text-4xl md:text-6xl text-text mb-10 tracking-tight">{plan.name}</h4>

                                <div className="mb-16">
                                    <span className="text-7xl md:text-[50px] font-display font-medium text-text block">₹{plan.price}</span>
                                    <span className="text-[10px] text-text-secondary opacity-40 uppercase font-mono tracking-widest mt-2 block">
                                        {plan.details}
                                    </span>
                                </div>

                                <div className="space-y-5 mb-20">
                                    {plan.features.map((f, idx) => (
                                        <div key={idx} className="flex items-center gap-4 group/item">
                                            <Check size={14} className="text-accent opacity-30 group-hover/item:opacity-100 transition-opacity" />
                                            <span className="text-sm text-text-secondary group-hover/item:text-text transition-colors duration-300 font-light tracking-wide">{f}</span>
                                        </div>
                                    ))}
                                </div>

                                <motion.button
                                 onClick={() => document.getElementById('apply').scrollIntoView({ behavior: 'smooth' })}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className={`w-full py-7 rounded-2xl font-display text-xs font-bold tracking-[0.3em] uppercase transition-all duration-500 flex items-center justify-center gap-3 group/btn ${plan.isPremium
                                            ? "bg-accent text-bg shadow-[0_20px_40px_rgba(230,206,200,0.1)] hover:shadow-accent/20"
                                            : "bg-white/5 text-text border border-white/10 hover:bg-white/10"
                                        }`}
                                >
                                    Apply Now
                                    <ArrowUpRight size={18} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                                </motion.button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Minimal Bottom Metadata */}
                <div className="mt-16 flex flex-wrap justify-center gap-x-12 gap-y-4 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
                    {["Lifetime Community", "Certification", "Hardware Access", "Placement Support"].map(item => (
                        <span key={item} className="text-[9px] uppercase tracking-[0.3em] font-bold">{item}</span>
                    ))}
                </div>
            </div>
        </section>
    );
};