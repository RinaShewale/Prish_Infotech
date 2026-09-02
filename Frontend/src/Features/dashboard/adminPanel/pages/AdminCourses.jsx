import { useEffect, useState } from 'react';
import { useCourse } from '../../Courses/hooks/useCourse'; // Using your new hook
import { useSelector } from 'react-redux'; // To get courses from Redux state
import { GlassCard } from '../Shared/GlassCard';
import { TableSkeleton } from '../Shared/TableSkeleton';
import { useNavigate } from 'react-router-dom';
import {
  Search, PlusCircle, Trash2, Edit2, X, Save, BookOpen,
} from 'lucide-react';
import toast from 'react-hot-toast';

// ── EDIT MODAL ──────────────────────────────────────────────────────────────
const EditModal = ({ course, onClose, onSave }) => {
  const [form, setForm] = useState({
    title: course.title || '',
    description: course.description || '',
    price: course.price || '',
    oldPrice: course.oldPrice || '',
    level: course.level || 'beginner',
    type: course.type || 'recorded',
    accessDuration: course.accessDuration || 'Lifetime Access',
    heroQuote: course.heroQuote || '',
    heroHighlight: course.heroHighlight || '',
    thumbnail: course.thumbnail || '',
    video: course.video || '',
  });

  const field = (key) => ({
    value: form[key],
    onChange: (e) => setForm((prev) => ({ ...prev, [key]: e.target.value })),
    className:
      'w-full bg-white/5 border border-white/10 rounded-xl p-3 outline-none focus:border-accent transition-colors text-sm',
  });

  const labelCls = "text-[10px] text-text-secondary uppercase font-bold block mb-1 tracking-widest";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
      <GlassCard className="w-full max-w-2xl p-8 space-y-6 relative max-h-[90vh] overflow-y-auto custom-scrollbar">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-display font-bold italic">Edit Course</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-text-secondary hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className={labelCls}>Title</label>
            <input {...field('title')} />
          </div>
          <div className="md:col-span-2">
            <label className={labelCls}>Description</label>
            <textarea rows={3} {...field('description')} className={field('description').className} />
          </div>
          <div>
            <label className={labelCls}>Price (INR)</label>
            <input type="number" {...field('price')} />
          </div>
          <div>
            <label className={labelCls}>Old Price (INR)</label>
            <input type="number" {...field('oldPrice')} />
          </div>
          <div>
            <label className={labelCls}>Level</label>
            <select {...field('level')}>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>Type</label>
            <select {...field('type')}>
              <option value="recorded">Recorded</option>
              <option value="live">Live</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>Access Duration</label>
            <input {...field('accessDuration')} />
          </div>
          <div>
            <label className={labelCls}>Hero Quote</label>
            <input {...field('heroQuote')} />
          </div>
          <div className="md:col-span-2">
            <label className={labelCls}>Hero Highlight</label>
            <input {...field('heroHighlight')} />
          </div>
          <div className="md:col-span-2">
            <label className={labelCls}>Thumbnail URL</label>
            <input {...field('thumbnail')} />
          </div>
          <div className="md:col-span-2">
            <label className={labelCls}>Video URL</label>
            <input {...field('video')} />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-white/5 border border-white/10 rounded-full text-sm hover:bg-white/10 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(form)}
            className="flex items-center gap-2 px-6 py-3 bg-accent text-bg rounded-full font-bold hover:scale-105 transition-transform text-sm"
          >
            <Save className="w-4 h-4" /> Save Changes
          </button>
        </div>
      </GlassCard>
    </div>
  );
};

export { EditModal };

// ── ADMIN COURSES PAGE ───────────────────────────────────────────────────────
const AdminCourses = () => {
  const navigate = useNavigate();

  // Destructure hook methods
  const { handleGetCourses, handleDeleteCourse, handleUpdateCourse } = useCourse();

  // Get data directly from Redux state
  const { courses, loading } = useSelector((state) => state.course);

  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    handleGetCourses();
  }, [handleGetCourses]);

  const filtered = courses.filter((c) => {
    const matchSearch =
      c.title?.toLowerCase().includes(search.toLowerCase()) ||
      c.slug?.toLowerCase().includes(search.toLowerCase());
    const matchLevel = levelFilter === 'all' || c.level === levelFilter;
    return matchSearch && matchLevel;
  });

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    const res = await handleDeleteCourse(id);
    if (res.success) {
      toast.success("Course deleted successfully");
    } else {
      toast.error(res.message);
    }
  };

  const handleSave = async (form) => {
    const res = await handleUpdateCourse(editing._id, form);
    if (res.success) {
      toast.success("Course updated successfully");
      setEditing(null);
    } else {
      toast.error(res.message);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      {editing && (
        <EditModal course={editing} onClose={() => setEditing(null)} onSave={handleSave} />
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-4xl font-display font-bold italic tracking-tight">Course Management</h1>
          <p className="text-text-secondary mt-1">{courses.length} total cohorts deployed on the platform.</p>
        </div>
        <button
          onClick={() => navigate('/admin/courses/create')}
          className="flex items-center gap-2 px-6 py-3 bg-accent text-bg rounded-full font-bold hover:scale-105 transition-transform text-sm"
        >
          <PlusCircle className="w-4 h-4" /> New Course
        </button>
      </div>

      {/* Filters */}
      <GlassCard className="p-4 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
          <input
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-accent transition-colors text-sm"
            placeholder="Search by title or slug..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          value={levelFilter}
          onChange={(e) => setLevelFilter(e.target.value)}
          className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl outline-none text-sm text-white"
        >
          <option value="all" className="bg-black">All Levels</option>
          <option value="beginner" className="bg-black">Beginner</option>
          <option value="intermediate" className="bg-black">Intermediate</option>
          <option value="advanced" className="bg-black">Advanced</option>
        </select>
      </GlassCard>

      {/* Table */}
      <GlassCard className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left border-b border-white/5 bg-white/[0.01]">
              <th className="p-6 text-[10px] uppercase tracking-widest text-text-secondary font-bold">Course</th>
              <th className="p-6 text-[10px] uppercase tracking-widest text-text-secondary font-bold">Level</th>
              <th className="p-6 text-[10px] uppercase tracking-widest text-text-secondary font-bold">Type</th>
              <th className="p-6 text-[10px] uppercase tracking-widest text-text-secondary font-bold">Price</th>
              <th className="p-6 text-[10px] uppercase tracking-widest text-text-secondary font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <TableSkeleton rows={6} cols={5} />
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-12 text-center text-text-secondary">
                  <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-20" />
                  <p>No courses found.</p>
                </td>
              </tr>
            ) : (
              filtered.map((course) => (
                <tr
                  key={course._id}
                  onClick={() => navigate(`/admin/courses/${course.slug}`)}
                  className="border-b border-white/5 hover:bg-white/[0.015] transition-colors group cursor-pointer"
                >
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      {course.thumbnail ? (
                        <img src={course.thumbnail} alt="" className="w-12 h-8 rounded-lg object-cover grayscale group-hover:grayscale-0 transition-all" />
                      ) : (
                        <div className="w-12 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                          <BookOpen className="w-4 h-4 text-text-secondary" />
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-bold text-white">{course.title}</p>
                        <p className="text-[11px] text-text-secondary font-mono">{course.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <span className="text-[10px] px-2 py-1 rounded-full border border-white/10 bg-white/5 font-bold uppercase">
                      {course.level}
                    </span>
                  </td>
                  <td className="p-6">
                    <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase border ${course.type === 'live'
                      ? 'border-accent/30 bg-accent/10 text-accent'
                      : 'border-white/10 bg-white/5 text-text-secondary'
                      }`}>
                      {course.type}
                    </span>
                  </td>
                  <td className="p-6 text-sm font-mono text-accent">₹{course.price?.toLocaleString()}</td>
                  <td className="p-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditing(course);
                        }}
                        className="p-2 hover:bg-white/5 rounded-lg text-text-secondary hover:text-accent transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(course._id, course.title)}
                        className="p-2 hover:bg-red-400/10 rounded-lg text-text-secondary hover:text-red-400 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </GlassCard>
    </div>
  );
};

export default AdminCourses;