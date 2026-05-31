import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Download, MessageSquare, Share2 } from 'lucide-react';
import { coursesData } from '../data/courses';

const LecturePage = () => {
  const { courseId, lectureId } = useParams();
  const navigate = useNavigate();
  const course = coursesData.find(c => c.id === courseId);
  const module = course.modules.find(m => m.id === lectureId);

  return (
    <div className="h-full flex flex-col">
       <div className="flex items-center justify-between mb-8">
          <button onClick={() => navigate(-1)} className="flex items-center gap-3 text-white/40 hover:text-white transition-all group">
            <div className="p-2 rounded-xl bg-white/5 group-hover:bg-white/10"><ChevronLeft size={20} /></div>
            <span className="text-xs font-black uppercase tracking-widest">Exit Player</span>
          </button>
          <div className="text-center">
            <p className="text-[10px] font-black text-accent uppercase tracking-[0.3em] mb-1">{course.title}</p>
            <h2 className="text-xl font-bold">{module.title}</h2>
          </div>
          <div className="flex gap-2">
            <button className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors"><Share2 size={18} /></button>
            <button className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors"><MessageSquare size={18} /></button>
          </div>
       </div>

       <div className="grid grid-cols-12 gap-8 flex-1 overflow-hidden pb-6">
          {/* Main Video Area */}
          <div className="col-span-12 xl:col-span-9 flex flex-col gap-6">
             <div className="flex-1 bg-black rounded-[3rem] overflow-hidden border border-white/5 shadow-2xl relative group">
                <video 
                    controls 
                    className="w-full h-full object-cover shadow-[0_0_50px_rgba(0,0,0,0.5)]"
                    poster={course.image}
                    src={module.videoUrl}
                />
             </div>
             
             <div className="glass p-8 rounded-[2.5rem] flex justify-between items-center">
                <div>
                    <h3 className="text-xl font-bold mb-1">Module Resources</h3>
                    <p className="text-xs text-white/40">Download assets, source code, and lecture transcripts.</p>
                </div>
                <button className="flex items-center gap-3 px-8 py-4 bg-accent text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:brightness-110 transition-all active:scale-95 shadow-xl shadow-accent/20">
                    <Download size={18} /> Download Pack (.ZIP)
                </button>
             </div>
          </div>

          {/* Sidebar Playlist */}
          <div className="hidden xl:flex col-span-3 flex-col overflow-hidden">
             <div className="glass rounded-[2.5rem] flex-1 overflow-hidden flex flex-col">
                <div className="p-6 border-b border-white/5">
                    <h4 className="font-bold uppercase tracking-widest text-xs text-white/40">Course Content</h4>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                   {course.modules.map((m, idx) => (
                      <div 
                        key={m.id} 
                        onClick={() => !m.locked && navigate(`/classroom/course/${courseId}/lecture/${m.id}`)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer group ${m.id === lectureId ? 'bg-accent/10 border-accent/30' : 'border-transparent hover:bg-white/5'}`}
                      >
                         <div className="flex items-center gap-3 mb-1">
                            <span className={`text-[10px] font-mono ${m.id === lectureId ? 'text-accent' : 'text-white/20'}`}>
                                {String(idx + 1).padStart(2, '0')}
                            </span>
                            <p className={`text-sm font-bold truncate ${m.id === lectureId ? 'text-white' : 'text-white/60'}`}>{m.title}</p>
                         </div>
                         <p className="text-[10px] text-white/30 uppercase tracking-tighter font-medium ml-7">{m.duration} • Video</p>
                      </div>
                   ))}
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};

export default LecturePage;