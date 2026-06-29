import React, { useEffect, useState } from 'react';
import { useEnrollment } from '../../Courses/hooks/useEnrollment';
import { GlassCard } from '../Shared/GlassCard';
import { TableSkeleton } from '../Shared/TableSkeleton';
import { Search, BookOpen, Eye } from 'lucide-react'; // ✅ removed Mail + Block icons
import { useNavigate } from "react-router-dom";

const Enrollments = () => {
  const { enrollments, loading, fetchEnrollments } = useEnrollment();
  const [search, setSearch] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const filtered = enrollments?.filter((en) =>
    en.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
    en.user?.email?.toLowerCase().includes(search.toLowerCase()) ||
    en.course?.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-4xl font-display font-bold italic tracking-tight">
            Enrolled Students
          </h1>
          <p className="text-text-secondary mt-1">
            {enrollments?.length || 0} active course enrollments found.
          </p>
        </div>
      </div>

      {/* SEARCH */}
      <GlassCard className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
          <input
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-accent transition-colors text-sm"
            placeholder="Search by student name, email or course title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </GlassCard>

      {/* TABLE */}
      <GlassCard className="p-2 overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left border-b border-white/5 bg-white/[0.01]">
              <th className="p-6 text-[10px] uppercase tracking-widest text-text-secondary font-bold">
                Student Identity
              </th>
              <th className="p-6 text-[10px] uppercase tracking-widest text-text-secondary font-bold">
                Enrolled Course
              </th>
              <th className="p-6 text-[10px] uppercase tracking-widest text-text-secondary font-bold">
                Enrollment Date
              </th>
              <th className="p-6 text-[10px] uppercase tracking-widest text-text-secondary font-bold">
                Account Status
              </th>
              <th className="p-6 text-[10px] uppercase tracking-widest text-text-secondary font-bold text-right">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <TableSkeleton rows={8} cols={5} />
            ) : (
              filtered?.map((en) => (
                <tr
                  key={en._id}
                  className="border-b border-white/5 hover:bg-white/[0.01] transition-colors group"
                >
                  {/* STUDENT */}
                  <td className="p-6">
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          en.user?.avatar ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            en.user?.name || 'U'
                          )}&background=926868&color=fff`
                        }
                        className="w-10 h-10 rounded-full grayscale group-hover:grayscale-0 transition-all"
                        alt=""
                      />
                      <div>
                        <p className="text-sm font-bold text-white">
                          {en.user?.name || 'Unknown User'}
                        </p>
                        <p className="text-[11px] text-text-secondary">
                          {en.user?.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* COURSE */}
                  <td className="p-6">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-3 h-3 text-accent" />
                      <p className="text-sm font-medium">
                        {en.course?.title || 'Course Deleted'}
                      </p>
                    </div>
                  </td>

                  {/* DATE */}
                  <td className="p-6 text-sm text-text-secondary">
                    {en.createdAt
                      ? new Date(en.createdAt).toLocaleDateString()
                      : 'N/A'}
                  </td>

                  {/* STATUS */}
                  <td className="p-6">
                    <span
                      className={`text-[10px] px-2 py-1 rounded-full uppercase font-bold border ${
                        en.user?.isBlocked
                          ? 'border-red-500/20 text-red-500 bg-red-500/5'
                          : 'border-green-500/20 text-green-500 bg-green-500/5'
                      }`}
                    >
                      {en.user?.isBlocked ? 'Blocked' : 'Active'}
                    </span>
                  </td>

                  {/* ACTION (ONLY ONE ICON NOW) */}
                  <td className="p-6 text-right">
                    <div className="flex justify-end gap-2">

                      {/* ✅ ONLY PROGRESS VIEW ICON */}
                      <button
                        onClick={() =>
                          navigate(
                            `/admin/course-progress/${en.course?._id}`
                          )
                        }
                        className="p-2 hover:bg-white/5 rounded-lg text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {!loading && filtered?.length === 0 && (
          <div className="p-20 text-center text-text-secondary text-sm">
            No enrolled students found.
          </div>
        )}
      </GlassCard>
    </div>
  );
};

export default Enrollments;