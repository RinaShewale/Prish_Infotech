import React from 'react';
import PageLayout from './PageLayout'; // Adjust path if needed

export const Hiring = () => {
  return (
    <PageLayout title="Hire From Us" subtitle="Talent Acquisition">
      <div className="grid md:grid-cols-2 gap-16">
        <section className="space-y-6">
          <h2 className="text-2xl text-white font-light tracking-tight uppercase">
            Industry-Ready Excellence
          </h2>
          <p className="text-lg leading-relaxed text-white/70">
            Our graduates and engineers are trained in high-performance environments. 
            We bridge the gap between academic theory and the "Beyond Code" reality of 
            modern engineering.
          </p>
          <div className="pt-8 grid grid-cols-2 gap-8 border-t border-white/10">
            <div>
              <h3 className="text-accent text-xl font-bold">500+</h3>
              <p className="text-xs uppercase tracking-widest opacity-50">Developers Placed</p>
            </div>
            <div>
              <h3 className="text-accent text-xl font-bold">12+</h3>
              <p className="text-xs uppercase tracking-widest opacity-50">Tech Stacks</p>
            </div>
          </div>
        </section>

        <section className="bg-white/5 p-8 border border-white/10 rounded-sm">
          <h3 className="text-white uppercase tracking-widest text-sm mb-6">Partnership Inquiry</h3>
          <form className="space-y-4">
            <div>
              <label className="block text-[10px] uppercase tracking-widest mb-2 opacity-50">Company Name</label>
              <input type="text" className="w-full bg-transparent border-b border-white/20 pb-2 outline-none focus:border-accent transition-colors" />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest mb-2 opacity-50">Role Requirements</label>
              <textarea className="w-full bg-transparent border-b border-white/20 pb-2 outline-none focus:border-accent transition-colors h-24 resize-none" />
            </div>
            <button className="w-full py-4 bg-[#ebdfdc] text-black text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-white transition-colors mt-4">
              Submit Request
            </button>
          </form>
        </section>
      </div>
    </PageLayout>
  );
};

