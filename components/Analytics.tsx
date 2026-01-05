import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { Quest, QuestCategory, QuestStatus } from '../types';

interface AnalyticsProps {
  quests: Quest[];
}

const COLORS = {
  [QuestCategory.Social]: '#E6B89C', // Terracotta
  [QuestCategory.Skill]: '#C8D6AF', // Soft Green
  [QuestCategory.Solo]: '#C5D1EB',  // Soft Blue
  [QuestCategory.Adventure]: '#EBC5C5', // Soft Pink
  [QuestCategory.Creative]: '#D4C5EB', // Lavender
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-paper border border-ink/10 p-2 rounded shadow-md text-sm font-serif">
        <p className="label">{`${payload[0].name} : ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

export const Analytics: React.FC<AnalyticsProps> = ({ quests }) => {
  // 1. Prepare Pie Chart Data (Distribution of Categories)
  const categoryCount = quests.reduce((acc, quest) => {
    acc[quest.category] = (acc[quest.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.keys(categoryCount).map(key => ({
    name: key,
    value: categoryCount[key]
  }));

  // 2. Prepare Bar Chart Data (Momentum by Month - Simulated for demo as most don't have dates yet)
  // In a real app, we'd track completionDate. Here we visualize the planned months.
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const monthData = months.map(month => {
    const planned = quests.filter(q => q.month === month).length;
    // Mocking "completed" for visualization if status is mastered, purely for the bar chart structure
    // Since this is a "Starting Progress" view, most are 0.
    return {
      name: month,
      planned: planned,
      completed: 0 
    };
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
      {/* Life Balance Pie Chart */}
      <div className="bg-white/50 p-6 rounded-xl border border-ink/5 shadow-sm">
        <h3 className="text-xl font-serif text-ink mb-4 text-center">Life Balance</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.name as QuestCategory] || '#ccc'} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-wrap justify-center gap-3 mt-4 text-xs font-sans text-ink-light uppercase tracking-widest">
            {Object.entries(COLORS).map(([cat, color]) => (
                <div key={cat} className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full" style={{backgroundColor: color}}></div>
                    <span>{cat}</span>
                </div>
            ))}
        </div>
      </div>

      {/* Momentum Bar Graph */}
      <div className="bg-white/50 p-6 rounded-xl border border-ink/5 shadow-sm">
        <h3 className="text-xl font-serif text-ink mb-4 text-center">2026 Momentum</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={monthData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontFamily: 'Inter', fontSize: 10, fill: '#5C5852'}} />
              <YAxis hide />
              <Tooltip cursor={{fill: 'transparent'}} content={<CustomTooltip />} />
              <Bar dataKey="planned" fill="#2D2A26" radius={[4, 4, 4, 4]} barSize={8} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="text-center text-xs text-ink-light font-sans mt-4">PLANNED QUESTS PER MONTH</p>
      </div>
    </div>
  );
};