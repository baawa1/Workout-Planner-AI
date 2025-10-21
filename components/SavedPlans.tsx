
import React, { useState, useEffect } from 'react';
import type { SavedWorkoutPlan, WorkoutPlan } from '../types';
import { getSavedPlans, deleteSavedPlan } from '../services/planService';
import { TrashIcon } from './icons/TrashIcon';
import { DumbbellIcon } from './icons/DumbbellIcon';

interface SavedPlansProps {
  onLoadPlan: (plan: WorkoutPlan) => void;
}

const SavedPlans: React.FC<SavedPlansProps> = ({ onLoadPlan }) => {
  const [savedPlans, setSavedPlans] = useState<SavedWorkoutPlan[]>([]);

  const refreshPlans = () => {
    setSavedPlans(getSavedPlans());
  };

  useEffect(() => {
    refreshPlans();
    // Listen for the custom event dispatched when a new plan is saved
    window.addEventListener('planSaved', refreshPlans);
    return () => {
      window.removeEventListener('planSaved', refreshPlans);
    };
  }, []);

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete the plan "${title}"?`)) {
      deleteSavedPlan(id);
      refreshPlans();
    }
  };

  return (
    <div className="mt-8 pt-6 border-t border-gray-700/50">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <DumbbellIcon className="h-5 w-5 text-gray-400" />
        Saved Plans
      </h3>
      {savedPlans.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-4">You have no saved plans.</p>
      ) : (
        <ul className="space-y-3 max-h-60 overflow-y-auto pr-2">
          {savedPlans.map(({ id, plan, savedAt }) => (
            <li key={id} className="bg-gray-700/60 p-3 rounded-lg flex items-center justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-200 truncate">{plan.planTitle}</p>
                <p className="text-xs text-gray-400">
                  Saved on {new Date(savedAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center flex-shrink-0 gap-2">
                <button
                  onClick={() => onLoadPlan(plan)}
                  className="text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors px-3 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-md"
                  aria-label={`Load plan: ${plan.planTitle}`}
                >
                  Load
                </button>
                <button
                  onClick={() => handleDelete(id, plan.planTitle)}
                  className="text-red-500 hover:text-red-400 transition-colors p-1.5 hover:bg-red-500/10 rounded-md"
                  aria-label={`Delete plan: ${plan.planTitle}`}
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SavedPlans;
