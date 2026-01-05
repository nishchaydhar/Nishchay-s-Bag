import React, { useState, useMemo, useEffect } from 'react';
import { INITIAL_QUESTS, LEVEL_TITLES } from './constants';
import { Quest, QuestStatus, QuestCategory, Reflection } from './types';
import { Analytics } from './components/Analytics';
import { QuestCard } from './components/QuestCard';
import { Oracle } from './components/Oracle';
import { Roulette } from './components/Roulette';
import { Grogu } from './components/Grogu';
import { CreativeStudio } from './components/CreativeStudio';
import { LivingBackground } from './components/LivingBackground';
import { LayoutDashboard, CheckCircle2, Zap, Mountain, BookOpen, Plus, X, Trophy, Palette } from 'lucide-react';

export default function App() {
  const [quests, setQuests] = useState<Quest[]>(INITIAL_QUESTS);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'quests' | 'studio'>('dashboard');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [mounted, setMounted] = useState(false);
  
  // Modal State for completing quest
  const [completingQuest, setCompletingQuest] = useState<Quest | null>(null);
  const [reflectionNote, setReflectionNote] = useState('');

  // Modal State for Adding Quest
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newQuestTitle, setNewQuestTitle] = useState('');
  const [newQuestCategory, setNewQuestCategory] = useState<QuestCategory>(QuestCategory.Solo);
  const [newQuestIsBold, setNewQuestIsBold] = useState(false);

  // Trigger animations on mount
  useEffect(() => {
    // Small delay to ensure DOM is ready for transition
    const timer = setTimeout(() => setMounted(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // Generate stable random heights for the boldness meter visual so they don't jitter on re-renders
  const boldnessBarHeights = useMemo(() => {
    return Array.from({ length: 10 }, () => 30 + Math.floor(Math.random() * 60)); 
  }, []);

  // Stats Calculation
  const stats = useMemo(() => {
    const completed = quests.filter(q => q.status === QuestStatus.Mastered).length;
    const total = quests.length;
    // Simple level formula: 1 level every 5 quests
    const levelIndex = Math.min(Math.floor(completed / 5), LEVEL_TITLES.length - 1);
    const boldCompleted = quests.filter(q => q.isBold && q.status === QuestStatus.Mastered).length;

    return {
      completed,
      total,
      levelTitle: LEVEL_TITLES[levelIndex],
      level: levelIndex + 1,
      boldPoints: boldCompleted,
      nextLevelQuestCount: 5 - (completed % 5)
    };
  }, [quests]);

  const handleQuestComplete = (quest: Quest) => {
    setCompletingQuest(quest);
    setReflectionNote('');
  };

  const confirmCompletion = () => {
    if (!completingQuest) return;

    const updatedQuests = quests.map(q => {
      if (q.id === completingQuest.id) {
        return {
          ...q,
          status: QuestStatus.Mastered,
          reflection: {
            note: reflectionNote || "A memory created.",
            dateCompleted: new Date().toISOString()
          }
        };
      }
      return q;
    });

    setQuests(updatedQuests);
    setCompletingQuest(null);
  };

  const handleAddQuest = () => {
    if (!newQuestTitle.trim()) return;

    // Generate a simple unique ID
    const newId = quests.length > 0 ? Math.max(...quests.map(q => q.id)) + 1 : 1;
    
    const newQuest: Quest = {
      id: newId,
      title: newQuestTitle,
      category: newQuestCategory,
      status: QuestStatus.Pending,
      isBold: newQuestIsBold,
      month: new Date().toLocaleString('default', { month: 'short' }) // Default to current month
    };

    setQuests([newQuest, ...quests]);
    
    // Reset and Close
    setNewQuestTitle('');
    setNewQuestCategory(QuestCategory.Solo);
    setNewQuestIsBold(false);
    setIsAddModalOpen(false);
    
    // Switch to quests tab to see the new entry
    setActiveTab('quests');
  };

  // Quest of the Week (Logic: First pending quest in January, or just random pending)
  const questOfTheWeek = useMemo(() => {
    return quests.find(q => q.status === QuestStatus.Pending && q.month === 'Jan') || quests.find(q => q.status === QuestStatus.Pending);
  }, [quests]);

  // Filtering
  const filteredQuests = useMemo(() => {
    if (selectedCategory === 'All') return quests;
    return quests.filter(q => q.category === selectedCategory);
  }, [quests, selectedCategory]);

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#F7F5F0]">
      {/* 1. Animated Background Ecosystem */}
      <LivingBackground />

      {/* 2. Main Content (z-index to stay above background) */}
      <div className="relative z-10">
        
        {/* Navigation Header */}
        <nav className="sticky top-0 z-40 bg-[#F7F5F0]/60 backdrop-blur-md border-b border-white/20 px-6 py-4 flex justify-between items-center shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-ink to-gray-800 text-paper flex items-center justify-center rounded-lg font-serif text-xl font-bold shadow-lg">
              26
            </div>
            <div>
              <h1 className="font-serif text-xl text-ink leading-none text-shadow-sm">Odyssey Engine</h1>
              <p className="text-xs font-sans text-ink-light tracking-widest uppercase mt-1">Status: {stats.levelTitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="bg-ink/90 text-paper px-3 py-2 rounded-lg font-sans text-sm flex items-center gap-2 hover:bg-ink transition-colors shadow-lg hidden md:flex backdrop-blur-sm"
            >
              <Plus size={16} />
              New Quest
            </button>
            
            <div className="flex gap-2">
              <button 
                onClick={() => setIsAddModalOpen(true)}
                className="p-2 md:hidden bg-ink text-paper rounded-full shadow-lg"
              >
                <Plus size={20} />
              </button>
              <button 
                onClick={() => setActiveTab('dashboard')}
                className={`p-2 rounded-full transition-colors ${activeTab === 'dashboard' ? 'bg-white/40 text-ink shadow-sm' : 'text-ink-light hover:bg-white/20'}`}
              >
                <LayoutDashboard size={20} />
              </button>
              <button 
                onClick={() => setActiveTab('quests')}
                className={`p-2 rounded-full transition-colors ${activeTab === 'quests' ? 'bg-white/40 text-ink shadow-sm' : 'text-ink-light hover:bg-white/20'}`}
              >
                <BookOpen size={20} />
              </button>
              <button 
                onClick={() => setActiveTab('studio')}
                className={`p-2 rounded-full transition-colors ${activeTab === 'studio' ? 'bg-white/40 text-ink shadow-sm' : 'text-ink-light hover:bg-white/20'}`}
              >
                <Palette size={20} />
              </button>
            </div>
          </div>
        </nav>

        <main className="max-w-4xl mx-auto px-6 py-8">
          
          {/* DASHBOARD VIEW */}
          {activeTab === 'dashboard' && (
            <div className="animate-fade-in space-y-8">
              
              {/* Stats Grid - 3 Columns */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* 1. Level System Card (Nature/Growth Theme) */}
                  <div className="relative p-6 rounded-2xl overflow-hidden flex flex-col justify-between h-48 group hover:scale-[1.02] transition-all duration-500 bg-gradient-to-br from-emerald-50/80 via-white/90 to-teal-50/80 bg-[length:200%_200%] animate-gradient-slow backdrop-blur-xl border border-white/50 shadow-lg">
                      <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500/30"></div>
                      <div className="flex justify-between items-start relative z-10">
                          <div>
                              <p className="text-[10px] text-emerald-800 uppercase tracking-widest font-bold">Current Rank</p>
                              <span className="inline-block mt-2 px-2 py-1 bg-emerald-100/50 text-emerald-900 text-xs font-bold rounded uppercase tracking-wider backdrop-blur-sm">
                                  {stats.levelTitle}
                              </span>
                          </div>
                          <div className="text-emerald-700/30 group-hover:text-emerald-600/40 transition-colors duration-500">
                              <Trophy size={48} strokeWidth={1} />
                          </div>
                      </div>
                      
                      <div className="relative z-10">
                          <div className="flex items-end gap-2 mb-2">
                              <span className="text-4xl font-serif text-emerald-900">{stats.level}</span>
                              <span className="text-xs text-emerald-700/80 mb-1.5 uppercase tracking-wide">Level</span>
                          </div>
                          {/* Level Progress Bar */}
                          <div className="w-full h-2 bg-emerald-900/10 rounded-full overflow-hidden">
                              <div 
                                  className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 transition-all duration-[1200ms] ease-[cubic-bezier(0.25,1,0.5,1)]"
                                  style={{ width: `${mounted ? (5 - stats.nextLevelQuestCount) / 5 * 100 : 0}%` }}
                              />
                          </div>
                          <p className="text-[10px] text-emerald-700 mt-2 text-right font-medium">
                              {stats.nextLevelQuestCount} quests to next level
                          </p>
                      </div>
                  </div>

                  {/* 2. Boldness Meter Card (Sun/Energy Theme) */}
                  <div className="relative p-6 rounded-2xl overflow-hidden flex flex-col justify-between h-48 hover:scale-[1.02] transition-all duration-500 bg-gradient-to-br from-amber-50/80 via-white/90 to-orange-50/80 bg-[length:200%_200%] animate-gradient-slow backdrop-blur-xl border border-white/50 shadow-lg">
                      <div className="flex justify-between items-start relative z-10">
                          <div>
                              <p className="text-[10px] text-amber-800 uppercase tracking-widest font-bold flex items-center gap-1">
                                  <Zap size={14} className="text-amber-600 fill-amber-600" /> Boldness Meter
                              </p>
                              <p className="text-xs text-amber-700/80 mt-1">Courage tracked</p>
                          </div>
                          <div className="text-3xl font-serif text-amber-900">{stats.boldPoints}</div>
                      </div>
                      
                      {/* Visual Equalizer Bars */}
                      <div className="flex items-end h-20 gap-1.5 mt-2 px-2 relative z-10">
                          {boldnessBarHeights.map((height, i) => (
                              <div 
                                  key={i}
                                  className={`flex-1 rounded-t-sm transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${i < stats.boldPoints ? 'bg-gradient-to-t from-orange-500 to-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]' : 'bg-amber-900/5'}`}
                                  style={{ 
                                      height: mounted && i < stats.boldPoints ? `${height}%` : '15%',
                                      transitionDelay: `${i * 60}ms`,
                                  }}
                              />
                          ))}
                      </div>
                      <p className="text-[10px] text-center text-amber-800/60 uppercase tracking-widest mt-1 relative z-10">Fear Factor</p>
                  </div>

                  {/* 3. Total Progress (Atmosphere/Sky Theme) */}
                  <div className="relative p-6 rounded-2xl overflow-hidden flex flex-col justify-between h-48 hover:scale-[1.02] transition-all duration-500 bg-gradient-to-br from-cyan-50/80 via-white/90 to-blue-50/80 bg-[length:200%_200%] animate-gradient-slow backdrop-blur-xl border border-white/50 shadow-lg">
                      <div className="flex justify-between items-start relative z-10">
                          <p className="text-[10px] text-cyan-800 uppercase tracking-widest font-bold">Odyssey Completion</p>
                          <span className="text-xs font-sans bg-cyan-100/50 px-2 py-1 rounded text-cyan-900 backdrop-blur-sm">2026</span>
                      </div>
                      
                      <div className="flex items-center justify-center -mt-2 relative z-10">
                          <div className="relative w-24 h-24 flex items-center justify-center">
                              <svg className="w-full h-full -rotate-90 drop-shadow-sm">
                                  <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-cyan-900/10" />
                                  <circle 
                                      cx="48" cy="48" r="40" 
                                      stroke="currentColor" strokeWidth="6" 
                                      fill="transparent" 
                                      strokeDasharray="251.2"
                                      strokeDashoffset={mounted ? 251.2 - (251.2 * stats.completed / Math.max(stats.total, 1)) : 251.2}
                                      className="text-cyan-600 transition-all duration-[1500ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
                                      strokeLinecap="round"
                                  />
                              </svg>
                              <div className="absolute inset-0 flex items-center justify-center flex-col">
                                  <span className="text-xl font-serif font-bold text-cyan-900">{Math.round((stats.completed / Math.max(stats.total, 1)) * 100)}%</span>
                              </div>
                          </div>
                      </div>
                      <div className="text-center relative z-10">
                          <p className="text-sm font-serif text-cyan-900">{stats.completed} <span className="text-cyan-700/70">/ {stats.total} Quests</span></p>
                      </div>
                  </div>
              </div>

              {/* Decision Making Row: Oracle + Roulette */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-full">
                  <Oracle quests={quests} />
                </div>
                <div className="h-full">
                  <Roulette quests={quests} />
                </div>
              </div>
              
              <Analytics quests={quests} />

              {/* Quest of the Week (Deep Tech/Space Theme) */}
              {questOfTheWeek && (
                <div className="rounded-xl p-6 relative overflow-hidden bg-gradient-to-r from-slate-800 via-zinc-800 to-slate-900 bg-[length:200%_200%] animate-gradient-slow shadow-xl border border-white/10 group">
                  {/* Subtle animated overlay */}
                  <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
                  
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="text-cyan-300 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                           <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse"></span>
                           Quest of the Week
                        </span>
                        <h3 className="font-serif text-2xl mt-2 text-white group-hover:text-cyan-50 transition-colors">{questOfTheWeek.title}</h3>
                      </div>
                      <div className="bg-white/10 p-2 rounded-full backdrop-blur-md">
                        <Mountain className="text-cyan-200" size={32} />
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm font-sans mb-6 max-w-lg leading-relaxed">
                      It's January. The year is fresh. This is the perfect starting point for your Odyssey.
                    </p>
                    <button 
                      onClick={() => setActiveTab('quests')}
                      className="bg-white text-slate-900 px-6 py-2.5 rounded-full font-sans text-sm font-bold hover:bg-cyan-50 transition-colors shadow-lg shadow-cyan-900/20"
                    >
                      View Quest Log
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* QUESTS LIST VIEW */}
          {activeTab === 'quests' && (
            <div className="animate-fade-in">
              <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <h2 className="font-serif text-3xl text-ink">Quest Log</h2>
                
                <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto no-scrollbar">
                  {['All', 'Social', 'Skill', 'Solo', 'Adventure', 'Creative'].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`
                        px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all backdrop-blur-sm
                        ${selectedCategory === cat 
                          ? 'bg-ink text-paper shadow-md' 
                          : 'bg-white/40 text-ink-light hover:bg-white/60'}
                      `}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Add New Quest Card - Prominent dedicated section with Neutral Gradient */}
                <button 
                  onClick={() => setIsAddModalOpen(true)}
                  className="group p-4 rounded-2xl border-2 border-dashed border-gray-400/20 hover:border-gray-500/40 transition-all duration-300 flex flex-col items-center justify-center min-h-[140px] text-center backdrop-blur-xl bg-gradient-to-br from-gray-50/80 via-white/90 to-slate-100/80 bg-[length:200%_200%] animate-gradient-slow shadow-sm hover:shadow-lg hover:scale-[1.01]"
                >
                  <div className="w-12 h-12 rounded-full bg-ink/5 group-hover:bg-ink group-hover:text-paper text-ink-light mb-3 flex items-center justify-center transition-all duration-300">
                    <Plus size={24} />
                  </div>
                  <h4 className="font-serif text-xl text-ink/70 group-hover:text-ink font-medium">Chart a New Course</h4>
                  <p className="text-xs font-sans text-ink-light uppercase tracking-widest mt-1 opacity-70">Add to Log</p>
                </button>

                {filteredQuests.map(quest => (
                  <QuestCard 
                    key={quest.id} 
                    quest={quest} 
                    onComplete={handleQuestComplete}
                  />
                ))}
              </div>
              
              {filteredQuests.length === 0 && (
                <div className="text-center py-10 text-ink-light font-serif text-lg">
                  No existing quests found here. Why not add one above?
                </div>
              )}
            </div>
          )}

          {/* STUDIO VIEW */}
          {activeTab === 'studio' && <CreativeStudio />}

        </main>

        {/* Floating Grogu (Replaces ChatBot) */}
        <Grogu quests={quests} />

        {/* Reflection Modal (Complete) */}
        {completingQuest && (
          <div className="fixed inset-0 bg-ink/40 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-paper/90 w-full max-w-md rounded-xl shadow-2xl p-6 border border-ink/10 animate-fade-in backdrop-blur-xl">
              <h3 className="font-serif text-2xl text-ink mb-2">Memory Unlocked</h3>
              <p className="text-ink-light text-sm mb-6">
                You've completed <span className="font-semibold text-ink">"{completingQuest.title}"</span>. 
                Leave a note for your future self.
              </p>
              
              <textarea
                value={reflectionNote}
                onChange={(e) => setReflectionNote(e.target.value)}
                placeholder="What did it feel like? (e.g., 'The sunrise was colder than expected, but the silence was worth it.')"
                className="w-full h-32 bg-white/50 border border-ink/10 rounded-lg p-3 text-ink font-serif placeholder:text-ink/30 focus:outline-none focus:border-accent resize-none mb-6"
              />
              
              <div className="flex gap-3 justify-end">
                <button 
                  onClick={() => setCompletingQuest(null)}
                  className="px-4 py-2 text-ink-light hover:text-ink font-sans text-sm"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmCompletion}
                  className="bg-ink text-paper px-6 py-2 rounded-lg font-sans text-sm hover:bg-ink/90 flex items-center gap-2 shadow-lg"
                >
                  <CheckCircle2 size={16} />
                  Conquer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Quest Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-ink/40 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-paper/90 w-full max-w-md rounded-xl shadow-2xl p-6 border border-ink/10 animate-fade-in relative backdrop-blur-xl">
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="absolute top-4 right-4 text-ink-light hover:text-ink"
              >
                <X size={20} />
              </button>
              
              <h3 className="font-serif text-2xl text-ink mb-6">New Odyssey Entry</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-sans text-ink-light uppercase tracking-widest mb-2">Quest Title</label>
                  <input
                    type="text"
                    value={newQuestTitle}
                    onChange={(e) => setNewQuestTitle(e.target.value)}
                    placeholder="e.g., Climb a new mountain..."
                    className="w-full bg-white/50 border border-ink/10 rounded-lg px-4 py-3 text-ink font-serif placeholder:text-ink/30 focus:outline-none focus:border-accent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-sans text-ink-light uppercase tracking-widest mb-3">Category</label>
                  <div className="flex flex-wrap gap-2">
                    {Object.values(QuestCategory).map(cat => (
                      <button
                        key={cat}
                        onClick={() => setNewQuestCategory(cat)}
                        className={`
                          px-3 py-1.5 rounded-full text-xs font-medium border transition-colors
                          ${newQuestCategory === cat 
                            ? 'bg-ink text-paper border-ink' 
                            : 'bg-white/50 text-ink-light border-ink/10 hover:border-ink/30'}
                        `}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-white/50 p-3 rounded-lg border border-ink/5">
                  <button 
                    onClick={() => setNewQuestIsBold(!newQuestIsBold)}
                    className={`
                      w-10 h-6 rounded-full flex items-center transition-colors p-1
                      ${newQuestIsBold ? 'bg-yellow-600 justify-end' : 'bg-ink/10 justify-start'}
                    `}
                  >
                    <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
                  </button>
                  <div className="flex flex-col">
                    <span className="text-sm font-serif text-ink">Bold Quest</span>
                    <span className="text-[10px] text-ink-light font-sans">For tasks that require extra courage.</span>
                  </div>
                </div>

                <button 
                  onClick={handleAddQuest}
                  className="w-full bg-ink text-paper py-3 rounded-lg font-sans text-sm font-medium hover:bg-ink/90 transition-colors mt-4 flex items-center justify-center gap-2 shadow-lg"
                >
                  <Plus size={16} />
                  Write to Log
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}