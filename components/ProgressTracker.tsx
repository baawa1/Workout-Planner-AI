
import React, { useState, useEffect, useMemo } from 'react';
import { getWorkoutHistory, clearWorkoutHistory } from '../services/progressService';
import type { CompletedWorkoutLog } from '../types';
import { TrendingUpIcon } from './icons/TrendingUpIcon';
import { TrashIcon } from './icons/TrashIcon';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-700/80 backdrop-blur-sm text-white p-2 rounded-md border border-gray-600 shadow-lg">
        <p className="label text-sm font-semibold">{`${label}`}</p>
        <p className="intro text-xs">{`Workouts: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};


const ProgressTracker: React.FC = () => {
  const [history, setHistory] = useState<CompletedWorkoutLog[]>([]);
  
  const refreshHistory = () => {
    setHistory(getWorkoutHistory());
  };

  useEffect(() => {
    refreshHistory();
    // Refresh history if a workout is completed while on this tab
    window.addEventListener('workoutCompleted', refreshHistory);
    return () => {
      window.removeEventListener('workoutCompleted', refreshHistory);
    };
  }, []);

  const handleClearHistory = () => {
    if (window.confirm("Are you sure you want to clear your entire workout history? This action cannot be undone.")) {
      clearWorkoutHistory();
      setHistory([]);
    }
  };

  const weeklyData = useMemo(() => {
    const weeks = [
      { label: 'This Week', count: 0 },
      { label: 'Last Week', count: 0 },
      { label: '2 Wks Ago', count: 0 },
      { label: '3 Wks Ago', count: 0 },
    ];
    const today = new Date();
    const startOfWeek = (d: Date) => {
      const date = new Date(d);
      const day = date.getDay() || 7; // Get day of week (1-7), with Sunday as 7
      if (day !== 1) date.setHours(-24 * (day - 1));
      date.setHours(0, 0, 0, 0);
      return date;
    };

    const thisWeekStart = startOfWeek(today).getTime();

    history.forEach(log => {
      const logDate = new Date(log.date);
      const weekIndex = Math.floor((thisWeekStart - startOfWeek(logDate).getTime()) / (7 * 24 * 60 * 60 * 1000));
      
      if (weekIndex >= 0 && weekIndex < weeks.length) {
        weeks[weekIndex].count++;
      }
    });

    return weeks.reverse();
  }, [history]);
  
  if (history.length === 0) {
    return (
      <div className="text-center text-gray-400 py-8">
        <TrendingUpIcon className="mx-auto h-12 w-12 text-gray-600" />
        <h3 className="mt-4 text-lg font-semibold text-white">No Progress Yet</h3>
        <p className="mt-1 text-sm">Complete a workout from a generated plan to start tracking your progress.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in-sm">
      <style>{`
        @keyframes fade-in-sm {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-sm {
          animation: fade-in-sm 0.3s ease-out forwards;
        }
      `}</style>
      <div>
        <h3 className="text-lg font-semibold text-white">Weekly Progress</h3>
        <p className="text-sm text-gray-400">Workouts completed per week</p>
      </div>
      
      <div style={{ width: '100%', height: 200 }}>
        <ResponsiveContainer>
          <BarChart
            data={weeklyData}
            margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
            barCategoryGap="20%"
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" vertical={false} />
            <XAxis dataKey="label" tick={{ fill: '#9ca3af', fontSize: 12 }} tickLine={false} axisLine={{ stroke: 'rgba(255, 255, 255, 0.2)' }} />
            <YAxis allowDecimals={false} tick={{ fill: '#9ca3af', fontSize: 12 }} tickLine={false} axisLine={{ stroke: 'rgba(255, 255, 255, 0.2)' }} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(16, 185, 129, 0.1)' }}/>
            <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <button
        onClick={handleClearHistory}
        className="w-full flex items-center justify-center gap-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 py-2 px-3 rounded-md transition-colors"
      >
        <TrashIcon className="h-4 w-4" />
        Clear Workout History
      </button>
    </div>
  );
};

export default ProgressTracker;
