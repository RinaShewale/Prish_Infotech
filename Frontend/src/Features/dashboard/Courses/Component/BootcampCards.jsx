import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Monitor,
  Users,
  Check,
  ChevronRight,
  Globe,
  MapPin,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBootcamps } from "../../Courses/redux/bootcampSlice";

const iconMap = {
  online: <Monitor className="w-6 h-6 md:w-7 md:h-7" />,
  offline: <Users className="w-6 h-6 md:w-7 md:h-7" />,
};

// -----------------------------
// SKELETON
// -----------------------------
const SkeletonCard = () => (
  <div className="glass p-8 md:p-14 rounded-[2rem] md:rounded-[3rem] border border-white/5 animate-pulse">
    <div className="flex justify-between items-start mb-8">
      <div className="w-16 h-16 bg-white/10 rounded-2xl" />
      <div className="w-24 h-8 bg-white/10 rounded-full" />
    </div>
    <div className="h-10 bg-white/10 rounded-lg w-3/4 mb-4" />
    <div className="h-4 bg-white/5 rounded-lg w-full mb-10" />
    <div className="space-y-4 mb-12">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-4 bg-white/5 rounded-md w-full" />
      ))}
    </div>
    <div className="h-14 bg-white/10 rounded-2xl w-full" />
  </div>
);

// -----------------------------
// FEATURE ITEM
// -----------------------------
const FeatureItem = ({ text, index }) => (
  <motion.li
    initial={{ opacity: 0, x: -10 }}
    whileInView={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.1 }}
    className="flex items-start gap-3 md:gap-4 text-text-secondary group/item"
  >
    <div className="mt-1 flex-shrink-0 rounded-full p-1 bg-accent/10 border border-accent/20 group-hover/item:bg-accent/30 transition-all duration-300">
      <Check className="w-3 h-3 md:w-3.5 md:h-3.5 text-accent" />
    </div>
    <span className="text-sm md:text-base leading-relaxed group-hover/item:text-text transition-colors">
      {text}
    </span>
  </motion.li>
);

export default function BootcampCards() {
  const dispatch = useDispatch();
  const bootcampState = useSelector((state) => state.bootcamp || {});
  const bootcamps = bootcampState.bootcamps || [];
  const loading = bootcampState.loading || false;

  useEffect(() => {
    dispatch(fetchBootcamps());
  }, [dispatch]);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 md:mb-24 lg:mb-32">
      <AnimatePresence mode="wait">
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10">
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10 items-stretch">
            {bootcamps.length === 0 ? (
              <p className="text-center text-text-secondary col-span-2">
                No bootcamps found
              </p>
            ) : (
              bootcamps.map((track) => {
                const type = track?.type || "online";

                return (
                  <motion.div
                    key={track._id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    whileHover={{ y: -8 }}
                    className={`glow-card glass relative overflow-hidden p-8 sm:p-10 md:p-14 rounded-[2.5rem] md:rounded-[3.5rem] flex flex-col group border transition-all duration-500
                      ${
                        type === "offline"
                          ? "bg-accent/[0.03] border-accent/30 shadow-[0_0_40px_-15px_rgba(var(--accent-rgb),0.2)]"
                          : "border-white/10 hover:border-accent/30"
                      }
                    `}
                  >
                    {/* TOP HEADER: Icon & Badge Positioned Together */}
                    <div className="flex justify-between items-start mb-8 md:mb-10">
                      {/* ICON */}
                      <div
                        className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center border transition-transform duration-500 group-hover:scale-110
                        ${
                          type === "offline"
                            ? "bg-accent text-bg border-accent shadow-lg shadow-accent/20"
                            : "bg-white/5 text-accent border-white/10 group-hover:border-accent/40"
                        }`}
                      >
                        {iconMap[type]}
                      </div>

                      {/* MODE BADGE: Now consistently in the top right */}
                      <div
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest border backdrop-blur-md
                        ${
                          type === "online"
                            ? "bg-blue-500/10 border-blue-500/20 text-blue-400"
                            : "bg-accent/10 border-accent/20 text-accent"
                        }`}
                      >
                        {type === "online" ? (
                          <Globe className="w-3 h-3 md:w-4 md:h-4" />
                        ) : (
                          <MapPin className="w-3 h-3 md:w-4 md:h-4" />
                        )}
                        {type}
                      </div>
                    </div>

                    {/* CONTENT SECTION */}
                    <div className="mb-8 flex-grow">
                      <div className="mb-4">
                        <h3 className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-accent/80 mb-2">
                          {track.level}
                        </h3>
                        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-text leading-tight italic">
                          {track.title}
                        </h2>
                      </div>

                      <p className="text-text-secondary/80 text-base md:text-lg leading-relaxed max-w-md">
                        {track.description}
                      </p>
                    </div>

                    {/* HIGHLIGHTS / FEATURES */}
                    <div className="mb-10">
                        <p className="text-[10px] font-bold uppercase text-text-secondary/40 tracking-[0.2em] mb-5">Program Highlights</p>
                        <ul className="space-y-4">
                        {(track.highlights || []).map((feature, index) => (
                            <FeatureItem
                            key={index}
                            index={index}
                            text={feature}
                            />
                        ))}
                        </ul>
                    </div>

                    {/* CTA BUTTON */}
                    <button
                      onClick={() =>
                        document
                          .getElementById("apply")
                          ?.scrollIntoView({ behavior: "smooth" })
                      }
                      className={`group/btn w-full py-4 md:py-6 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all duration-300
                      ${
                        type === "offline"
                          ? "bg-accent text-bg hover:shadow-[0_0_30px_-5px_rgba(var(--accent-rgb),0.5)]"
                          : "bg-white/5 border border-white/10 text-text hover:bg-white/10 hover:border-accent/40"
                      }`}
                    >
                      <span>Join The Program</span>
                      <ChevronRight className="w-5 h-5 transition-transform duration-300 group-hover/btn:translate-x-1" />
                    </button>
                  </motion.div>
                );
              })
            )}
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}