import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Lock, Award, Download, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { fetchMyCertificates } from '../../certificate.slice';
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';
import CertificateCard from './CertificateCard';

const CertificateWrapper = ({ courseId, isCompleted, progress }) => {
  const dispatch = useDispatch();
  const [isDownloading, setIsDownloading] = useState(false);
  const pdfRef = useRef(null);

  const user = useSelector((state) => state.auth?.user);
  const { myCertificates } = useSelector((state) => state.certificate);

  useEffect(() => {
    if (user) dispatch(fetchMyCertificates());
  }, [dispatch, user]);

  const issuedCertificate = myCertificates?.find(
    (cert) => (cert.course?._id || cert.course) === courseId
  );

  const displayUserName = issuedCertificate?.user?.name || user?.name || "Student";
  const displayCourseName = issuedCertificate?.course?.title || "Professional Certification";
  const displayDate = issuedCertificate?.createdAt 
    ? new Date(issuedCertificate.createdAt).toLocaleDateString() 
    : "Pending";

  const handleDownload = async () => {
    if (!pdfRef.current) {
        alert("Wait... Certificate not ready!");
        return;
    }
    setIsDownloading(true);
    try {
      const dataUrl = await toPng(pdfRef.current, { 
        quality: 1, 
        pixelRatio: 2, 
        backgroundColor: '#FDFDFD' 
      });
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [1120, 790] });
      pdf.addImage(dataUrl, 'PNG', 0, 0, 1120, 790);
      pdf.save(`Certificate-${displayUserName.replace(/\s+/g, '_')}.pdf`);
    } catch (err) {
      console.error("Download Error:", err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    /* h-full and overflow-hidden prevent the container from growing beyond parent */
    <div className="h-full max-h-full bg-bg2/40 border border-border/50 rounded-[1.5rem] md:rounded-[2rem] flex flex-col backdrop-blur-md overflow-hidden relative">
      
      {/* HIDDEN CAPTURE AREA */}
      <div style={{ position: 'absolute', top: '-10000px', left: '-10000px', opacity: 0, pointerEvents: 'none' }}>
        <CertificateCard 
          ref={pdfRef}
          displayCourseName={displayCourseName}
          displayUserName={displayUserName}
          displayDate={displayDate}
          skillsLearned="Advanced Technical Architecture & Development"
          isPreview={false}
        />
      </div>

      {/* Label Header - Reduced padding on mobile */}
      <div className="p-4 md:p-6 pb-2 flex justify-between items-center shrink-0 z-10">
        <div className="flex items-center gap-2">
          <Award size={14} className="text-accent" />
          <h2 className="text-[9px] md:text-[10px] font-display font-bold uppercase tracking-[0.2em] text-text-secondary">Official Credential</h2>
        </div>
      </div>

      {/* UI Preview Area - flex-1 and min-h-0 allow this section to shrink if space is tight */}
      <div className="flex-1 min-h-0 flex items-center justify-center p-2 md:p-6 relative">
        <div className="relative w-full h-full max-w-[340px] max-h-[340px] flex items-center justify-center">
          <motion.div
            animate={{ filter: isCompleted ? "none" : "blur(8px) grayscale(100%)", opacity: isCompleted ? 1 : 0.4 }}
            className="w-full h-full aspect-square rounded-[18px] md:rounded-[24px] overflow-hidden border border-border/30 bg-white flex items-center justify-center relative shadow-xl md:shadow-2xl"
          >
            {/* Dynamic Scale based on screen size to ensure it fits mobile screens without overflow */}
            <div className="origin-center transform scale-[0.15] xs:scale-[0.20] sm:scale-[0.25]">
               <CertificateCard 
                  displayCourseName={displayCourseName}
                  displayUserName={displayUserName}
                  displayDate={displayDate}
                  skillsLearned="Advanced Technical Architecture"
                  isPreview={false}
               />
            </div>
          </motion.div>

          {!isCompleted && (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="bg-bg/40 p-3 rounded-full backdrop-blur-sm">
                <Lock className="text-accent/60" size={24} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* DOWNLOAD BUTTON AREA - Fixed at bottom, no internal scrolling */}
      <div className="px-4 md:px-8 pb-4 md:pb-6 shrink-0 mt-auto">
        {isCompleted && issuedCertificate ? (
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="w-full flex items-center justify-center gap-2 bg-accent text-bg py-3 rounded-xl font-bold text-[10px] md:text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {isDownloading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
            {isDownloading ? "Capturing..." : "Download PDF"}
          </button>
        ) : (
          <div className="w-full py-3 rounded-xl border border-border/30 bg-white/5 flex items-center justify-center">
            <span className="text-[9px] md:text-[10px] uppercase tracking-widest text-text-secondary/60 font-medium">
              {progress < 100 ? `Locked (${progress}%)` : "Validating..."}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CertificateWrapper;