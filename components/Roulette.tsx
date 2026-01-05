import React, { useState } from 'react';
import { Quest, QuestCategory, QuestStatus } from '../types';
import { ArrowDown, Sparkles, RefreshCw } from 'lucide-react';

interface RouletteProps {
  quests: Quest[];
}

const SECTORS = [
  { label: 'Social', color: '#E6B89C', category: QuestCategory.Social },
  { label: 'Skill', color: '#C8D6AF', category: QuestCategory.Skill },
  { label: 'Solo', color: '#C5D1EB', category: QuestCategory.Solo },
  { label: 'Adventure', color: '#EBC5C5', category: QuestCategory.Adventure },
  { label: 'Creative', color: '#D4C5EB', category: QuestCategory.Creative },
];

export const Roulette: React.FC<RouletteProps> = ({ quests }) => {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<{ category: string, quest: Quest | null } | null>(null);

  const spin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setResult(null);

    // Rotate at least 5 times (1800 deg) + random segment
    const randomDeg = Math.floor(Math.random() * 360);
    const newRotation = rotation + 1800 + randomDeg;
    setRotation(newRotation);

    setTimeout(() => {
      setIsSpinning(false);
      calculateResult(newRotation);
    }, 3000);
  };

  const calculateResult = (deg: number) => {
    // Normalize degree to 0-360
    const normalizedDeg = deg % 360;
    
    // In SVG, 0 degrees is usually 3 o'clock or 12 o'clock depending on start.
    // My SVG sectors start at -90 (12 o'clock).
    // The arrow is at the top (12 o'clock).
    // If we rotate the wheel clockwise by X degrees, the sector at 12 o'clock is determined by:
    // (360 - X % 360) % 360.
    
    const angleAtPointer = (360 - normalizedDeg) % 360;
    const sectorAngle = 360 / SECTORS.length;
    const index = Math.floor(angleAtPointer / sectorAngle);
    
    const winningSector = SECTORS[index];
    
    // Pick random quest
    const eligibleQuests = quests.filter(q => q.category === winningSector.category && q.status === QuestStatus.Pending);
    const randomQuest = eligibleQuests.length > 0 
      ? eligibleQuests[Math.floor(Math.random() * eligibleQuests.length)]
      : null;

    setResult({ category: winningSector.label, quest: randomQuest });
  };

  // SVG Helper
  const getCoordinatesForPercent = (percent: number) => {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);
    return [x, y];
  };

  return (
    <div className="p-6 rounded-2xl shadow-lg border border-white/50 flex flex-col items-center justify-center relative overflow-hidden h-full bg-gradient-to-br from-fuchsia-50/80 via-white/90 to-purple-50/80 bg-[length:200%_200%] animate-gradient-slow backdrop-blur-xl">
      <h3 className="font-serif text-xl text-fuchsia-900 mb-4 flex items-center gap-2 relative z-10">
        <RefreshCw size={18} /> Fate's Compass
      </h3>

      {/* Wheel Container */}
      <div className="relative mb-6 scale-90 z-10">
        {/* Pointer */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 text-fuchsia-900 drop-shadow-md">
           <ArrowDown size={32} fill="#701a75" />
        </div>

        {/* The Wheel */}
        <div 
          className="w-48 h-48 rounded-full shadow-lg border-4 border-white/80 relative transition-transform duration-[3000ms] cubic-bezier(0.25, 0.1, 0.25, 1)"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
           <svg viewBox="-1 -1 2 2" className="w-full h-full rotate-[-90deg]">
             {SECTORS.map((sector, i) => {
               const startAngle = i / SECTORS.length;
               const endAngle = (i + 1) / SECTORS.length;
               const [startX, startY] = getCoordinatesForPercent(startAngle);
               const [endX, endY] = getCoordinatesForPercent(endAngle);
               const largeArcFlag = endAngle - startAngle > 0.5 ? 1 : 0;
               
               // Path data for a slice
               const pathData = [
                 `M 0 0`,
                 `L ${startX} ${startY}`,
                 `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`,
                 `Z`
               ].join(' ');

               return (
                 <path 
                   key={i} 
                   d={pathData} 
                   fill={sector.color} 
                   stroke="white" 
                   strokeWidth="0.02" 
                 />
               );
             })}
           </svg>
           {/* Center Cap */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-md z-10 flex items-center justify-center">
             <div className="w-2 h-2 bg-fuchsia-900/20 rounded-full" />
           </div>
        </div>
      </div>

      {/* Spin Button */}
      <button
        onClick={spin}
        disabled={isSpinning}
        className="bg-fuchsia-900 text-white px-6 py-2 rounded-full font-sans text-sm font-medium hover:bg-fuchsia-800 transition-all shadow-md disabled:opacity-50 active:scale-95 z-10"
      >
        {isSpinning ? 'Destiny is turning...' : 'Spin the Wheel'}
      </button>

      {/* Result Display */}
      {result && !isSpinning && (
        <div className="mt-6 text-center animate-fade-in bg-white/40 backdrop-blur-sm p-4 rounded-xl w-full border border-fuchsia-100 z-10">
          <p className="text-xs font-sans text-fuchsia-800 uppercase tracking-widest mb-1">Fate Chose: {result.category}</p>
          {result.quest ? (
            <div className="flex flex-col items-center">
              <p className="font-serif text-xl text-fuchsia-950 mb-2">"{result.quest.title}"</p>
              <div className="flex items-center gap-1 text-xs text-fuchsia-600 font-bold uppercase tracking-widest">
                <Sparkles size={12} />
                <span>Your Quest</span>
              </div>
            </div>
          ) : (
            <p className="font-serif text-fuchsia-900 italic">All quests in this category are complete! Spin again.</p>
          )}
        </div>
      )}
    </div>
  );
};