import React from "react";
import { motion } from "framer-motion";
import { Monitor, Users, Check, ChevronRight } from "lucide-react";

const TRACKS = [
  {
    id: "codex",
    title: "codex",
    subtitle: "Online Masterclass",
    description: "High-bandwidth engineering training delivered globally to your workspace.",
    icon: <Monitor className="text-accent w-6 h-6 md:w-7 md:h-7" />,
    features: [
      "Focused daily live sessions with Prish Tech Leads",
      "Premium MERN + AI curriculum (Next.js 14, Cloud Architecture)",
      "Scalable Backend Design (Redis, Kafka, PostgreSQL)",
      "Direct 1-on-1 mentor support via Prish Slack community",
      "Weekly engineering sprints & architectural challenges",
    ],
    buttonText: "Join Virtual Cohort",
    variant: "outline",
    animationDirection: -20, // Reduced for mobile safety
  },
  {
    id: "coder",
    title: "coder",
    subtitle: "On-Campus Bootcamp",
    description: "Immersive, high-performance in-person environment at Prish HQ.",
    icon: <Users className="text-accent w-6 h-6 md:w-7 md:h-7" />,
    features: [
      "Focused 9-to-9 engineering environment in high-tech classrooms",
      "Instant on-spot technical assistance for complex debugging",
      "Physical pair-programming & boardroom presentations",
      "In-person tech activities, hackathons & code sprint challenges",
      "Direct access to Prish internal project hiring desk",
    ],
    buttonText: "Join On-Campus Track",
    variant: "solid",
    animationDirection: 20, // Reduced for mobile safety
  },
];

const FeatureItem = ({ text }) => (
  <li className="flex items-start gap-3 md:gap-4 text-text-secondary group/item">
    <div className="mt-1 flex-shrink-0 rounded-full p-1 bg-accent/10 border border-accent/20 group-hover/item:bg-accent/20 transition-colors">
      <Check className="w-3 h-3 md:w-3.5 md:h-3.5 text-accent" />
    </div>
    <span className="text-sm md:text-base leading-relaxed group-hover/item:text-text transition-colors">
      {text}
    </span>
  </li>
);

export default function BootcampCards() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 md:mb-24 lg:mb-32">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10 items-stretch">
        {TRACKS.map((track) => (
          <motion.div
            key={track.id}
            // Use Y offset on mobile, X offset on desktop
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            className={`glow-card glass p-6 sm:p-10 md:p-14 rounded-[2rem] md:rounded-[3rem] flex flex-col group border-accent/10 transition-colors duration-500 hover:border-accent/30 ${
              track.variant === "solid" ? "bg-accent/[0.03] border-accent/30" : ""
            }`}
          >
            <div className="mb-8 md:mb-10">
              <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center mb-6 md:mb-8 border border-accent/20 shadow-inner transition-transform duration-500 group-hover:scale-110 ${
                track.variant === "solid" ? "bg-accent/20" : "bg-accent/10"
              }`}>
                {track.icon}
              </div>
              
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-text mb-2 md:mb-3 italic">
                {track.title}
              </h2>
              
              <h3 className={`text-sm md:text-lg font-display font-semibold mb-3 md:mb-4 uppercase tracking-[0.15em] md:tracking-[0.2em] ${
                track.variant === "solid" ? "text-accent" : "text-accent/80"
              }`}>
                {track.subtitle}
              </h3>
              
              <p className="text-text-secondary/80 text-base md:text-lg leading-relaxed">
                {track.description}
              </p>
            </div>

            <ul className="space-y-4 md:space-y-6 mb-10 md:mb-14 flex-grow">
              {track.features.map((feature, index) => (
                <FeatureItem key={index} text={feature} />
              ))}
            </ul>

            <button
             onClick={() => document.getElementById('apply').scrollIntoView({ behavior: 'smooth' })}
              className={`group/btn relative overflow-hidden w-full py-4 md:py-5 rounded-xl md:rounded-2xl font-display font-bold text-base md:text-lg flex items-center justify-center gap-2 md:gap-3 
                transition-all duration-300 ease-out transform 
                hover:-translate-y-1 hover:shadow-2xl hover:shadow-accent/40
                active:scale-[0.98]
                ${track.variant === "solid"
                  ? "bg-accent text-bg shadow-xl shadow-accent/20 hover:bg-accent/80"
                  : "bg-accent/5 border border-accent/30 text-text hover:bg-accent/80 hover:text-bg"
                }`}
            >
              <span className="flex items-center gap-2 md:gap-3">
                {track.buttonText}
                <ChevronRight className="w-4 h-4 md:w-5 md:h-5 transition-transform duration-300 group-hover/btn:translate-x-1.5" />
              </span>
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}