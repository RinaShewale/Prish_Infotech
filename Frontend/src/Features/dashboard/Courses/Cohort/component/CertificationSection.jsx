import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Globe, QrCode, Award, CheckCircle, Download } from 'lucide-react';

export const CertificationSection = ({ data, userCertificate, user }) => {
  if (!data) return null;

  // PRIORITY LOGIC FOR NAME:
  // 1. Name from the actual issued certificate (Official)
  // 2. Name of the currently logged-in user (Preview mode)
  // 3. Fallback dummy name (Guest mode)
  const displayUserName = userCertificate?.user?.name || user?.name || "Alexandria Smith";

  const displayCourseName = userCertificate?.course?.title || data.certType;


  const isEnrolled =
    userCertificate ||
    user?.enrollments?.some(
      (e) =>
        (e.course?._id || e.course) === data?._id
    );

    
  const isCompleted = data?.isCompleted;

  const displayDate = userCertificate?.createdAt
    ? new Date(userCertificate.createdAt).toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    })
    : isEnrolled
      ? "Pending Completion"
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="order-2 lg:order-1"
        >
          <div className="flex justify-center lg:justify-start items-center gap-2 mb-6">
            <div className="px-3 py-1 rounded-full border border-white/10 bg-white/5 flex items-center gap-2">
              <ShieldCheck className="w-3 h-3 text-accent" />
              <span className="text-[10px] font-bold tracking-[0.2em] text-white/60 uppercase">
                {userCertificate ? "Credential Issued" : user ? "Personalized Preview" : "Industry Verified"}
              </span>
            </div>
          </div>

          <h2 className="text-4xl sm:text-6xl md:text-7xl font-bold text-white mb-6 md:mb-8 leading-[1.1] tracking-tighter text-center lg:text-left">
            {userCertificate ? "You Are" : data.mainHeading} <br />
            <span className="italic font-serif text-accent border-b-2 border-accent/20 inline-block mt-2">
              {userCertificate ? "Certified" : data.highlightedText}
            </span>
          </h2>

          <p className="text-base md:text-xl text-text-secondary mb-10 md:mb-12 max-w-lg leading-relaxed font-light text-center lg:text-left mx-auto lg:mx-0">
            {userCertificate
              ? `Congratulations ${displayUserName}! You have officially mastered this curriculum and earned your digital credential.`
              : data.description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {features.map((f, i) => (
              <div key={i} className="p-5 md:p-6 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-accent/20 transition-all group text-left">
                <div className="mb-4 group-hover:scale-110 transition-transform duration-300 origin-left">{f.icon}</div>
                <h4 className="text-[10px] md:text-xs font-bold text-white tracking-widest mb-1 uppercase">{f.title}</h4>
                <p className="text-[10px] md:text-xs text-text-secondary font-light">{f.desc}</p>
              </div>
            ))}
          </div>

          {userCertificate?.certificateUrl && (
            <div className="flex justify-center lg:justify-start">
              <a href={userCertificate.certificateUrl} target="_blank" rel="noreferrer" className="flex items-center gap-3 px-8 py-4 bg-accent text-bg font-black rounded-xl text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-[0_0_30px_rgba(var(--accent-rgb),0.3)]">
                <Download className="w-4 h-4" /> Download Certificate
              </a>
            </div>
          )}
        </motion.div>

        {/* RIGHT CONTENT - DYNAMIC CERTIFICATE */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative order-1 lg:order-2"
        >
          <div className="absolute -inset-4 bg-accent/20 blur-[80px] rounded-full opacity-30" />

          <div className="relative bg-[#FDFDFD] rounded-[24px] md:rounded-[40px] p-6 sm:p-10 md:p-12 shadow-2xl text-black overflow-hidden box-border">

            <div className="absolute top-0 right-6 sm:right-12 w-8 sm:w-12 h-14 sm:h-20 bg-indigo-600 shadow-lg flex items-center justify-center rounded-b-lg z-10">
              <div className="w-5 h-5 sm:w-8 sm:h-8 rounded-full bg-yellow-400 border-2 sm:border-4 border-white/20 flex items-center justify-center">
                <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-indigo-900" />
              </div>
            </div>

            <div className="flex items-center gap-3 mb-10 md:mb-16">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-black rounded-lg md:rounded-xl flex items-center justify-center text-white font-black text-xl md:text-2xl">P</div>
              <div>
                <h4 className="text-[10px] md:text-xs font-black tracking-tighter uppercase leading-none">Prish <span className="text-gray-400 font-medium">Infotech</span></h4>
                <p className="text-[7px] md:text-[8px] tracking-[0.2em] font-bold text-gray-400 uppercase mt-1">Engineering League</p>
              </div>
            </div>

            <div className="space-y-4 md:space-y-6">
              <p className="text-[8px] md:text-[10px] tracking-[0.2em] md:tracking-[0.3em] font-bold text-gray-400 uppercase">Certificate of Completion</p>
              <h3 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-none mb-2 md:mb-4">{displayCourseName}</h3>

              <div className="py-2 md:py-4">
                <p className="text-[8px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 md:mb-2">This honor is presented to</p>
                <p className="text-2xl sm:text-4xl md:text-5xl font-serif italic text-black truncate">
                  {displayUserName}
                </p>
                <div className="w-full h-px bg-gray-200 mt-3 md:mt-4" />
              </div>

              <p className="text-[11px] md:text-sm text-gray-600 leading-relaxed max-w-md">
                For successfully demonstrating expert-level proficiency in
                <span className="font-bold text-black"> {data.skillsLearned}</span> during the 2025 Prish Incubator program.
              </p>
            </div>

            <div className="mt-10 md:mt-16 flex flex-row justify-between items-end gap-4">
              <div className="shrink-0">
                <p
                  className={`text-xs md:text-lg font-bold mb-0.5 md:mb-1 uppercase ${userCertificate
                    ? "text-black"
                    : isEnrolled
                      ? "text-orange-500"
                      : "text-blue-500"
                    }`}
                >
                  {displayDate}
                </p>
                <p className="text-[7px] md:text-[8px] font-bold text-gray-400 uppercase tracking-widest">Issue Date</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xl md:text-3xl font-serif italic text-black mb-0.5 md:mb-1 tracking-tighter leading-none">Adarsh Gupta</p>
                <div className="w-20 md:w-32 h-px bg-gray-200 ml-auto mb-1 md:mb-2" />
                <p className="text-[7px] md:text-[9px] font-black text-black uppercase">Program Director</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CertificationSection;