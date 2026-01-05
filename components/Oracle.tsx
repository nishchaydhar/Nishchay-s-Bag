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
    <div className="bg-ink text-paper p-6 rounded-xl shadow-lg mb-8 relative overflow-hidden">
      {/* Abstract Background Decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-accent opacity-10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl pointer-events-none"></div>

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="text-accent" size={20} />
          <h3 className="font-serif text-xl tracking-wide">The Oracle</h3>
        </div>
        
        <p className="text-sm font-sans text-paper/70 mb-4">
          Unsure where to embark? Tell the engine your time and energy levels.
        </p>

        <div className="flex gap-2">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g., I have 2 hours and feeling adventurous..."
            className="flex-1 bg-paper/10 border border-paper/20 rounded-lg px-4 py-2 text-paper placeholder:text-paper/30 focus:outline-none focus:border-accent font-sans text-sm"
            onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
          />
          <button 
            onClick={handleAsk}
            disabled={loading}
            className="bg-accent text-ink px-4 py-2 rounded-lg hover:bg-white transition-colors disabled:opacity-50"
          >
            {loading ? '...' : <Send size={18} />}
          </button>
        </div>

        {suggestion && (
          <div className="mt-4 p-4 bg-paper/10 border border-paper/20 rounded-lg animate-fade-in">
             <p className="font-serif italic text-lg leading-relaxed">{suggestion}</p>
          </div>
        )}
      </div>
    </div>
  );
};