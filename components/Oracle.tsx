import React, { useState } from 'react';
import { Sparkles, Send } from 'lucide-react';
import { Quest } from '../types';
import { getSmartSuggestion } from '../services/geminiService';

interface OracleProps {
  quests: Quest[];
}

export const Oracle: React.FC<OracleProps> = ({ quests }) => {
  const [input, setInput] = useState('');
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!input.trim()) return;
    
    setLoading(true);
    setSuggestion(null);
    const result = await getSmartSuggestion(quests, input);
    setSuggestion(result);
    setLoading(false);
  };

  return (
    <div className="p-6 rounded-xl shadow-lg mb-8 relative overflow-hidden h-full bg-gradient-to-br from-indigo-900 via-violet-900 to-slate-900 bg-[length:200%_200%] animate-gradient-slow text-white border border-white/10">
      {/* Abstract Background Decoration */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500 opacity-20 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none animate-pulse-glow"></div>

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="text-purple-300" size={20} />
          <h3 className="font-serif text-xl tracking-wide text-white">The Oracle</h3>
        </div>
        
        <p className="text-sm font-sans text-white/70 mb-4">
          Unsure where to embark? Tell the engine your time and energy levels.
        </p>

        <div className="flex gap-2">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g., I have 2 hours and feeling adventurous..."
            className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder:text-white/30 focus:outline-none focus:border-purple-300 font-sans text-sm backdrop-blur-md"
            onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
          />
          <button 
            onClick={handleAsk}
            disabled={loading}
            className="bg-purple-500/80 text-white px-4 py-2 rounded-lg hover:bg-purple-400 transition-colors disabled:opacity-50 backdrop-blur-md shadow-lg"
          >
            {loading ? '...' : <Send size={18} />}
          </button>
        </div>

        {suggestion && (
          <div className="mt-4 p-4 bg-white/10 border border-white/20 rounded-lg animate-fade-in backdrop-blur-md">
             <p className="font-serif italic text-lg leading-relaxed text-purple-100">{suggestion}</p>
          </div>
        )}
      </div>
    </div>
  );
};