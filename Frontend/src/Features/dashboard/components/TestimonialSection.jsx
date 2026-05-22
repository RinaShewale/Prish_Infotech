import React, { useEffect, useContext } from "react";
import { motion } from "framer-motion"; // Changed to framer-motion for consistency
import { StudentCard } from "./StudentCard";
import { ReviewContext } from "../../dashboard/components/context/ReviewContext";

export const TestimonialSection = () => {
  const { reviews, handleGetReviews, loading } = useContext(ReviewContext);

  useEffect(() => {
    handleGetReviews();
  }, []);

  const validReviews = reviews?.filter((rev) => rev?.user?.name || rev?.name) || [];

  const displayData = validReviews.length > 0
    ? validReviews.map((rev) => ({
        name: rev.user?.name || rev.name,
        avatar: rev.user?.avatar || rev.avatar,
        rating: rev.rating || 5,
        comment: rev.comment || "",
      }))
    : [
        {
          name: "Mohd Siraj",
          avatar: null, // Testing the fallback
          rating: 5,
          comment: "Great experience at Prish Infotech. Supportive teachers!",
        },
        {
          name: "Ananya Sharma",
          avatar: "https://i.pravatar.cc/150?u=2",
          rating: 5,
          comment: "The curriculum is very up-to-date with industry standards.",
        },
      ];

  // Double the data for seamless looping
  const scrollData = [...displayData, ...displayData];

  if (!loading && displayData.length === 0) return null;

  return (
    <div className="w-full py-20 md:py-32 overflow-hidden bg-bg">
      <div className="text-center mb-16 px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-block px-4 py-1 border border-accent/20 mb-6 bg-accent/5 "
        >
          <span className="text-accent text-[10px] tracking-[0.4em] uppercase font-bold">
            Success Stories
          </span>
        </motion.div>

        <h2 className="font-display text-4xl md:text-6xl text-white tracking-tight leading-[1.1]">
          We Help Learners Become <br className="hidden md:block" />
          <span className="text-white/40">Industry-Ready Developers.</span>
        </h2>
      </div>

      {/* Infinite Scroller Container */}
      <div className="relative flex overflow-hidden">
        {/* Gradient Overlays for smooth fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-32 md:w-60 bg-gradient-to-r from-bg to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 md:w-60 bg-gradient-to-l from-bg to-transparent z-10 pointer-events-none" />

        <motion.div
          className="flex flex-nowrap gap-6 md:gap-10 px-6"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            ease: "linear",
            duration: 25, // Slower for readability
            repeat: Infinity,
          }}
        >
          {scrollData.map((rev, index) => (
            <StudentCard
              key={index}
              name={rev.name}
              role="Verified Student"
              rating={rev.rating}
              testimonial={rev.comment}
              image={rev.avatar}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
};