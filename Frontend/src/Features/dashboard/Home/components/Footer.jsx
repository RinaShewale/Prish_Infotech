import React, { useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import * as THREE from 'three';
import { ReviewModal } from './ReviewModal'; // Import the component above

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

export const Footer = ({ courseId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <footer className="relative w-full min-h-[500px] md:h-[650px] bg-bg text-text font-sans overflow-hidden border-t border-border/20">
      <div className="noise-bg" />
      
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
            <h4 className="text-[10px] font-display font-bold tracking-[0.3em] text-accent uppercase">ABOUT</h4>
            <div className="flex flex-col gap-2.5 text-xs text-text-secondary">
              <a href="#" className="hover:text-text transition-colors">About Us</a>
              <a href="#" className="hover:text-text transition-colors">Support</a>
              <a href="#" className="hover:text-text transition-colors">Terms and Condition</a>
              <a href="#" className="hover:text-text transition-colors">Privacy Policy</a>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <h4 className="text-[10px] font-display font-bold tracking-[0.3em] text-accent uppercase">COMPANY</h4>
            <div className="flex flex-col gap-2.5 text-xs text-text-secondary">
              <a href="#" className="hover:text-text transition-colors">Hire From Us</a>
              <a href="#" className="hover:text-text transition-colors">Discord</a>
              <a href="#" className="hover:text-text transition-colors">Pricing and Refund</a>
              {/* FIXED: FEEDBACK TRIGGER */}
              <button 
                onClick={() => setIsModalOpen(true)}
                className="hover:text-text transition-colors text-left"
              >
                Feedback
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-5 max-w-[240px]">
            <h4 className="text-[10px] font-display font-bold tracking-[0.3em] text-accent uppercase">CONTACT</h4>
            <div className="flex flex-col gap-5 text-xs text-text-secondary">
              <div>
                <p className="text-accent/50 text-[9px] mb-1 uppercase tracking-widest">Online Support</p>
                <p className="text-text font-medium text-sm">+91 9993478545</p>
              </div>
              <a href="mailto:hello@prishinfotech.com" className="hover:text-text underline transition-colors font-serif italic text-[15px]">
                hello@prishinfotech.com
              </a>
              <p className="text-[10px] leading-relaxed text-text-secondary opacity-70">
               Ashiwarya loans, Malegaon, 462023
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 md:mt-24 pt-8 border-t border-border/10 flex flex-col md:flex-row justify-between items-center gap-8 pointer-events-auto">
            
            <div className="flex gap-6 items-center order-2 md:order-1">
                <a href="#" className="w-5 h-5 text-white/50 hover:text-white transition-all duration-300">
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.0281 2.00073C14.1535 2.00259 14.7238 2.00855 15.2166 2.02322L15.4107 2.02956C15.6349 2.03753 15.8561 2.04753 16.1228 2.06003C17.1869 2.1092 17.9128 2.27753 18.5503 2.52503C19.2094 2.7792 19.7661 3.12253 20.3219 3.67837C20.8769 4.2342 21.2203 4.79253 21.4753 5.45003C21.7219 6.0867 21.8903 6.81337 21.9403 7.87753C21.9522 8.1442 21.9618 8.3654 21.9697 8.58964L21.976 8.78373C21.9906 9.27647 21.9973 9.84686 21.9994 10.9723L22.0002 11.7179C22.0003 11.809 22.0003 11.903 22.0003 12L22.0002 12.2821L21.9996 13.0278C21.9977 14.1532 21.9918 14.7236 21.9771 15.2163L21.9707 15.4104C21.9628 15.6347 21.9528 15.8559 21.9403 16.1225C21.8911 17.1867 21.7219 17.9125 21.4753 18.55C21.2211 19.2092 20.8769 19.7659 20.3219 20.3217C19.7661 20.8767 19.2069 21.22 18.5503 21.475C17.9128 21.7217 17.1869 21.89 16.1228 21.94C15.8561 21.9519 15.6349 21.9616 15.4107 21.9694L15.2166 21.9757C14.7238 21.9904 14.1535 21.997 13.0281 21.9992L12.2824 22C12.1913 22 12.0973 22 12.0003 22L11.7182 22L10.9725 21.9993C9.8471 21.9975 9.27672 21.9915 8.78397 21.9768L8.58989 21.9705C8.36564 21.9625 8.14444 21.9525 7.87778 21.94C6.81361 21.8909 6.08861 21.7217 5.45028 21.475C4.79194 21.2209 4.23444 20.8767 3.67861 20.3217C3.12278 19.7659 2.78028 19.2067 2.52528 18.55C2.27778 17.9125 2.11028 17.1867 2.06028 16.1225C2.0484 15.8559 2.03871 15.6347 2.03086 15.4104L2.02457 15.2163C2.00994 14.7236 2.00327 14.1532 2.00111 13.0278L2.00098 10.9723C2.00284 9.84686 2.00879 9.27647 2.02346 8.78373L2.02981 8.58964C2.03778 8.3654 2.04778 8.1442 2.06028 7.87753C2.10944 6.81253 2.27778 6.08753 2.52528 5.45003C2.77944 4.7917 3.12278 4.2342 3.67861 3.67837C4.23444 3.12253 4.79278 2.78003 5.45028 2.52503C6.08778 2.27753 6.81278 2.11003 7.87778 2.06003C8.14444 2.04816 8.36564 2.03847 8.58989 2.03062L8.78397 2.02433C9.27672 2.00969 9.8471 2.00302 10.9725 2.00086L13.0281 2.00073ZM12.0003 7.00003C9.23738 7.00003 7.00028 9.23956 7.00028 12C7.00028 14.7629 9.23981 17 12.0003 17C14.7632 17 17.0003 14.7605 17.0003 12C17.0003 9.23713 14.7607 7.00003 12.0003 7.00003ZM12.0003 9.00003C13.6572 9.00003 15.0003 10.3427 15.0003 12C15.0003 13.6569 13.6576 15 12.0003 15C10.3434 15 9.00028 13.6574 9.00028 12C9.00028 10.3431 10.3429 9.00003 12.0003 9.00003ZM17.2503 5.50003C16.561 5.50003 16.0003 6.05994 16.0003 6.74918C16.0003 7.43843 16.5602 7.9992 17.2503 7.9992C17.9395 7.9992 18.5003 7.4393 18.5003 6.74918C18.5003 6.05994 17.9386 5.49917 17.2503 5.50003Z"/></svg>
                </a>
                <a href="#" className="w-5 h-5 text-white/50 hover:text-white transition-all duration-300">
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 13.5H16.5L17.5 9.5H14V7.5C14 6.47062 14 5.5 16 5.5H17.5V2.1401C17.1743 2.09685 15.943 2 14.6429 2C11.9284 2 10 3.65686 10 6.69971V9.5H7V13.5H10V22H14V13.5Z"/></svg>
                </a>
                <a href="#" className="w-5 h-5 text-white/50 hover:text-white transition-all duration-300">
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M10.4883 14.651L15.25 21H22.25L14.3917 10.5223L20.9308 3H18.2808L13.1643 8.88578L8.75 3H1.75L9.26086 13.0145L2.31915 21H4.96917L10.4883 14.651ZM16.25 19L5.75 5H7.75L18.25 19H16.25Z"/></svg>
                </a>
                <a href="#" className="w-5 h-5 text-white/50 hover:text-white transition-all duration-300">
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.3034 5.33716C17.9344 4.71103 16.4805 4.2547 14.9629 4C14.7719 4.32899 14.5596 4.77471 14.411 5.12492C12.7969 4.89144 11.1944 4.89144 9.60255 5.12492C9.45397 4.77471 9.2311 4.32899 9.05068 4C7.52251 4.2547 6.06861 4.71103 4.70915 5.33716C1.96053 9.39111 1.21766 13.3495 1.5891 17.2549C3.41443 18.5815 5.17612 19.388 6.90701 19.9187C7.33151 19.3456 7.71356 18.73 8.04255 18.0827C7.41641 17.8492 6.82211 17.5627 6.24904 17.2231C6.39762 17.117 6.5462 17.0003 6.68416 16.8835C10.1438 18.4648 13.8911 18.4648 17.3082 16.8835C17.4568 17.0003 17.5948 17.117 17.7434 17.2231C17.1703 17.5627 16.576 17.8492 15.9499 18.0827C16.2789 18.73 16.6609 19.3456 17.0854 19.9187C18.8152 19.388 20.5875 18.5815 22.4033 17.2549C22.8596 12.7341 21.6806 8.80747 19.3034 5.33716ZM8.5201 14.8459C7.48007 14.8459 6.63107 13.9014 6.63107 12.7447C6.63107 11.5879 7.45884 10.6434 8.5201 10.6434C9.57071 10.6434 10.4303 11.5879 10.4091 12.7447C10.4091 13.9014 9.57071 14.8459 8.5201 14.8459ZM15.4936 14.8459C14.4535 14.8459 13.6034 13.9014 13.6034 12.7447C13.6034 11.5879 14.4323 10.6434 15.4936 10.6434C16.5442 10.6434 17.4038 11.5879 17.3825 12.7447C17.3825 13.9014 16.5548 14.8459 15.4936 14.8459Z"/></svg>
                </a>
            </div>
            
            <div className="text-[8px] tracking-[0.5em] text-accent uppercase font-display order-1 md:order-2 text-center">
                © 2024 PRISH INFOTECH — BEYOND CODE
            </div>

            <div className="flex gap-6 order-3">
                <div className="w-1.5 h-1.5 rounded-full bg-accent/20 hover:bg-accent transition-colors cursor-pointer" />
                <div className="w-1.5 h-1.5 rounded-full bg-accent/20 hover:bg-accent transition-colors cursor-pointer" />
                <div className="w-1.5 h-1.5 rounded-full bg-accent/20 hover:bg-accent transition-colors cursor-pointer" />
            </div>
        </div>
      </div>

      {/* Integration: Modal Component */}
      <ReviewModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        courseId={courseId} 
      />
    </footer>
  );
};