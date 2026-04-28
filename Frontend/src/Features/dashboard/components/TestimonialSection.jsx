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
  // Triple the data to ensure the scroll is seamless
  const scrollData = [...testimonials, ...testimonials, ...testimonials];

  return (
    <div className="w-full py-12 md:py-20 overflow-hidden">
      <div className="text-center mb-10 md:mb-16 px-6">
        <div className="inline-block px-4 py-1 border border-accent/20 mb-4 md:mb-6 bg-accent/5">
          <span className="text-accent text-[8px] md:text-[10px] tracking-[0.4em] uppercase font-bold">
            Hear from our students
          </span>
        </div>
        {/* Responsive font size: 3xl on mobile, 6xl on desktop */}
        <h2 className="font-display text-3xl sm:text-4xl md:text-6xl text-white tracking-tight leading-tight">
          We Help Learners Become <br className="hidden md:block" />
          <span className="text-white/80">Industry-Ready Developers.</span>
        </h2>
      </div>

      {/* Infinite Scroller */}
      <div className="flex relative w-full">
        <motion.div
          // flex-nowrap and gap are essential for preventing card overlap
          className="flex flex-nowrap shrink-0 gap-4 md:gap-6"
          animate={{ x: ["0%", "-33.33%"] }}
          transition={{
            ease: "linear",
            duration: 30,
            repeat: Infinity,
          }}
          whileHover={{ animationPlayState: "paused" }}
        >
          {scrollData.map((t, index) => (
            // shrink-0 ensures the card keeps its width on mobile
            // w-[300px] on mobile, w-[400px] on desktop
            <div key={index} className="w-[300px] md:w-[400px] shrink-0">
              <StudentCard {...t} />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default TestimonialSection;