
import React, { useState, useEffect, useMemo } from 'react';
import { getWorkoutHistory, clearWorkoutHistory } from '../services/progressService';
import type { CompletedWorkoutLog } from '../types';
import { TrendingUpIcon } from './icons/TrendingUpIcon';
import { TrashIcon } from './icons/TrashIcon';

const ProgressTracker: React.FC = () => {
  const [history, setHistory] = useState<CompletedWorkoutLog[]>([]);

  useEffect(() => {
    setHistory(getWorkoutHistory());
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
      { label: '2 Weeks Ago', count: 0 },
      { label: '3 Weeks Ago', count: 0 },
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
  
  const maxWorkouts = Math.max(...weeklyData.map(w => w.count), 1);

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
      
      <div className="h-48 flex items-end justify-between gap-4">
        {weeklyData.map((week, index) => (
          <div key={index} className="flex-1 flex flex-col items-center h-full">
            <div className="text-lg font-bold text-white">{week.count}</div>
            <div className="w-full h-full flex items-end">
              <div 
                className="w-full bg-emerald-500/50 rounded-t-sm hover:bg-emerald-500 transition-all"
                style={{ height: `${(week.count / maxWorkouts) * 100}%` }}
                title={`${week.count} workout${week.count !== 1 ? 's' : ''}`}
              ></div>
            </div>
            <div className="mt-2 text-xs text-gray-400">{week.label}</div>
          </div>
        ))}
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
