import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Lock, Award, Download, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
      // 1. Convert HTML to Image (PNG)
      const dataUrl = await toPng(pdfRef.current, { 
        quality: 1, 
        pixelRatio: 2, // Sharpness
        backgroundColor: '#FDFDFD' 
      });

      // 2. Create PDF
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [1120, 790]
      });

      pdf.addImage(dataUrl, 'PNG', 0, 0, 1120, 790);
      
      // 3. Trigger Download
      pdf.save(`Certificate-${displayUserName.replace(/\s+/g, '_')}.pdf`);
      
    } catch (err) {
      console.error("Download Error:", err);
      alert("Failed to generate PDF. Try a different browser.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="h-full bg-bg2/40 border border-border/50 rounded-[2rem] flex flex-col backdrop-blur-md overflow-hidden relative">
      
      {/* HIDDEN CAPTURE AREA: Invisible but exists in DOM for the tool to find it */}
      <div style={{ position: 'absolute', top: '-10000px', left: '-10000px', opacity: 0 }}>
        <CertificateCard 
          ref={pdfRef}
          displayCourseName={displayCourseName}
          displayUserName={displayUserName}
          displayDate={displayDate}
          skillsLearned="Advanced Technical Architecture & Development"
          isPreview={false}
        />
      </div>

      {/* Label Header */}
      <div className="p-6 pb-2 flex justify-between items-center z-10">
        <div className="flex items-center gap-2">
          <Award size={14} className="text-accent" />
          <h2 className="text-[10px] font-display font-bold uppercase tracking-[0.2em] text-text-secondary">Official Credential</h2>
        </div>
      </div>

      {/* UI Preview Square */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="relative w-full aspect-square max-w-[340px]">
          <motion.div
            animate={{ filter: isCompleted ? "none" : "blur(12px) grayscale(100%)", opacity: isCompleted ? 1 : 0.4 }}
            className="w-full h-full rounded-[24px] overflow-hidden border border-border/30 bg-white flex items-center justify-center relative shadow-2xl"
          >
            {/* We scale the design down purely for the UI view */}
            <div className="origin-center transform scale-[0.25]">
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
              <Lock className="text-accent/40" size={32} />
            </div>
          )}
        </div>
      </div>

      {/* DOWNLOAD BUTTON */}
      {isCompleted && issuedCertificate && (
        <div className="px-8 pb-4">
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="w-full flex items-center justify-center gap-2 bg-accent text-bg py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {isDownloading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
            {isDownloading ? "Capturing..." : "Download Certificate"}
          </button>
        </div>
      )}
    </div>
  );
};

export default CertificateWrapper;