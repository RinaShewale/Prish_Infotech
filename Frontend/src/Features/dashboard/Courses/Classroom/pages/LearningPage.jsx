import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, PlayCircle, CheckCircle2, Lock } from 'lucide-react';
import { coursesData } from '../data/courses';

const LearningPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const course = coursesData.find(c => c.id === courseId);

  return (
    <div className="h-full flex flex-col animate-in">
      <button 
        onClick={() => navigate('/classroom')}
        className="flex items-center gap-2 text-white/40 hover:text-accent mb-8 transition-colors group w-fit"
      >
        <div className="p-2 rounded-xl bg-white/5 group-hover:bg-accent/10">
          <ChevronLeft size={20} />
        </div>
        <span className="text-sm font-bold uppercase tracking-widest">Back to Dashboard</span>
      </button>

      <div className="grid grid-cols-12 gap-8 flex-1 overflow-hidden">
        {/* Course Info Card */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
          <div className="glass rounded-[2.5rem] p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8">
                <div className="w-12 h-12 rounded-2xl bg-accent/20 flex items-center justify-center text-accent font-bold">
                    {course.progress}%
                </div>
            </div>
            <img src={course.image} className="w-24 h-24 rounded-3xl object-cover mb-6 border-2 border-white/10" alt="" />
            <h1 className="text-3xl font-bold mb-4 leading-tight">{course.title}</h1>
            <p className="text-white/50 text-sm leading-relaxed mb-8">
              This track covers advanced principles. Complete all modules to earn your certification of excellence.
            </p>
            <div className="space-y-4">
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-white/30">
                    <span>Course Progress</span>
                    <span>{course.progress}%</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-accent" style={{ width: `${course.progress}%` }} />
                </div>
            </div>
          </div>
        </div>

        {/* Modules List */}
        <div className="col-span-12 lg:col-span-8 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto pr-4 space-y-4 custom-scrollbar">
            {course.modules.map((mod, idx) => (
              <div
                key={mod.id}
                onClick={() => !mod.locked && navigate(`lecture/${mod.id}`)}
                className={`glass p-6 rounded-3xl flex items-center justify-between group transition-all duration-300 ${mod.locked ? 'opacity-50 cursor-not-allowed' : 'hover:border-accent/50 cursor-pointer hover:bg-white/[0.05]'}`}
              >
                <div className="flex items-center gap-6">
                  <div className="text-4xl font-display font-black text-white/5 group-hover:text-accent/20 transition-colors">
                    {String(idx + 1).padStart(2, '0')}
                  </div>
                  <div>
                    <h4 className="font-bold text-lg group-hover:text-accent transition-colors">{mod.title}</h4>
                    <p className="text-[10px] text-white/40 uppercase font-black tracking-widest mt-1">{mod.duration} • Theoretical Lab</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                    {mod.completed ? (
                        <CheckCircle2 className="text-accent" size={28} />
                    ) : mod.locked ? (
                        <Lock className="text-white/20" size={24} />
                    ) : (
                        <div className="p-3 rounded-2xl bg-accent/10 text-accent group-hover:bg-accent group-hover:text-black transition-all">
                            <PlayCircle size={24} fill="currentColor" fillOpacity={0.2} />
                        </div>
                    )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningPage;