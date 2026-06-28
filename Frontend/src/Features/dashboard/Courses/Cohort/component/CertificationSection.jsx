import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Globe, QrCode, Award, CheckCircle } from 'lucide-react';
import CertificateCard from './CertificateCard';

const CertificationSection = ({ data, userCertificate, user }) => {
  if (!data || !data.mainHeading) return null;

  // FIX: Look for bootcamp title if course title doesn't exist
  const displayUserName = userCertificate?.user?.name || user?.name || "Student Name";
  
  const displayCourseName = 
    userCertificate?.course?.title || 
    userCertificate?.bootcamp?.title || // Added check for bootcamp title
    data.certType;

  const isEnrolled = !!userCertificate;

  const displayDate = !isEnrolled
    ? "Not Enrolled Yet"
    : userCertificate?.createdAt
      ? new Date(userCertificate.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      })
      : "Enroll to Unlock";

  const features = [
    { icon: <Award className="w-5 h-5 text-accent" />, title: "ISO CERTIFIED", desc: "Global recognition standards" },
    { icon: <Globe className="w-5 h-5 text-accent" />, title: "LINKEDIN READY", desc: "One-click share feature" },
    { icon: <QrCode className="w-5 h-5 text-accent" />, title: "VERIFIABLE", desc: "Unique QR for authenticity" },
    { icon: <CheckCircle className="w-5 h-5 text-accent" />, title: "LIFETIME", desc: "Permanent digital credential" }
  ];

  return (
    <section className="py-16 md:py-32 px-4 sm:px-6 max-w-7xl mx-auto overflow-hidden">
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        {/* LEFT CONTENT */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="order-2 lg:order-1">
          <div className="flex items-center gap-2 mb-6">
            <div className="px-3 py-1 rounded-full border border-white/10 bg-white/5 flex items-center gap-2">
              <ShieldCheck className="w-3 h-3 text-accent" />
              <span className="text-[10px] font-bold tracking-[0.2em] text-white/60 uppercase">Industry Verified</span>
            </div>
          </div>
          <h2 className="text-4xl sm:text-7xl font-bold text-white mb-8 leading-[1.1] tracking-tighter">
            {data.mainHeading} <br />
            <span className="italic font-serif text-accent border-b-2 border-accent/20 inline-block mt-2">{data.highlightedText}</span>
          </h2>
          <p className="text-base md:text-xl text-text-secondary mb-12 max-w-lg font-light leading-relaxed">{data.description}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((f, i) => (
              <div key={i} className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 group">
                <div className="mb-4 group-hover:scale-110 transition-transform origin-left">{f.icon}</div>
                <h4 className="text-xs font-bold text-white tracking-widest mb-1 uppercase">{f.title}</h4>
                <p className="text-xs text-text-secondary font-light">{f.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* RIGHT CONTENT */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} className="relative order-1 lg:order-2">
          <div className="absolute -inset-4 bg-accent/20 blur-[80px] rounded-full opacity-30" />
          <CertificateCard
            displayCourseName={displayCourseName}
            displayUserName={displayUserName}
            displayDate={displayDate}
            skillsLearned={data.skillsLearned}
            isPreview={true}
          />
        </motion.div>
      </div>
    </section>
  );
};

export default CertificationSection;