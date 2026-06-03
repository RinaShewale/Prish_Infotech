import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { PlayCircle } from "lucide-react";

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
    <div className="bg-bg2 border border-border rounded-xl p-5 h-full overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-text">Saved Lessons</h2>
        <span className="px-3 py-1 rounded-full bg-white/5 text-text-secondary text-xs border border-border">
          {bookmarks?.length || 0} Saved
        </span>
      </div>

      {bookmarks?.length === 0 ? (
        <div className="flex items-center justify-center h-40">
          <p className="text-text-secondary">No bookmarks found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {bookmarks.map((item) => (
            <div
              key={item._id}
              className="group p-4 rounded-xl bg-card border border-border hover:border-accent/30 transition-all flex items-center justify-between gap-4"
            >
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-text truncate">
                  {item.lesson?.title}
                </h3>
                {item.course?.title && (
                  <p className="text-xs text-text-secondary mt-1 truncate">
                    {item.course?.title}
                  </p>
                )}
              </div>

              <button
                onClick={() =>
                  navigate(
                    `/classroom/course/${item.course?._id}/lecture/${item.lesson?._id}`
                  )
                }
                className="shrink-0 p-2.5 rounded-lg bg-accent/20 text-accent hover:bg-accent hover:text-white transition-all flex items-center justify-center"
                title="Continue Learning"
              >
                <PlayCircle size={20} fill="currentColor" fillOpacity={0.2} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookmarkList;