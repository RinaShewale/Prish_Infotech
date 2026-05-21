import React, { useState, useContext, useMemo, useRef } from "react";
import { X, Star, MessageSquareShare } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import * as THREE from "three";
import { ReviewContext } from "../../dashboard/components/context/ReviewContext";

// --- 1. REVIEW MODAL COMPONENT ---
export const ReviewModal = ({ isOpen, onClose, courseId }) => {
  const { handleCreateReview, loading, handleGetReviews } = useContext(ReviewContext);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await handleCreateReview({ rating, comment, courseId });
    if (res.success) {
      setRating(5);
      setComment("");
      await handleGetReviews();
      onClose();
    } else {
      alert(res.message || "Failed to add review");
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
          onClick={onClose}
        />

        <motion.form
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          onSubmit={handleSubmit}
          className="relative w-full max-w-lg overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-b from-white/10 to-white/5 p-10 shadow-2xl backdrop-blur-2xl"
        >
          <button 
            type="button" 
            onClick={onClose}
            className="absolute right-8 top-8 text-white/30 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Write a Review</h2>
            <p className="text-white/50 text-sm">Your feedback helps us improve the learning journey.</p>
          </div>

          <div className="space-y-8">
            <div>
              <label className="text-[10px] font-bold tracking-[0.2em] text-accent uppercase mb-4 block">Select Rating</label>
              <div className="flex gap-3">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onMouseEnter={() => setHoverRating(num)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(num)}
                    className="transition-transform active:scale-90"
                  >
                    <Star
                      size={32}
                      className={`transition-all duration-300 ${
                        (hoverRating || rating) >= num
                          ? "fill-accent text-accent filter drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]"
                          : "text-white/10"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold tracking-[0.2em] text-accent uppercase mb-3 block">Your Story</label>
              <textarea
                rows="4"
                placeholder="What did you achieve with us?"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full rounded-2xl border border-white/5 bg-black/20 p-5 text-white outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/40 transition-all placeholder:text-white/20"
                required
              />
            </div>

            <button
              disabled={loading}
              className="group relative w-full overflow-hidden bg-white text-black py-5 rounded-2xl font-bold tracking-widest uppercase text-[10px] transition-all hover:bg-accent hover:text-white disabled:opacity-50"
            >
              <span className="relative z-10">{loading ? "Submitting..." : "Publish Review"}</span>
            </button>
          </div>
        </motion.form>
      </div>
    </AnimatePresence>
  );
};

// --- 2. THREE.JS SCENE COMPONENT ---
const PARTICLE_COUNT = 15000;
const Scene = () => {
  const points = useRef();
  const { viewport } = useThree();
  const responsiveScale = viewport.width * 0.045;

  const { positions, targets } = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    const target = new Float32Array(PARTICLE_COUNT * 3);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 2000; 
    canvas.height = 500;
    
    ctx.fillStyle = 'white';
    ctx.font = `900 220px "Space Grotesk", sans-serif`; 
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('PRISH INFOTECH', 1000, 250);

    const imageData = ctx.getImageData(0, 0, 2000, 500).data;
    const coords = [];
    for (let y = 0; y < 500; y += 4) {
      for (let x = 0; x < 2000; x += 4) {
        const index = (y * 2000 + x) * 4;
        if (imageData[index] > 128) {
          coords.push({ x: (x - 1000) * 0.01, y: (250 - y) * 0.01 });
        }
      }
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      const c = coords[i % coords.length];
      target[i3] = c.x;
      target[i3 + 1] = c.y;
      target[i3 + 2] = 0;
      pos[i3] = (Math.random() - 0.5) * 20;
      pos[i3 + 1] = (Math.random() - 0.5) * 20;
      pos[i3 + 2] = (Math.random() - 0.5) * 10;
    }
    return { positions: pos, targets: target };
  }, []);

  useFrame((state) => {
    const { mouse, clock } = state;
    if (!points.current) return;
    const array = points.current.geometry.attributes.position.array;
    const time = clock.getElapsedTime();
    const interactionRadius = 2.5;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      const px = array[i3];
      const py = array[i3 + 1];
      const mX = (mouse.x * viewport.width) / 2;
      const mY = (mouse.y * viewport.height) / 2;
      const dx = mX - px;
      const dy = mY - py;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      let tX = targets[i3] * responsiveScale;
      let tY = (targets[i3 + 1] * responsiveScale) + 1.8; 
      let tZ = targets[i3 + 2];

      if (dist < interactionRadius) {
        const force = (interactionRadius - dist) / interactionRadius;
        tX -= (dx / dist) * force * 2;
        tY -= (dy / dist) * force * 2;
        tZ += force * 3;
      }
      tX += Math.sin(time * 0.4 + i) * 0.03;
      tY += Math.cos(time * 0.4 + i) * 0.03;

      array[i3] += (tX - array[i3]) * 0.07;
      array[i3 + 1] += (tY - array[i3 + 1]) * 0.07;
      array[i3 + 2] += (tZ - array[i3 + 2]) * 0.07;
    }
    points.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.038} color="#ebdfdc" transparent opacity={0.8} blending={THREE.AdditiveBlending} sizeAttenuation={true} />
    </points>
  );
};

// --- 3. MAIN FOOTER COMPONENT ---
export const Footer = ({ courseId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <footer className="relative w-full min-h-[500px] md:h-[650px] bg-[#0a0a0a] text-white font-sans overflow-hidden border-t border-white/5">
      {/* Noise Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      
      {/* Three.js Background */}
      <div className="absolute inset-0 z-0 hidden md:block">
        <Canvas camera={{ position: [0, 0, 10], fov: 45 }} dpr={[1, 2]}>
          <Scene />
          <EffectComposer>
            <Bloom luminanceThreshold={0.2} intensity={0.6} radius={0.4} />
          </EffectComposer>
        </Canvas>
      </div>

      <div className="absolute inset-0 z-10 px-8 pb-10 md:px-20 md:pb-12 flex flex-col justify-end pointer-events-none">
        
        <div className="flex flex-col md:flex-row gap-12 md:gap-32 justify-end items-start pointer-events-auto transform translate-y-0 md:translate-y-8">
          
          <div className="flex flex-col gap-5">
            <h4 className="text-[10px] font-bold tracking-[0.3em] text-accent uppercase">ABOUT</h4>
            <div className="flex flex-col gap-2.5 text-xs text-white/50">
              <a href="#" className="hover:text-white transition-colors">About Us</a>
              <a href="#" className="hover:text-white transition-colors">Support</a>
              <a href="#" className="hover:text-white transition-colors">Terms and Condition</a>
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            </div>
          </div>

          {/* COMPANY COLUMN WITH ENHANCED FEEDBACK TRIGGER */}
          <div className="flex flex-col gap-5">
            <h4 className="text-[10px] font-bold tracking-[0.3em] text-accent uppercase">COMPANY</h4>
            <div className="flex flex-col gap-3 text-xs text-white/50">
              <a href="#" className="hover:text-white transition-colors">Hire From Us</a>
              <a href="#" className="hover:text-white transition-colors">Discord</a>
              <a href="#" className="hover:text-white transition-colors">Pricing and Refund</a>
              
              {/* INTERACTIVE FEEDBACK TRIGGER */}
              <motion.button 
                whileHover={{ x: 8 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsModalOpen(true)}
                className="group relative flex items-center gap-3 w-fit mt-2 py-1 pointer-events-auto"
              >
                <div className="relative flex items-center justify-center">
                  <span className="absolute inset-0 rounded-full bg-accent/40 animate-ping" />
                  <span className="relative flex h-2 w-2 rounded-full bg-accent shadow-[0_0_10px_#accent]" />
                </div>
                
                <span className="text-[11px] font-bold tracking-widest uppercase text-white/80 group-hover:text-accent transition-colors flex items-center gap-2">
                  Feedback 
                  <MessageSquareShare size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </span>
              </motion.button>
            </div>
          </div>

          <div className="flex flex-col gap-5 max-w-[240px]">
            <h4 className="text-[10px] font-bold tracking-[0.3em] text-accent uppercase">CONTACT</h4>
            <div className="flex flex-col gap-5 text-xs text-white/50">
              <div>
                <p className="text-accent/50 text-[9px] mb-1 uppercase tracking-widest">Online Support</p>
                <p className="text-white font-medium text-sm">+91 9993478545</p>
              </div>
              <a href="mailto:hello@prishinfotech.com" className="hover:text-white underline transition-colors font-serif italic text-[15px]">
                hello@prishinfotech.com
              </a>
              <p className="text-[10px] leading-relaxed opacity-70">
               Ashiwarya loans, Malegaon, 462023
              </p>
            </div>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="mt-12 md:mt-24 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 pointer-events-auto">
            <div className="flex gap-6 items-center order-2 md:order-1 opacity-50 hover:opacity-100 transition-opacity">
               {/* SVGs removed for brevity, keep your original ones here */}
               <span className="text-[10px]">SOCIALS</span>
            </div>
            
            <div className="text-[8px] tracking-[0.5em] text-accent uppercase order-1 md:order-2 text-center">
                © 2024 PRISH INFOTECH — BEYOND CODE
            </div>

            <div className="flex gap-6 order-3">
                {[1,2,3].map(i => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/10 hover:bg-accent transition-colors cursor-pointer" />
                ))}
            </div>
        </div>
      </div>

      <ReviewModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        courseId={courseId} 
      />
    </footer>
  );
};