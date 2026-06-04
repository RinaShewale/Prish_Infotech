import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { PlayCircle, Bookmark, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { getBookmarks } from "../bookmark.slice";

const BookmarkList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { bookmarks, loading } = useSelector((state) => state.bookmark);

  useEffect(() => {
    dispatch(getBookmarks());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-bg2/40 backdrop-blur-md border border-border/50 rounded-[2rem] p-5 md:p-8 h-full flex flex-col overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 md:mb-8 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
            <Bookmark size={18} />
          </div>
          <h2 className="text-sm md:text-base font-display font-bold uppercase tracking-[0.15em] text-text">
            Saved
          </h2>
        </div>
        <span className="px-3 py-1 rounded-lg bg-white/5 text-text-secondary text-[10px] font-black uppercase tracking-widest border border-border/30">
          {bookmarks?.length || 0} items
        </span>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
        {bookmarks?.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 opacity-40">
            <Bookmark size={32} className="mb-3" />
            <p className="text-[10px] font-black uppercase tracking-widest">No bookmarks yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {bookmarks.map((item, index) => (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  key={item._id}
                  className="group p-4 rounded-2xl bg-card/40 border border-border/30 hover:border-accent/40 hover:bg-white/[0.03] transition-all flex items-center justify-between gap-4 cursor-default"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-xs md:text-sm text-text truncate group-hover:text-accent transition-colors">
                      {item.lesson?.title || "Untitled Lesson"}
                    </h3>
                    {item.course?.title && (
                      <div className="flex items-center gap-2 mt-1">
                         <span className="text-[9px] font-black text-text-secondary uppercase tracking-tighter opacity-50 truncate">
                          {item.course?.title}
                        </span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() =>
                      navigate(
                        `/classroom/course/${item.course?._id}/lecture/${item.lesson?._id}`
                      )
                    }
                    className="shrink-0 w-10 h-10 rounded-xl bg-accent/10 text-accent hover:bg-accent hover:text-white transition-all flex items-center justify-center group/btn shadow-lg shadow-accent/5"
                    title="Continue Learning"
                  >
                    <PlayCircle size={18} className="group-hover/btn:scale-110 transition-transform" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookmarkList;