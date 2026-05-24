import React, {
  useRef,
  useLayoutEffect,
  useEffect,
} from "react";

import {
  motion,
  useInView,
} from "framer-motion";

import { Zap } from "lucide-react";

import gsap from "gsap";

import { useGSAP } from "@gsap/react";

import { useSelector } from "react-redux";

import { useCourse } from "../hooks/useCourse";

// Components

import { Nav } from "../../components/Nav";

import { FluidBackground } from "../../components/FluidBackground";

import { Footer } from "../../components/Footer";

import CourseCard from "../Component/CourseCard";

import ComparisonSection from "../../components/ComparisonSection";

import { FAQSection } from "../../components/FAQSection";

import { CTASection } from "../../components/CTASection";

export default function CoursesPage() {

  const containerRef = useRef(null);

  const { handleGetCourses } =
    useCourse();

  const {
    courses,
    loading,
    error,
  } = useSelector(
    (state) => state.course
  );

  // Fetch courses

  useEffect(() => {

    handleGetCourses();

  }, []);

  // Reset scroll

  useLayoutEffect(() => {

    const resetScroll = () => {

      window.scrollTo(0, 0);

      document.documentElement.scrollTop = 0;

      document.body.scrollTop = 0;
    };

    resetScroll();

    window.requestAnimationFrame(
      resetScroll
    );

  }, []);

  // 3D effect

  useGSAP(() => {

    const handleMouseMove = (
      e
    ) => {

      const {
        clientX,
        clientY,
      } = e;

      const xPos =
        (
          clientX /
          window.innerWidth -
          0.5
        ) * 10;

      const yPos =
        (
          clientY /
          window.innerHeight -
          0.5
        ) * 10;

      gsap.to(
        ".hero-3d-content",
        {
          rotationY: xPos,

          rotationX: -yPos,

          transformPerspective: 1200,

          duration: 0.6,

          ease: "power2.out",
        }
      );
    };

    window.addEventListener(
      "mousemove",
      handleMouseMove
    );

    return () =>
      window.removeEventListener(
        "mousemove",
        handleMouseMove
      );

  }, {
    scope: containerRef,
  });

  return (

    <div
      ref={containerRef}
      className="relative min-h-screen bg-bg text-text selection:bg-accent/30 overflow-x-hidden perspective-1000"
    >

      {/* Background */}

      <div className="fixed inset-0 z-0 pointer-events-none opacity-40">

        <FluidBackground />

      </div>

      <div className="fixed inset-0 z-1 bg-[linear-gradient(to_right,#2a232b_1px,transparent_1px),linear-gradient(to_bottom,#2a232b_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

      <div className="noise-bg z-1" />

      <div className="relative z-10">

        <Nav />

        <main className="pt-32 pb-24 px-6">

          {/* Hero */}

          <section className="max-w-7xl mx-auto py-20 text-center hero-3d-content">

            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}

              animate={{
                opacity: 1,
                y: 0,
              }}

              transition={{
                duration: 0.6,
                ease: "easeOut",
              }}
            >

              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/5 border border-accent/20 text-accent text-xs font-bold uppercase tracking-[0.3em] mb-10 backdrop-blur-sm">

                <Zap className="w-3 h-3 fill-accent animate-pulse" />

                Enrollment Open for 2025

              </div>

              <h1 className="font-display text-6xl md:text-8xl lg:text-[110px] leading-[0.9] tracking-tight mb-8 text-white">

                Master Your{" "}

                <span className="italic font-serif text-accent block md:inline mt-2">

                  Craft

                </span>

              </h1>

              <p className="max-w-2xl mx-auto text-lg md:text-xl text-white/60 font-light leading-relaxed mb-12">

                Premium cohort-based courses for software architects and high-growth engineers.

              </p>

            </motion.div>

          </section>

          {/* Courses */}

          <section className="max-w-7xl mx-auto py-12">

            {/* Loading */}

            {loading && (

              <div className="flex justify-center items-center py-20">

                <div className="w-12 h-12 border-4 border-accent/20 border-t-accent rounded-full animate-spin" />

              </div>
            )}

            {/* Error */}

            {!loading && error && (

              <div className="text-center text-red-400 text-lg">

                {error}

              </div>
            )}

            {/* Empty */}

            {!loading &&
              !error &&
              courses?.length === 0 && (

              <div className="text-center text-white/50 text-lg">

                No courses found

              </div>
            )}

            {/* Courses Grid */}

            {!loading &&
              !error &&
              courses?.length > 0 && (

              <motion.div
                initial="hidden"

                animate="visible"

                variants={{
                  hidden: {
                    opacity: 0,
                  },

                  visible: {
                    opacity: 1,

                    transition: {
                      staggerChildren: 0.08,
                    },
                  },
                }}

                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10"
              >

                {courses.map(
                  (course) => (

                    <motion.div
                      key={course._id}

                      variants={{
                        hidden: {
                          opacity: 0,
                          y: 20,
                          scale: 0.98,
                        },

                        visible: {
                          opacity: 1,
                          y: 0,
                          scale: 1,
                        },
                      }}

                      transition={{
                        duration: 0.4,
                      }}

                      className="group will-change-transform"
                    >

                      <div className="h-full transition-transform duration-300 group-hover:-translate-y-2">

                        <CourseCard
                          course={course}
                        />

                      </div>

                    </motion.div>
                  )
                )}

              </motion.div>
            )}

          </section>

          {/* Comparison */}

          <ScrollReveal
            rotateX={5}
            y={20}
          >

            <section className="mt-32">

              <div className="glass rounded-[48px] p-1 border-white/5 bg-linear-to-b from-white/5 to-transparent">

                <ComparisonSection />

              </div>

            </section>

          </ScrollReveal>

          {/* FAQ */}

          <ScrollReveal y={20}>

            <section className="mt-32 max-w-4xl mx-auto">

              <FAQSection />

            </section>

          </ScrollReveal>

          {/* CTA */}

          <ScrollReveal scale={0.98}>

            <section className="mt-32">

              <CTASection />

            </section>

          </ScrollReveal>

        </main>

        <Footer />

      </div>

    </div>
  );
}

function ScrollReveal({
  children,
  rotateX = 0,
  y = 20,
  scale = 1,
}) {

  const ref = useRef(null);

  const isInView =
    useInView(ref, {
      once: true,
    });

  return (

    <motion.div
      ref={ref}

      initial={{
        opacity: 0,
        y,
        rotateX,
        scale,
      }}

      animate={
        isInView
          ? {
              opacity: 1,
              y: 0,
              rotateX: 0,
              scale: 1,
            }
          : {}
      }

      transition={{
        duration: 0.6,

        ease: [
          0.22,
          1,
          0.36,
          1,
        ],
      }}

      style={{
        transformStyle:
          "preserve-3d",
      }}

      className="will-change-transform"
    >

      {children}

    </motion.div>
  );
}