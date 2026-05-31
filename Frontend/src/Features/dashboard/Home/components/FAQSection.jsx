import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";

const FAQItem = ({ question, answer, isOpen, onClick }) => {
  return (
    <div
      className={`glow-card rounded-xl mb-3 border transition-all duration-500 ${isOpen ? "border-accent/40 bg-card/20" : "border-border/40 bg-transparent"
        }`}
    >
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between p-4 md:p-5 text-left cursor-pointer group"
      >
        <span className={`text-[17px] md:text-[19px] font-display font-normal tracking-tight transition-colors duration-300 ${isOpen ? "text-text" : "text-text-secondary group-hover:text-text"
          }`}>
          {question}
        </span>

        {/* Compact Interaction Icon */}
        <div className={`flex items-center justify-center w-8 h-8 rounded-full border transition-all duration-500 ${isOpen ? "bg-accent border-accent rotate-90" : "border-border group-hover:border-accent/50"
          }`}>
          <ChevronRight className={`w-4 h-4 transition-colors duration-300 ${isOpen ? "text-white" : "text-text-secondary"}`} />
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
      answer: "Yes, we provide beginner-friendly tracks alongside advanced modules. Our path starts with logic building and core principles before moving into production-scale architecture."
    },
    {
      question: "What technology stacks are covered in the curriculum?",
      answer: "We focus on high-demand modern stacks including MERN, Python Full Stack, and Cloud Engineering, ensuring you're ready for industry-standard roles."
    },
    {
      question: "Is there mentorship support available after hours?",
      answer: "Absolutely. Our private Discord community provides 24/7 access to mentors and peers, with dedicated review slots during weekends."
    },
    {
      question: "Do you offer flexible payment plans?",
      answer: "Yes, we offer EMI options and modular payment plans to ensure high-quality engineering education is accessible to serious learners."
    }
  ];

  return (
    <section className="py-20 px-6 relative">
      <div className="max-w-3xl mx-auto">

        {/* Header - Fixed to match 2nd image exactly */}
        <div className="text-center mb-12">
          {/* Rectangular Badge style from 2nd image */}
          <div className="inline-block px-4 py-1 border border-accent/20 mb-4 md:mb-6 bg-accent/5">
            <span className="text-accent text-[8px] md:text-[10px] tracking-[0.4em] uppercase font-bold">
              FAQS
            </span>
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