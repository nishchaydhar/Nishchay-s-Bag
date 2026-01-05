import React from 'react';
import { CheckCircle, Circle, Zap, Star } from 'lucide-react';
import { Quest, QuestStatus, QuestCategory } from '../types';

interface QuestCardProps {
  quest: Quest;
  onComplete: (quest: Quest) => void;
}

// Dynamic Gradient Themes matching the Home Page aesthetic
const CARD_THEMES = {
  [QuestCategory.Social]: {
    wrapper: 'from-orange-50/90 via-white/80 to-amber-100/90 border-orange-200/50',
    text: 'text-orange-900',
    subText: 'text-orange-800/60',
    badge: 'bg-orange-900/10 text-orange-900 border-orange-200/50',
    icon: 'text-orange-700',
    completedIcon: 'fill-orange-700'
  },
  [QuestCategory.Skill]: {
    wrapper: 'from-emerald-50/90 via-white/80 to-teal-100/90 border-emerald-200/50',
    text: 'text-emerald-900',
    subText: 'text-emerald-800/60',
    badge: 'bg-emerald-900/10 text-emerald-900 border-emerald-200/50',
    icon: 'text-emerald-700',
    completedIcon: 'fill-emerald-700'
  },
  [QuestCategory.Solo]: {
    wrapper: 'from-sky-50/90 via-white/80 to-blue-100/90 border-blue-200/50',
    text: 'text-blue-900',
    subText: 'text-blue-800/60',
    badge: 'bg-blue-900/10 text-blue-900 border-blue-200/50',
    icon: 'text-blue-700',
    completedIcon: 'fill-blue-700'
  },
  [QuestCategory.Adventure]: {
    wrapper: 'from-violet-50/90 via-white/80 to-fuchsia-100/90 border-violet-200/50',
    text: 'text-violet-900',
    subText: 'text-violet-800/60',
    badge: 'bg-violet-900/10 text-violet-900 border-violet-200/50',
    icon: 'text-violet-700',
    completedIcon: 'fill-violet-700'
  },
  [QuestCategory.Creative]: {
    wrapper: 'from-rose-50/90 via-white/80 to-pink-100/90 border-rose-200/50',
    text: 'text-rose-900',
    subText: 'text-rose-800/60',
    badge: 'bg-rose-900/10 text-rose-900 border-rose-200/50',
    icon: 'text-rose-700',
    completedIcon: 'fill-rose-700'
  }
};

export const QuestCard: React.FC<QuestCardProps> = ({ quest, onComplete }) => {
  const isCompleted = quest.status === QuestStatus.Mastered;
  const theme = CARD_THEMES[quest.category];

  return (
    <div className={`
      relative group p-5 rounded-2xl border transition-all duration-500 hover:scale-[1.01] hover:shadow-lg
      bg-gradient-to-br bg-[length:200%_200%] animate-gradient-slow backdrop-blur-xl
      ${isCompleted ? 'grayscale opacity-60' : ''}
      ${theme.wrapper}
    `}>
      <div className="flex justify-between items-start mb-3">
        <span className={`text-[10px] uppercase tracking-widest px-2 py-1 rounded font-bold border ${theme.badge}`}>
          {quest.category}
        </span>
        {quest.month && (
          <span className={`text-[10px] font-sans uppercase border px-2 py-0.5 rounded ${theme.badge} border-opacity-30`}>
            {quest.month}
          </span>
        )}
      </div>

      <h4 className={`font-serif text-xl leading-tight mb-4 font-medium ${theme.text} ${isCompleted ? 'line-through decoration-current decoration-1' : ''}`}>
        {quest.title}
      </h4>

      <div className="flex justify-between items-end mt-auto">
        <div className="flex gap-2">
          {quest.isBold && (
            <div className={`flex items-center gap-1 text-xs font-bold uppercase tracking-wider ${theme.subText}`} title="Bold Quest">
              <Zap size={14} className="fill-current" /> Bold
            </div>
          )}
        </div>

        <button 
          onClick={() => onComplete(quest)}
          disabled={isCompleted}
          className={`
            flex items-center gap-1.5 text-sm font-sans transition-all duration-300
            ${isCompleted ? theme.icon + ' cursor-default' : theme.text + ' hover:scale-105 opacity-80 hover:opacity-100'}
          `}
        >
          {isCompleted ? (
            <>
              <Star size={18} className={theme.completedIcon} />
              <span className="font-bold">Mastered</span>
            </>
          ) : (
            <>
              <Circle size={18} />
              <span>Mark Complete</span>
            </>
          )}
        </button>
      </div>
      
      {isCompleted && quest.reflection && (
        <div className={`mt-4 pt-3 border-t border-current border-opacity-10 ${theme.subText}`}>
           <p className="text-xs font-serif italic opacity-90">"{quest.reflection.note}"</p>
        </div>
      )}
    </div>
  );
};