import React from "react";
import { motion } from "motion/react";
import StudentCard from "./StudentCard";

const testimonials = [
  {
    name: "Mohd Siraj",
    role: "Web Developer",
    rating: 4.1,
    testimonial: "I Had A Great Experience At Prish Infotech. The Teachers Are Highly Supportive And Knowledgeable. They Explain Everything in Detail.",
    image: "https://i.pravatar.cc/150?u=1"
  },
  {
    name: "Mukti Prasad Dash",
    role: "Full Stack Developer",
    rating: 4.3,
    testimonial: "Prish Infotech Is An Excellent Institute For Learning Coding. The Teachers Explain Concepts In A Simple Way.",
    image: "https://i.pravatar.cc/150?u=2"
  },
  {
    name: "Pradum Nayak",
    role: "MERN Stack Developer",
    rating: 4.8,
    testimonial: "Prish Infotech is one of the best platforms for coding! The mentors are extremely helpful and the projects are industry-standard.",
    image: "https://i.pravatar.cc/150?u=3"
  }
];

const TestimonialSection = () => {
  // Triple the data to ensure the scroll is seamless on all screen widths
  const scrollData = [...testimonials, ...testimonials, ...testimonials];

  return (
    <div className="w-full py-20 overflow-hidden">
      <div className="text-center mb-16 px-6">
        <div className="inline-block px-4 py-1 border border-accent/20 mb-6 bg-accent/5">
          <span className="text-accent text-[10px] tracking-[0.4em] uppercase font-bold">
            Hear from our students
          </span>
        </div>
        <h2 className="font-display text-5xl md:text-6xl text-white tracking-tight">
          We Help Learners Become <br />
          <span className="text-white/80">Industry-Ready Developers.</span>
        </h2>
      </div>

      {/* Infinite Scroller */}
      <div className="flex relative">
        <motion.div
          className="flex shrink-0"
          animate={{ x: ["0%", "-33.33%"] }}
          transition={{
            ease: "linear",
            duration: 30,
            repeat: Infinity,
          }}
          // Pause animation on hover for better user experience
          whileHover={{ animationPlayState: "paused" }}
        >
          {scrollData.map((t, index) => (
            <StudentCard key={index} {...t} />
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default TestimonialSection;