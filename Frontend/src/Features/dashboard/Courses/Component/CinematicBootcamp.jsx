import React, { useState, useRef, useEffect, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Lenis from "@studio-freight/lenis";
import {
  ChevronRight,
  Trophy,
  ShieldCheck,
  ExternalLink,
  RefreshCcw,
  Terminal,
  Zap,
  Lock
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const ROUNDS = [
    { id: 1, title: "NEURAL_LOGIC", sector: "SEC_01", question: "Which algorithmic complexity represents 'Linear Time' execution?", options: ["O(1)", "O(log n)", "O(n)", "O(n^2)"], correct: "O(n)", hint: "Time grows directly with input size.", time: 45 },
    { id: 2, title: "CODE_REPAIR", sector: "SEC_02", question: "Input the keyword to define a constant variable in ES6:", code: "______ PI = 3.14;", hint: "Variable cannot be reassigned.", correct: "const", time: 45, type: "input" },
    { id: 3, title: "ARCH_STRESS", sector: "SEC_03", question: "Which layer is responsible for IP addressing and routing?", options: ["DATA LINK", "NETWORK", "TRANSPORT", "PHYSICAL"], correct: "NETWORK", hint: "Layer 3 of the stack.", time: 45 }
];

export default function CinematicBootcamp() {
  const [gameState, setGameState] = useState("portal");
  const [currentRound, setCurrentRound] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45);
  const [userInput, setUserInput] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [isWinner, setIsWinner] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const containerRef = useRef(null);
  const portalRef = useRef(null);
  const gameLayerRef = useRef(null);
  const winnerCardRef = useRef(null);
  const isProcessing = useRef(false);

  const COUPON_CODE = "BOOTCAMP20";

  // FUNCTIONAL RESET
  const resetGame = () => {
    setIsWinner(false);
    setGameState("playing");
    setCurrentRound(0);
    setTimeLeft(ROUNDS[0].time);
    setUserInput("");
    setFeedback(null);
    setIsCopied(false);
    isProcessing.current = false;
  };

  const handleMouseMove = (e) => {
    if (!isWinner || !winnerCardRef.current || window.innerWidth < 1024) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = winnerCardRef.current.getBoundingClientRect();
    const x = (clientX - left) / width - 0.5;
    const y = (clientY - top) / height - 0.5;

    gsap.to(winnerCardRef.current, {
      rotationY: x * 6,
      rotationX: -y * 6,
      transformPerspective: 1000,
      duration: 0.5,
    });
  };

  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.1 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    return () => lenis.destroy();
  }, []);

  const startRound = useCallback((idx) => {
    setCurrentRound(idx);
    setTimeLeft(ROUNDS[idx].time);
    setUserInput("");
    setFeedback(null);
    isProcessing.current = false;
  }, []);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=120%",
        scrub: 1,
        pin: true,
        onUpdate: (self) => {
          if (self.progress > 0.6) {
            if (gameState !== "playing" && gameState !== "success") setGameState("playing");
          } else {
            if (gameState !== "portal") setGameState("portal");
          }
        }
      },
    });

    tl.to(portalRef.current, { scale: 3, autoAlpha: 0, filter: "blur(20px)", duration: 1 })
      .fromTo(gameLayerRef.current, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.5 }, "-=0.3");
  }, { scope: containerRef });

  useEffect(() => {
    let timer;
    if (gameState === "playing" && timeLeft > 0 && !feedback) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0 && gameState === "playing" && !feedback) {
      handleAnswer("TIME_OUT");
    }
    return () => clearInterval(timer);
  }, [timeLeft, gameState, feedback]);

  const handleAnswer = (answer) => {
    if (isProcessing.current || gameState === "success") return;
    isProcessing.current = true;

    const isCorrect = answer.toUpperCase().trim() === ROUNDS[currentRound].correct.toUpperCase();
    
    if (isCorrect) {
      setFeedback("granted");
      setTimeout(() => {
        if (currentRound < ROUNDS.length - 1) {
          startRound(currentRound + 1);
        } else {
          setGameState("success");
          setFeedback(null);
        }
      }, 1000);
    } else {
      setFeedback("denied");
      gsap.to(".main-card", { x: [-10, 10, -5, 5, 0], duration: 0.1, repeat: 2 });
      setTimeout(() => {
        setFeedback(null);
        isProcessing.current = false;
      }, 1000);
    }
  };

  const copyAndReveal = () => {
    navigator.clipboard.writeText(COUPON_CODE);
    setIsCopied(true);
    setTimeout(() => {
        setIsWinner(true);
        setFeedback(null);
    }, 500);
  };

  return (
    <div ref={containerRef} className="relative w-full h-screen bg-bg overflow-hidden text-text no-scrollbar">
      <div className="noise-bg opacity-[0.03] pointer-events-none fixed inset-0 z-0" />
      
      {/* PORTAL INTRO */}
      <div ref={portalRef} className="absolute inset-0 z-[60] flex flex-col items-center justify-center p-4 pointer-events-none">
        <h1 className="font-display text-[12vw] font-black tracking-tighter leading-none uppercase mix-blend-difference">
          READY<span className="text-accent">?</span>
        </h1>
        <p className="font-display text-[10px] tracking-[0.6em] text-accent uppercase opacity-50 mt-8">Scroll_to_Initialize</p>
      </div>

      {/* GAME LAYER - Removed scrollbar classes */}
      <div ref={gameLayerRef} className="absolute inset-0 z-10 flex flex-col items-center justify-center py-12 px-4 md:px-8 invisible opacity-0 overflow-hidden">
        
        {!isWinner ? (
          /* PLAY SCREEN */
          <div className="main-card glass w-full max-w-2xl p-6 md:p-12 relative border border-white/5 shadow-2xl">
             <div className="flex justify-between items-start mb-8 md:mb-10">
                <div className="space-y-1">
                    <span className="text-[9px] font-display text-accent tracking-[0.3em] uppercase font-bold">
                        {gameState === "success" ? "STATUS: SECURE" : ROUNDS[currentRound].sector}
                    </span>
                    <h2 className="text-xl md:text-3xl font-display font-black tracking-tight uppercase">
                        {gameState === "success" ? "SIGNAL_LOCKED" : ROUNDS[currentRound].title}
                    </h2>
                </div>
                {gameState !== "success" && (
                    <div className="text-right">
                        <div className="text-2xl md:text-4xl font-display font-black text-accent tabular-nums">{timeLeft}s</div>
                        <div className="text-[8px] tracking-widest opacity-40 uppercase">Sync_Timer</div>
                    </div>
                )}
             </div>

             <div className="space-y-6 md:space-y-8">
                <h3 className="text-lg md:text-2xl font-display font-bold leading-tight text-text-secondary">
                    {gameState === "success" 
                        ? "Authentication successful. Access token ready for extraction." 
                        : ROUNDS[currentRound].question}
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                    {gameState === "success" ? (
                        <button 
                            onClick={copyAndReveal} 
                            className="col-span-full py-8 md:py-10 bg-accent/10 border-2 border-accent/40 hover:bg-accent/20 transition-all font-display text-lg md:text-xl font-black tracking-[0.2em] group cursor-pointer"
                        >
                           CLAIM_ACCESS_TOKEN <ChevronRight className="inline-block group-hover:translate-x-2 transition-transform" />
                        </button>
                    ) : ROUNDS[currentRound].type === "input" ? (
                        <div className="col-span-full">
                            <input 
                                autoFocus 
                                value={userInput} 
                                onChange={e => setUserInput(e.target.value)} 
                                onKeyDown={e => e.key === 'Enter' && handleAnswer(userInput)} 
                                className="w-full bg-transparent border-b-2 border-white/10 py-3 text-xl md:text-2xl font-display uppercase focus:border-accent outline-none" 
                                placeholder="ENTER_CODE..." 
                            />
                        </div>
                    ) : (
                        ROUNDS[currentRound].options.map(opt => (
                            <button 
                                key={opt} 
                                onClick={() => handleAnswer(opt)} 
                                className="p-4 md:p-5 bg-white/[0.03] border border-white/10 hover:border-accent/60 hover:bg-accent/5 transition-all text-left font-display text-[10px] md:text-xs tracking-widest uppercase cursor-pointer"
                            >
                                {opt}
                            </button>
                        ))
                    )}
                </div>
             </div>
          </div>
        ) : (
          /* WINNER BOARD - Layout Fixes */
          <div 
            ref={winnerCardRef} 
            onMouseMove={handleMouseMove}
            onMouseLeave={() => gsap.to(winnerCardRef.current, {rotationY: 0, rotationX: 0, duration: 1})}
            className="w-full max-w-3xl relative z-40"
          >
            <div className="glass relative border border-white/10 shadow-2xl p-6 md:p-10 overflow-hidden">
                <div className="card-shine absolute inset-0 pointer-events-none opacity-40" />
                
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-8 border-b border-white/5 pb-6 text-center sm:text-left">
                    <div className="flex flex-col sm:flex-row items-center gap-5">
                        <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center bg-accent/5 border border-accent/20 rounded-lg">
                            <Trophy size={24} className="text-accent" />
                        </div>
                        <div>
                            <div className="flex items-center justify-center sm:justify-start gap-2 text-accent mb-1">
                                <ShieldCheck size={12} />
                                <span className="text-[9px] font-display font-bold tracking-[0.4em] uppercase">IDENTITY_VERIFIED</span>
                            </div>
                            <h2 className="text-3xl md:text-5xl font-display font-black tracking-tighter uppercase italic leading-none">MISSION_WON</h2>
                        </div>
                    </div>
                </div>

                {/* COUPON SECTION - Fixed badge overlap */}
                <div className="mb-8 relative group" onClick={() => {navigator.clipboard.writeText(COUPON_CODE); setIsCopied(true)}}>
                    <div className="relative p-6 md:p-8 bg-white/[0.02] border border-white/5 flex flex-col items-center cursor-pointer hover:bg-white/[0.04] transition-colors">
                        <span className="text-[8px] font-display tracking-[0.4em] text-accent/50 uppercase mb-4">Encrypted_Access_Key</span>
                        
                        <div className="relative w-full text-center py-2">
                            <h3 className="text-4xl sm:text-6xl md:text-7xl font-display font-black tracking-[0.05em] text-white shadow-glow-heavy leading-none">
                                {COUPON_CODE}
                            </h3>
                        </div>

                        {/* Positioned relative to the box now */}
                        {isCopied && (
                            <div className="mt-4 bg-accent text-bg px-3 py-1 text-[9px] font-display font-black uppercase shadow-lg">
                                COPIED_TO_CLIPBOARD
                            </div>
                        )}
                        
                        {!isCopied && <div className="mt-4 text-[8px] font-display tracking-[0.3em] opacity-30 uppercase group-hover:opacity-60 transition-opacity">TAP TO COPY</div>}
                    </div>
                </div>

                {/* STATS GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-8">
                    {[
                        { icon: <Zap size={14}/>, label: "RANK", val: "ALPHA_PRIME" },
                        { icon: <Terminal size={14}/>, label: "ID", val: "BOOTCAMP_#07" },
                        { icon: <Lock size={14}/>, label: "CLEARANCE", val: "FULL_ACCESS" }
                    ].map(s => (
                        <div key={s.label} className="bg-white/[0.03] p-4 flex items-center gap-4 border border-white/10 border-l-accent border-l-2">
                            <div className="text-accent">{s.icon}</div>
                            <div>
                                <div className="text-[8px] font-display opacity-30 tracking-[0.2em] uppercase mb-0.5">{s.label}</div>
                                <div className="font-display font-bold text-[10px] md:text-xs">{s.val}</div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <button 
                        onClick={resetGame} 
                        className="flex-1 py-4 border border-white/20 hover:border-accent text-white hover:text-accent transition-all font-display text-[9px] tracking-widest uppercase flex items-center justify-center gap-3 cursor-pointer bg-white/5"
                    >
                        <RefreshCcw size={14} /> RESET_SYSTEM
                    </button>
                    <button className="flex-1 py-4 bg-accent text-bg font-display text-[9px] font-black tracking-[0.2em] uppercase flex items-center justify-center gap-3 hover:bg-white transition-all shadow-xl cursor-pointer">
                        PROCEED_TO_SHOP <ExternalLink size={14} />
                    </button>
                </div>
            </div>
          </div>
        )}

        {/* FEEDBACK OVERLAY - Fixed scaling */}
        {!isWinner && feedback && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-bg/95 backdrop-blur-2xl animate-in fade-in duration-300 pointer-events-none">
             <div className="text-center px-6">
                <div className={`text-5xl sm:text-7xl md:text-8xl font-display font-black uppercase italic leading-none tracking-tighter ${feedback === 'granted' ? 'text-accent' : 'text-red-600'}`}>
                  {feedback === 'granted' ? 'ACCESS_GRANTED' : 'ACCESS_DENIED'}
                </div>
                <div className={`h-1 w-24 md:w-48 mx-auto mt-6 ${feedback === 'granted' ? 'bg-accent' : 'bg-red-600'} animate-pulse shadow-glow`} />
             </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .glass { background: linear-gradient(165deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%); backdrop-filter: blur(20px); }
        .shadow-glow-heavy { text-shadow: 0 0 30px rgba(255, 255, 255, 0.2); }
        .shadow-glow { box-shadow: 0 0 25px rgba(255, 255, 255, 0.1); }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}