import React, { useEffect, useContext } from "react";
import { motion } from "motion/react";
import { StudentCard } from "./StudentCard";
import { ReviewContext } from "../../dashboard/components/context/ReviewContext";

export const TestimonialSection = () => {
  const { reviews, handleGetReviews, loading } = useContext(ReviewContext);

  useEffect(() => {
    handleGetReviews();
  }, []);

  // ✅ FIX: Filter out any reviews that don't have a valid user or name
  // This ensures "Anonymous" never shows up.
  const validReviews = reviews?.filter(rev => rev.user && rev.user.name) || [];

  // Use filtered reviews if available, otherwise use your fallback data
  const displayData = validReviews.length > 0 ? validReviews : [
    {
      user: { name: "Mohd Siraj", profilePic: "https://i.pravatar.cc/150?u=1" },
      rating: 5,
      comment: "Great experience at Prish Infotech. Supportive teachers!"
    }
  ];

  // Quadruple data for a perfect fast infinite loop
  const scrollData = [...displayData, ...displayData, ...displayData, ...displayData];

  if (displayData.length === 0 && !loading) return null;

  return (
    <div className="w-full py-12 md:py-20 overflow-hidden ">
      <div className="text-center mb-10 md:mb-16 px-6">
        <div className="inline-block px-4 py-1 border border-accent/20 mb-4 md:mb-6 bg-accent/5 rounded-full">
          <span className="text-accent text-[8px] md:text-[10px] tracking-[0.4em] uppercase font-bold">
            Hear from our students
          </span>
        </div>
        <h2 className="font-display text-3xl sm:text-4xl md:text-6xl text-white tracking-tight leading-tight">
          We Help Learners Become <br className="hidden md:block" />
          <span className="text-white/80">Industry-Ready Developers.</span>
        </h2>
      </div>

      {/* Infinite Scroller */}
      <div className="flex relative w-full group">
        {/* Fade Edges */}
        <div className="absolute left-0 top-0 bottom-0 w-20 md:w-60 bg-gradient-to-r  to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 md:w-60 bg-gradient-to-l  to-transparent z-20 pointer-events-none" />

        <motion.div
          className="flex flex-nowrap shrink-0 gap-4 md:gap-10 px-4"
          animate={{ x: ["0%", "-25%"] }}
          transition={{
            ease: "linear",
            duration: 12, // Fast speed
            repeat: Infinity,
          }}
          whileHover={{ animationPlayState: "paused" }}
        >
          {scrollData.map((rev, index) => (
            <StudentCard
              key={index}
              name={rev.user?.name}
              role="Verified Student"
              rating={rev.rating}
              testimonial={rev.comment}
              image={rev.user?.avatar}   // ✅ FIXED HERE
            />

          ))}
        </motion.div>
      </div>
    </div>
  );
};