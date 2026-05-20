import React, { useLayoutEffect, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Loader2 } from "lucide-react";

import { useCourse } from "../hooks/useCourse";
import { CohortPage  } from "../Cohort/pages/CohortPage";

import { Nav } from "../../components/Nav";
import { Footer } from "../../components/Footer";
import { FluidBackground } from "../../components/FluidBackground";

export const CourseDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { handleGetSingleCourse } = useCourse();

  const { singleCourse: courseData, loading, error } = useSelector(
    (state) => state.course
  );

  useEffect(() => {
    if (slug) {
      handleGetSingleCourse(slug);
    }
  }, [slug]);

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [slug]);

  if (loading && !courseData) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-bg text-accent">
        <Loader2 className="w-12 h-12 animate-spin mb-4" />
        <p className="font-mono text-xs uppercase tracking-[0.3em] opacity-60">Initializing Cohort Data...</p>
      </div>
    );
  }

  if (error || (!loading && !courseData)) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-bg text-white px-6 text-center">
        <h2 className="text-4xl font-bold mb-4 tracking-tighter">Course Not Found</h2>
        <button 
          onClick={() => navigate("/")} 
          className="px-8 py-4 bg-accent text-bg font-black rounded-2xl uppercase text-xs tracking-widest hover:scale-105 transition-all"
        >
          Go Back Home
        </button>
      </div>
    );
  }

  return (
    <div className="bg-bg min-h-screen relative overflow-x-hidden">
      <div className="fixed inset-0 z-0 opacity-30 pointer-events-none">
        <FluidBackground />
      </div>
      <div className="relative z-50"><Nav /></div>
      <main className="relative z-10">
        <CohortPage courseData={courseData} />
      </main>
      <div className="relative z-10"><Footer /></div>
    </div>
  );
};