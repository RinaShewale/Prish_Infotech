import React, { useEffect } from 'react';
import { Shield, Eye, Lock, Database, Bell } from 'lucide-react';
import PageLayout from './PageLayout';
import { motion } from 'framer-motion';

export default function PrivacyPolicy() {
  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <PageLayout 
      title={<span className="font-display">Privacy <br /><span className="italic font-serif text-accent text-6xl md:text-8xl">Blueprint</span></span>}
      subtitle="Security & Trust"
    >
      <div className="max-w-4xl mx-auto">
        {/* Intro Statement */}
        <div className="mb-20 p-8 border-l border-accent/30 bg-accent/5">
          <p className="text-xl text-white font-light leading-relaxed italic">
            "Your data is the foundation of your digital identity. We treat it with the same architectural precision as our code."
          </p>
        </div>

        <div className="space-y-16">
          <PrivacySection 
            icon={<Database className="text-accent" />}
            title="Data Collection"
            summary="We only collect what is essential."
            content="We collect only the information necessary to provide our services, such as your name, email, and learning progress. We do not track you across the web or collect data beyond the scope of Prish Infotech services."
          />

          <PrivacySection 
            icon={<Lock className="text-accent" />}
            title="Encryption & Security"
            summary="Military-grade protection."
            content="Your data is encrypted both at rest and in transit. We utilize industry-standard protocols to ensure that your personal and financial information remains inaccessible to unauthorized entities."
          />

          <PrivacySection 
            icon={<Eye className="text-accent" />}
            title="Third-Party Policy"
            summary="Zero data selling."
            content="We believe in 'Privacy by Design'. Your personal data is never sold, traded, or rented to third parties for marketing purposes. We only share data with essential service providers (like payment processors) under strict confidentiality."
          />

          <PrivacySection 
            icon={<Shield className="text-accent" />}
            title="Cookies"
            summary="Minimal & Functional."
            content="We use minimal cookies to enhance site performance, remember your classroom preferences, and maintain your secure session. You can manage cookie settings through your browser at any time."
          />
        </div>

        {/* Footer Note */}
        <div className="mt-24 pt-12 border-t border-white/5 text-center">
          <p className="text-text-secondary text-sm font-light uppercase tracking-widest">
            Last Updated: October 2023 • Prish Infotech Legal Team
          </p>
        </div>
      </div>
    </PageLayout>
  );
}

const PrivacySection = ({ icon, title, summary, content }) => (
  <motion.section 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    className="group relative grid md:grid-cols-12 gap-8"
  >
    <div className="md:col-span-1">
      <div className="w-10 h-10 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center group-hover:border-accent/40 transition-colors">
        {React.cloneElement(icon, { size: 18 })}
      </div>
    </div>
    <div className="md:col-span-11 space-y-4">
      <div className="flex flex-col">
        <h2 className="text-white text-xl font-display uppercase tracking-tight">{title}</h2>
        <span className="text-accent text-[10px] font-bold uppercase tracking-[0.2em] mt-1">{summary}</span>
      </div>
      <p className="text-text-secondary leading-relaxed font-light text-lg">
        {content}
      </p>
    </div>
  </motion.section>
);