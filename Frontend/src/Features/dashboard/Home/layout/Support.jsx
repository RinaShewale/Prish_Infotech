import React from 'react';
import PageLayout from './PageLayout'; // Adjust path if needed

export const Support = () => {
  return (
    <PageLayout title="Support" subtitle="Help Center">
      <div className="grid md:grid-cols-3 gap-8">
        {/* Contact Card 1 */}
        <div className="p-10 border border-white/10 hover:border-accent/50 transition-all group">
          <h3 className="text-accent text-[10px] font-bold tracking-[0.3em] uppercase mb-4">Technical</h3>
          <p className="text-xl mb-6 font-light">Issue with the classroom or lectures?</p>
          <a href="mailto:support@prishinfotech.com" className="text-sm underline underline-offset-4 opacity-70 group-hover:opacity-100 transition-opacity">
            support@prishinfotech.com
          </a>
        </div>

        {/* Contact Card 2 */}
        <div className="p-10 border border-white/10 hover:border-accent/50 transition-all group">
          <h3 className="text-accent text-[10px] font-bold tracking-[0.3em] uppercase mb-4">Community</h3>
          <p className="text-xl mb-6 font-light">Join our Discord for live assistance.</p>
          <a href="https://discord.com" className="text-sm underline underline-offset-4 opacity-70 group-hover:opacity-100 transition-opacity">
            Join Discord Server
          </a>
        </div>

        {/* Contact Card 3 */}
        <div className="p-10 border border-white/10 hover:border-accent/50 transition-all group">
          <h3 className="text-accent text-[10px] font-bold tracking-[0.3em] uppercase mb-4">Direct</h3>
          <p className="text-xl mb-6 font-light">Speak with a student counselor.</p>
          <p className="text-sm font-medium opacity-70">+91 9993478545</p>
        </div>
      </div>

      <div className="mt-20">
        <h2 className="text-2xl text-white font-light tracking-tight uppercase mb-10">Frequently Asked</h2>
        <div className="space-y-8 max-w-3xl">
          <div className="border-b border-white/5 pb-6">
            <h4 className="text-white text-sm uppercase tracking-widest mb-2">How do I access my course?</h4>
            <p className="text-white/50 text-sm">Once purchased, courses are immediately available in your classroom dashboard under your profile.</p>
          </div>
          <div className="border-b border-white/5 pb-6">
            <h4 className="text-white text-sm uppercase tracking-widest mb-2">Can I switch my cohort?</h4>
            <p className="text-white/50 text-sm">Switching cohorts is possible within the first 3 days of the batch start date. Please contact support via email.</p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

