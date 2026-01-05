import React, { useEffect, useState } from 'react';

export const LivingBackground = () => {
  const [particles, setParticles] = useState<Array<{id: number, left: number, top: number, duration: number, delay: number, size: number, type: 'spore' | 'data'}>>([]);

  useEffect(() => {
    // Generate particles: Spores (organic) and Data (digital)
    setParticles(Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: 20 + Math.random() * 80, 
      duration: 10 + Math.random() * 20,
      delay: Math.random() * 15,
      size: Math.random() > 0.7 ? 3 : 1.5, // Some larger particles
      type: Math.random() > 0.5 ? 'data' : 'spore'
    })));
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      
      {/* 1. REALISTIC SKYBOX (Golden Hour) */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#4A6fa5] via-[#a8c0d8] to-[#d6cba0]"></div>
      
      {/* Sun Glare (Top Left) */}
      <div 
        className="absolute top-[-10%] left-[10%] w-[60vw] h-[60vw] rounded-full mix-blend-screen opacity-60 animate-pulse-glow"
        style={{
            background: 'radial-gradient(circle, rgba(255,248,220,1) 0%, rgba(255,215,0,0.4) 30%, rgba(255,165,0,0.1) 70%, transparent 100%)'
        }}
      />

      {/* 2. DISTANT MOUNTAINS (Atmospheric Perspective) */}
      <div className="absolute bottom-0 left-0 w-full h-[60vh] opacity-60">
         <svg viewBox="0 0 1440 600" className="w-full h-full" preserveAspectRatio="none">
             <path d="M0,600 L0,200 C300,150 500,300 700,250 C1000,180 1200,350 1440,300 L1440,600 Z" fill="#6B8ba4" />
         </svg>
      </div>

      {/* FOG LAYER 1 */}
      <div className="absolute bottom-0 w-full h-[50vh] bg-gradient-to-t from-white/40 to-transparent" />


      {/* 3. FUTURISTIC CITY (Mid-ground) */}
      <div className="absolute bottom-0 left-[10%] w-[80%] h-[50vh] opacity-80 mix-blend-multiply">
         <svg viewBox="0 0 800 400" className="w-full h-full" preserveAspectRatio="none">
             {/* Complex Skyscrapers */}
             <g fill="#4a5d73">
                <path d="M50,400 L50,150 L100,150 L100,400 Z" />
                <path d="M120,400 L120,80 L180,80 L180,400 Z" />
                <path d="M250,400 L250,180 L320,180 L320,400 Z" />
                <path d="M400,400 L400,50 L480,50 L480,400 Z" />
                <path d="M600,400 L600,120 L680,120 L680,400 Z" />
             </g>
             
             {/* Windows / Lights */}
             <g fill="#A7C7E7" opacity="0.6">
                <rect x="130" y="100" width="40" height="2" />
                <rect x="130" y="120" width="40" height="2" />
                <rect x="410" y="80" width="60" height="2" />
                <rect x="410" y="100" width="60" height="2" />
                <circle cx="440" cy="70" r="2" fill="#00FFFF" className="animate-pulse" />
             </g>
         </svg>
      </div>

      {/* FOG LAYER 2 (Heavier near bottom) */}
      <div className="absolute bottom-0 w-full h-[40vh] bg-gradient-to-t from-[#F7F5F0] via-[#F7F5F0]/60 to-transparent" />


      {/* 4. HERO CYBER-NATURE (Foreground Trees) */}
      
      {/* Left Tree - Hyper-Detailed */}
      <div className="absolute bottom-[-10%] left-[-15%] w-[60vw] h-[110vh] z-10 filter drop-shadow-2xl">
         <svg viewBox="0 0 400 800" className="w-full h-full" preserveAspectRatio="none">
             <defs>
                 <linearGradient id="trunkGrad" x1="0" y1="0" x2="1" y2="0">
                     <stop offset="0%" stopColor="#1a2e1a" />
                     <stop offset="40%" stopColor="#2F4F4F" />
                     <stop offset="100%" stopColor="#1a2e1a" />
                 </linearGradient>
                 <filter id="glow">
                    <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                    <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                 </filter>
             </defs>
             
             {/* Main Trunk - Twisted Organic Shape */}
             <path d="M150,800 C250,700 100,500 200,300 C250,200 150,100 200,0 L350,0 C300,150 400,300 300,500 C350,700 250,800 300,800 Z" fill="url(#trunkGrad)" />
             
             {/* Roots / Moss */}
             <path d="M100,800 Q150,750 200,800" fill="#3A5F0B" opacity="0.8" />
             <path d="M250,800 Q300,720 380,800" fill="#3A5F0B" opacity="0.8" />

             {/* Tech Veins (The 'Cyber' part) */}
             <g className="glow-cyan" stroke="#00FFFF" fill="none" strokeLinecap="round">
                 {/* Main Line */}
                 <path d="M200,800 Q220,600 180,400 Q200,200 220,100" strokeWidth="3" className="animate-circuit-flow" strokeDasharray="50 100" />
                 {/* Branches */}
                 <path d="M180,400 Q150,350 120,380" strokeWidth="2" className="animate-circuit-flow" strokeDasharray="20 40" style={{animationDuration: '4s'}} />
                 <path d="M220,100 Q250,80 280,120" strokeWidth="2" className="animate-circuit-flow" strokeDasharray="30 60" style={{animationDuration: '5s'}} />
             </g>

             {/* Glowing Nodes */}
             <circle cx="180" cy="400" r="4" fill="#00FFFF" className="animate-pulse-glow" filter="url(#glow)" />
             <circle cx="220" cy="100" r="3" fill="#00FFFF" className="animate-pulse-glow" filter="url(#glow)" style={{animationDelay: '1s'}} />
         </svg>
      </div>

      {/* Right Tree - Framing */}
      <div className="absolute bottom-[-5%] right-[-10%] w-[50vw] h-[100vh] z-10 filter drop-shadow-2xl">
         <svg viewBox="0 0 300 800" className="w-full h-full" preserveAspectRatio="none">
             <path d="M200,800 C100,700 250,500 150,200 C100,100 200,50 180,0 L300,0 L300,800 Z" fill="url(#trunkGrad)" />
             <g className="glow-cyan" stroke="#64FFDA" fill="none" strokeLinecap="round">
                 <path d="M220,800 Q180,600 200,400 Q180,200 200,100" strokeWidth="2" className="animate-circuit-flow" strokeDasharray="40 80" />
             </g>
             <circle cx="200" cy="400" r="3" fill="#64FFDA" className="animate-pulse-glow" filter="url(#glow)" />
         </svg>
      </div>


      {/* 5. DRONES (Active Elements) */}
      <div className="absolute top-[30%] left-[-10%] animate-drone-patrol z-5">
         {/* Drone Group */}
         <div className="relative w-24 h-12">
            {/* Scanning Beam */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-0 h-0 border-l-[20px] border-r-[20px] border-b-[60px] border-l-transparent border-r-transparent border-b-cyan-400/20 origin-top animate-scan-beam" />
            
            <svg viewBox="0 0 100 50" className="w-full h-full drop-shadow-lg">
                {/* Main Hull */}
                <ellipse cx="50" cy="25" rx="30" ry="10" fill="#2D2A26" stroke="#4A5568" strokeWidth="1" />
                {/* Engine Glows */}
                <circle cx="25" cy="25" r="4" fill="#00FFFF" className="animate-pulse" opacity="0.8" />
                <circle cx="75" cy="25" r="4" fill="#00FFFF" className="animate-pulse" opacity="0.8" />
                {/* Central Eye */}
                <circle cx="50" cy="30" r="3" fill="#FF4500" className="animate-pulse" />
                {/* Rotors */}
                <rect x="10" y="20" width="20" height="2" fill="#4A5568" className="animate-spin origin-center" />
                <rect x="70" y="20" width="20" height="2" fill="#4A5568" className="animate-spin origin-center" />
            </svg>
         </div>
      </div>
      
      {/* Second Drone (Distant) */}
      <div className="absolute top-[20%] right-[20%] animate-float opacity-60" style={{animationDuration: '20s'}}>
          <svg width="40" height="20" viewBox="0 0 100 50">
             <ellipse cx="50" cy="25" rx="30" ry="10" fill="#2D2A26" />
             <circle cx="50" cy="30" r="5" fill="#00FFFF" className="animate-pulse" />
          </svg>
      </div>


      {/* 6. PARTICLES (Depth & Life) */}
      {particles.map((p) => (
        <div
          key={p.id}
          className={`absolute rounded-full ${p.type === 'data' ? 'bg-cyan-300' : 'bg-yellow-100'} blur-[0.5px]`}
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            opacity: p.type === 'data' ? 0.6 : 0.4,
            animation: `float ${p.duration}s infinite ease-in-out`,
            animationDelay: `-${p.delay}s`,
            boxShadow: p.type === 'data' ? '0 0 4px #00FFFF' : 'none'
          }}
        />
      ))}
      
      {/* 7. CINEMATIC OVERLAYS */}
      {/* Noise Grain */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
      
      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.15)_100%)]" />
    </div>
  );
};