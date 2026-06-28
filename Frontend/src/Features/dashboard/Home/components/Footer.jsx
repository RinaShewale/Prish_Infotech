import React, { useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import * as THREE from 'three';
import { Link } from 'react-router-dom'; // CHANGED: Import from react-router-dom
import { ReviewModal } from './ReviewModal'; 

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
    <footer className="relative w-full min-h-[500px] md:h-[650px] bg-[#0a0a0a] text-[#ebdfdc] font-sans overflow-hidden border-t border-white/10">
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
            <div className="flex flex-col gap-2.5 text-xs text-text-secondary">
              <Link to="/about-us" className="hover:text-text transition-colors">About Us</Link>
              <Link to="/support" className="hover:text-text transition-colors">Support</Link>
              <Link to="/terms-and-condition" className="hover:text-text transition-colors">Terms and Condition</Link>
              <Link to="/privacy-policy" className="hover:text-text transition-colors">Privacy Policy</Link>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <h4 className="text-[10px] font-bold tracking-[0.3em] text-accent uppercase">COMPANY</h4>
            <div className="flex flex-col gap-2.5 text-xs text-text-secondary">
              <Link to="/hire-from-us" className="hover:text-text transition-colors">Hire From Us</Link>
              <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="hover:text-text transition-colors">Discord</a>
              <Link to="/pricing-and-refund" className="hover:text-text transition-colors">Pricing and Refund</Link>
              <button
                onClick={() => setIsModalOpen(true)}
                className="hover:text-text transition-colors text-left"
              >
                Feedback
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-5 max-w-[240px]">
            <h4 className="text-[10px] font-bold tracking-[0.3em] text-accent uppercase">CONTACT</h4>
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

        {/* Bottom Bar Icons & Copyright */}
        <div className="mt-12 md:mt-24 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8 pointer-events-auto">
          {/* ... Social Icons (Paste your existing SVG block here) ... */}
          
          <div className="text-[8px] tracking-[0.5em] text-accent uppercase order-1 md:order-2 text-center">
            © 2024 PRISH INFOTECH — BEYOND CODE
          </div>

          {/* Pagination-style dots */}
          <div className="flex gap-6 order-3">
            <div className="w-1.5 h-1.5 rounded-full bg-white/20 hover:bg-white transition-colors cursor-pointer" />
            <div className="w-1.5 h-1.5 rounded-full bg-white/20 hover:bg-white transition-colors cursor-pointer" />
            <div className="w-1.5 h-1.5 rounded-full bg-white/20 hover:bg-white transition-colors cursor-pointer" />
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