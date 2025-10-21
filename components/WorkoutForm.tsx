
import React, { useState } from 'react';
import type { WorkoutParams, WorkoutPlan } from '../types';
import { TargetIcon } from './icons/TargetIcon';
import { BarChartIcon } from './icons/BarChartIcon';
import { CalendarIcon } from './icons/CalendarIcon';
import { ClockIcon } from './icons/ClockIcon';
import { DumbbellIcon } from './icons/DumbbellIcon';
import SavedPlans from './SavedPlans';

interface WorkoutFormProps {
  onGeneratePlan: (params: WorkoutParams) => void;
  onLoadPlan: (plan: WorkoutPlan) => void;
  isLoading: boolean;
}

const InputGroup: React.FC<{ label: string; children: React.ReactNode; icon: React.ReactNode }> = ({ label, children, icon }) => (
  <div>
    <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
      {icon}
      {label}
    </label>
    {children}
  </div>
);

const WorkoutForm: React.FC<WorkoutFormProps> = ({ onGeneratePlan, onLoadPlan, isLoading }) => {
  const [params, setParams] = useState<WorkoutParams>({
    goal: 'build-muscle',
    level: 'beginner',
    duration: 45,
    daysPerWeek: 3,
    equipment: 'Bodyweight only',
  });

  const handleChange = <T extends keyof WorkoutParams,>(field: T, value: WorkoutParams[T]) => {
    setParams(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGeneratePlan(params);
  };

  const inputStyles = "w-full bg-gray-700/50 border border-gray-600 rounded-md py-2 px-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition";

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <InputGroup label="Primary Goal" icon={<TargetIcon className="h-5 w-5 mr-2 text-gray-400"/>}>
          <select value={params.goal} onChange={(e) => handleChange('goal', e.target.value as WorkoutParams['goal'])} className={inputStyles}>
            <option value="build-muscle">Build Muscle</option>
            <option value="lose-fat">Lose Fat</option>
            <option value="improve-endurance">Improve Endurance</option>
          </select>
        </InputGroup>

        <InputGroup label="Experience Level" icon={<BarChartIcon className="h-5 w-5 mr-2 text-gray-400"/>}>
          <select value={params.level} onChange={(e) => handleChange('level', e.target.value as WorkoutParams['level'])} className={inputStyles}>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </InputGroup>

        <InputGroup label="Days Per Week" icon={<CalendarIcon className="h-5 w-5 mr-2 text-gray-400"/>}>
          <input type="number" min="1" max="7" value={params.daysPerWeek} onChange={(e) => handleChange('daysPerWeek', parseInt(e.target.value, 10))} className={inputStyles} />
        </InputGroup>
        
        <InputGroup label="Duration (minutes)" icon={<ClockIcon className="h-5 w-5 mr-2 text-gray-400"/>}>
          <input type="number" min="15" max="120" step="5" value={params.duration} onChange={(e) => handleChange('duration', parseInt(e.target.value, 10))} className={inputStyles} />
        </InputGroup>

        <InputGroup label="Available Equipment" icon={<DumbbellIcon className="h-5 w-5 mr-2 text-gray-400"/>}>
          <input type="text" value={params.equipment} onChange={(e) => handleChange('equipment', e.target.value)} placeholder="e.g., Dumbbells, pull-up bar" className={inputStyles} />
        </InputGroup>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-emerald-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-emerald-500 transition-all duration-300 ease-in-out disabled:bg-emerald-800 disabled:cursor-not-allowed disabled:text-gray-400 flex items-center justify-center"
        >
          {isLoading ? 'Generating...' : 'Generate Plan'}
        </button>
      </form>
      <SavedPlans onLoadPlan={onLoadPlan} />
    </div>
  );
};

export default WorkoutForm;
