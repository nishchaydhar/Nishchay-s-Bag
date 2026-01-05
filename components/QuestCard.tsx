import React from 'react';
import { CheckCircle, Circle, Zap, Star } from 'lucide-react';
import { Quest, QuestStatus, QuestCategory } from '../types';

interface QuestCardProps {
  quest: Quest;
  onComplete: (quest: Quest) => void;
}

const CATEGORY_COLORS = {
  [QuestCategory.Social]: 'bg-[#E6B89C]/20 text-[#E6B89C]',
  [QuestCategory.Skill]: 'bg-[#C8D6AF]/20 text-[#8A9A6E]',
  [QuestCategory.Solo]: 'bg-[#C5D1EB]/20 text-[#7A8AB5]',
  [QuestCategory.Adventure]: 'bg-[#EBC5C5]/20 text-[#C58A8A]',
  [QuestCategory.Creative]: 'bg-[#D4C5EB]/20 text-[#9A8AC5]',
};

export const QuestCard: React.FC<QuestCardProps> = ({ quest, onComplete }) => {
  const isCompleted = quest.status === QuestStatus.Mastered;

  return (
    <div className={`
      relative group p-4 rounded-lg border transition-all duration-300
      ${isCompleted ? 'bg-paper border-ink/5 opacity-60' : 'bg-white border-ink/10 hover:border-ink/30 hover:shadow-md'}
    `}>
      <div className="flex justify-between items-start mb-2">
        <span className={`text-[10px] uppercase tracking-widest px-2 py-1 rounded font-bold ${CATEGORY_COLORS[quest.category]}`}>
          {quest.category}
        </span>
        {quest.month && (
          <span className="text-[10px] font-sans text-ink-light uppercase border border-ink/10 px-1.5 py-0.5 rounded">
            {quest.month}
          </span>
        )}
      </div>

      <h4 className={`font-serif text-lg leading-tight mb-3 ${isCompleted ? 'line-through text-ink-light' : 'text-ink'}`}>
        {quest.title}
      </h4>

      <div className="flex justify-between items-end mt-2">
        <div className="flex gap-2">
          {quest.isBold && (
            <div className="flex items-center gap-1 text-xs text-ink-light" title="Bold Quest">
              <Zap size={14} className="text-yellow-600 fill-yellow-600" />
            </div>
          )}
        </div>

        <button 
          onClick={() => onComplete(quest)}
          disabled={isCompleted}
          className={`
            flex items-center gap-1 text-sm font-sans transition-colors
            ${isCompleted ? 'text-green-600 cursor-default' : 'text-ink-light hover:text-ink'}
          `}
        >
          {isCompleted ? (
            <>
              <Star size={16} className="fill-green-600" />
              <span>Mastered</span>
            </>
          ) : (
            <>
              <Circle size={16} />
              <span>Mark Complete</span>
            </>
          )}
        </button>
      </div>
      
      {isCompleted && quest.reflection && (
        <div className="mt-3 pt-3 border-t border-ink/5">
           <p className="text-xs font-serif italic text-ink-light">"{quest.reflection.note}"</p>
        </div>
      )}
    </div>
  );
};