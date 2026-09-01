import React, { useEffect } from 'react';
import { Scale, ShieldAlert, FileCode, CreditCard, RefreshCw } from 'lucide-react';
import PageLayout from './PageLayout';
import { motion } from 'framer-motion';

export default function TermsCondition() {
  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <PageLayout 
      title={<span className="font-display">Terms of <br /><span className="italic font-serif text-accent text-6xl md:text-8xl">Service</span></span>}
      subtitle="The Agreement"
    >
      <div className="max-w-4xl mx-auto">
        <div className="mb-16 text-text-secondary text-lg leading-relaxed font-light">
          By accessing the Prish Infotech platform, you enter into a binding agreement. We maintain these terms to ensure a high-standard, secure environment for all creators and engineers.
        </div>

        <div className="grid gap-6">
          <TermCard 
            icon={<FileCode />}
            title="Intellectual Property"
            terms={[
              "All course content, logic, and curriculum are property of Prish Infotech.",
              "License is granted for personal learning and cannot be redistributed.",
              "Project code delivered to clients is subject to specific contract licenses."
            ]}
          />

          <TermCard 
            icon={<ShieldAlert />}
            title="System Integrity"
            terms={[
              "Users must not attempt to breach or circumvent our security infrastructure.",
              "Automated scraping of classroom content is strictly prohibited.",
              "Accounts found sharing credentials will be permanently terminated."
            ]}
          />

          <TermCard 
            icon={<CreditCard />}
            title="Financial Obligations"
            terms={[
              "Subscription and course fees must be paid in full prior to access.",
              "Late payments on modular plans may result in temporary suspension.",
              "Pricing is subject to change with a 30-day notice for active subscribers."
            ]}
          />

          <TermCard 
            icon={<RefreshCw />}
            title="Modifications"
            terms={[
              "We reserve the right to update these terms to reflect platform evolution.",
              "Continued use of the service constitutes acceptance of updated terms.",
              "Significant changes will be notified via your registered email."
            ]}
          />
        </div>

        <div className="mt-20 p-10 rounded-[32px] bg-white/[0.02] border border-white/5 text-center">
          <Scale className="w-8 h-8 text-accent mx-auto mb-6 opacity-50" />
          <h3 className="text-white font-display text-xl mb-4">Governing Law</h3>
          <p className="text-text-secondary text-sm font-light max-w-xl mx-auto">
            These terms are governed by the laws of India. Any disputes arising from the use of our services will be subject to the exclusive jurisdiction of the courts in Malegaon/Maharashtra.
          </p>
        </div>
      </div>
    </PageLayout>
  );
}

const TermCard = ({ icon, title, terms }) => (
  <motion.div 
    initial={{ opacity: 0, x: -10 }}
    whileInView={{ opacity: 1, x: 0 }}
    className="p-8 md:p-10 bg-white/[0.01] border border-white/5 rounded-[40px] hover:border-accent/20 transition-all group"
  >
    <div className="flex items-center gap-6 mb-8">
      <div className="p-4 bg-accent/5 rounded-2xl text-accent group-hover:scale-110 transition-transform">
        {React.cloneElement(icon, { size: 24 })}
      </div>
      <h2 className="text-2xl font-display text-white uppercase tracking-tight">{title}</h2>
    </div>
    
    <ul className="space-y-4">
      {terms.map((term, index) => (
        <li key={index} className="flex gap-4 text-text-secondary font-light leading-relaxed">
          <span className="text-accent mt-1.5">•</span>
          <span>{term}</span>
        </li>
      ))}
    </ul>
  </motion.div>
);