import React from "react";
import { Check, X, Shield, Users } from "lucide-react";

const comparisonData = [
  {
    pros: "Agile & Milestone-Driven Delivery",
    cons: "Vague Timelines & Constant Delays",
  },
  {
    pros: "Cutting-Edge Tech & Future-Proof Code",
    cons: "Outdated Stacks & Legacy Methods",
  },
  {
    pros: "24/7 Dedicated Support & PM",
    cons: "Poor Communication & Wait Times",
  },
  {
    pros: "ROI Driven & Scalable Design",
    cons: "Generic Templates & Visual-Only Focus",
  },
];

export default function ComparisonSection() {
  return (
    <section className="relative w-full py-16 md:py-24 px-4 md:px-6 bg-bg overflow-hidden">
      <div className="noise-bg" />

      {/* Header Section */}
      <div className="relative z-10 flex flex-col items-center text-center mb-12 md:mb-20">
        <div className="inline-block px-4 py-1 border border-accent/20 mb-4 md:mb-6 bg-accent/5">
          <span className="text-accent text-[8px] md:text-[10px] tracking-[0.4em] uppercase font-bold">
            The Difference
          </span>
        </div>

        <h2 className="font-display text-4xl md:text-5xl font-normal tracking-tight text-text leading-[1.1]">
          Why Work With{" "}Prish Infotech
          <br />
          Over Traditional Agencies
        </h2>
      </div>



      {/* Main Card Container */}
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="glass rounded-[32px] md:rounded-[56px] overflow-hidden flex flex-col md:grid md:grid-cols-2 border-border/40">

          {/* LEFT SIDE: Prish Infotech */}
          <div className="p-6 sm:p-10 md:p-16 relative bg-accent/5 md:bg-transparent">
            {/* Mobile Only Background Glow */}
            <div className="absolute inset-0 bg-linear-to-b from-accent/10 to-transparent md:bg-linear-to-br md:from-accent/5 pointer-events-none" />

            <div className="flex items-center gap-4 md:gap-5 mb-8 md:mb-12 relative">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl glass flex items-center justify-center border-accent/20">
                <Shield className="w-6 h-6 md:w-7 md:h-7 text-accent" />
              </div>
              <div>
                <h3 className="font-display text-xl md:text-2xl font-medium text-text">Prish Infotech</h3>
                <p className="text-[9px] md:text-[10px] tracking-[0.2em] font-medium text-accent uppercase opacity-70">The Modern Standard</p>
              </div>
            </div>

            <ul className="space-y-6 md:space-y-8 relative">
              {comparisonData.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 md:gap-4 group/item">
                  <div className="mt-1 flex-shrink-0 w-5 h-5 md:w-6 md:h-6 rounded-full border border-accent/30 flex items-center justify-center bg-accent/5">
                    <Check className="w-3 md:w-3.5 h-3 md:h-3.5 text-accent" strokeWidth={2} />
                  </div>
                  <span className="font-sans text-base md:text-xl font-normal text-text/90 leading-snug">
                    {item.pros}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* VS Divider (Mobile Only) */}
          <div className="flex md:hidden items-center justify-center py-2 relative">
            <div className="absolute w-full h-px bg-border/40" />
            <div className="relative z-10 glass px-4 py-1 rounded-full text-[10px] font-medium text-text-secondary uppercase tracking-widest border-border">
              VS
            </div>
          </div>

          {/* RIGHT SIDE: Others */}
          <div className="p-6 sm:p-10 md:p-16 border-t md:border-t-0 md:border-l border-border/40">
            <div className="flex items-center gap-4 md:gap-5 mb-8 md:mb-12 opacity-40">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl glass flex items-center justify-center">
                <Users className="w-6 h-6 md:w-7 md:h-7 text-text-secondary" />
              </div>
              <div>
                <h3 className="font-display text-xl md:text-2xl font-medium text-text-secondary">Others</h3>
                <p className="text-[9px] md:text-[10px] tracking-[0.2em] font-medium text-text-secondary uppercase">Traditional Firms</p>
              </div>
            </div>

            <ul className="space-y-6 md:space-y-8">
              {comparisonData.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 md:gap-4 opacity-30">
                  <div className="mt-1 flex-shrink-0 w-5 h-5 md:w-6 md:h-6 rounded-full border border-text-secondary/30 flex items-center justify-center">
                    <X className="w-3 md:w-3.5 h-3 md:h-3.5 text-text-secondary" strokeWidth={2} />
                  </div>
                  <span className="font-sans text-base md:text-xl font-normal text-text-secondary leading-snug">
                    {item.cons}
                  </span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>

      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-accent/5 blur-[80px] md:blur-[120px] rounded-full pointer-events-none z-0" />
    </section>
  );
}