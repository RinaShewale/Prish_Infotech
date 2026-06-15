import React, { useEffect } from "react";
import { Bell, Circle, Clock } from "lucide-react";
import { useNotification } from "../../Classroom/hook/useNotification";

const NotificationPanel = () => {
  const { notifications, fetchNotifications, loading } = useNotification();

  useEffect(() => {
    // Initial fetch
    fetchNotifications();

    // Polling for updates
    const interval = setInterval(() => {
      fetchNotifications();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Determine UI states
  const showSkeleton = loading && notifications.length === 0;
  const showEmpty = !loading && notifications.length === 0;

  return (
    <div className="glass p-6 rounded-[2rem] flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 px-1">
        <h3 className="text-sm font-display font-bold text-text tracking-tight flex items-center gap-2">
          Notifications
          {loading && <div className="w-1 h-1 rounded-full bg-primary animate-pulse" />}
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {/* LOADING STATE (Skeletons) */}
        {showSkeleton ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3 p-4 animate-pulse">
                <div className="w-2 h-2 rounded-full bg-white/10 mt-1" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-24 bg-white/10 rounded" />
                  <div className="h-2 w-full bg-white/5 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : showEmpty ? (
          /* EMPTY STATE */
          <div className="h-full flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-4 text-text/20">
              <Bell size={24} />
            </div>
            <p className="text-sm font-semibold text-text/60">All caught up</p>
            <p className="text-[11px] text-text/40 mt-1 max-w-[180px]">
              No new updates at the moment.
            </p>
          </div>
        ) : (
          /* NOTIFICATION LIST */
          <div className="space-y-2">
            {notifications.map((n) => (
              <div
                key={n._id}
                className="group relative p-4 rounded-2xl transition-all duration-200 hover:bg-white/5 active:scale-[0.98] cursor-pointer"
              >
                <div className="flex gap-3">
                  <div className="mt-1">
                    <Circle size={8} className="fill-primary text-primary" />
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <p className="font-bold text-[13px] text-text leading-tight">
                        {n.title}
                      </p>
                      <div className="flex items-center gap-1 opacity-30">
                        <Clock size={10} />
                        <span className="text-[9px]">Now</span>
                      </div>
                    </div>
                    <p className="text-[12px] text-text/60 leading-relaxed line-clamp-2">
                      {n.message}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationPanel;