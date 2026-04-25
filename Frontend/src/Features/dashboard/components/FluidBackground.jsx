import React from "react";
import { motion } from "motion/react";

const FluidBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-bg">
      
      {/* Noise layer */}
      <div className="noise-bg" />

      {/* SVG Background */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1024 768"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <radialGradient id="glow1" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.15" />
            <stop offset="100%" stopColor="var(--color-bg)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Glow circles (animated - safe) */}
        <motion.circle
          cx="800"
          cy="200"
          r="300"
          fill="url(#glow1)"
          animate={{
            cx: [800, 850, 800],
            cy: [200, 150, 200],
            r: [300, 320, 300],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        <motion.circle
          cx="150"
          cy="600"
          r="250"
          fill="url(#glow1)"
          animate={{
            cx: [150, 100, 150],
            cy: [600, 650, 600],
            r: [250, 270, 250],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* FIXED CURVES (NO d animation → stable + visible) */}

        <motion.path
          d="M-100 400 Q 200 200 500 400 T 1124 400"
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="1"
          opacity="0.25"
          animate={{
            y: [0, -8, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.path
          d="M-100 520 Q 300 300 600 520 T 1124 520"
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="0.7"
          opacity="0.15"
          animate={{
            y: [0, 6, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </svg>
    </div>
  );
};

export default FluidBackground;