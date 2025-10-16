
import React, { useState, useEffect } from 'react';
import type { WorkoutPlan, DailyWorkout, Exercise } from '../types';
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import { YoutubeIcon } from './icons/YoutubeIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { logWorkoutCompletion, hasCompletedWorkoutToday } from '../services/progressService';

interface WorkoutDisplayProps {
  plan: WorkoutPlan;
}

const ExerciseCard: React.FC<{ exercise: Exercise }> = ({ exercise }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const youtubeSearchUrl = `https://www.youtube.com/results?search_query=how+to+do+${encodeURIComponent(exercise.name)}`;

  return (
    <li className="bg-gray-800/60 rounded-lg border border-gray-700 transition-all duration-300">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 text-left flex justify-between items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-800 rounded-lg"
        aria-expanded={isExpanded}
        aria-controls={`exercise-details-${exercise.name.replace(/\s+/g, '-')}`}
      >
        <div className="flex-1 pr-4">
          <h4 className="font-semibold text-emerald-400">{exercise.name}</h4>
          <div className="mt-2 grid grid-cols-3 gap-2 text-sm text-gray-300">
            <div>
              <span className="text-gray-500 block text-xs">Sets</span>
              <span>{exercise.sets}</span>
            </div>
            <div>
              <span className="text-gray-500 block text-xs">Reps/Time</span>
              <span>{exercise.reps}</span>
            </div>
            <div>
              <span className="text-gray-500 block text-xs">Rest</span>
              <span>{exercise.rest}</span>
            </div>
          </div>
        </div>
        <ChevronDownIcon className={`h-6 w-6 text-gray-400 transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
      </button>
      <div
        id={`exercise-details-${exercise.name.replace(/\s+/g, '-')}`}
        className={`grid transition-all duration-500 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
      >
        <div className="overflow-hidden">
          <div className="px-4 pb-4 pt-2 border-t border-gray-700/50">
            <h5 className="text-sm font-semibold text-gray-200 mb-2">How to perform:</h5>
            <p className="text-gray-400 text-sm whitespace-pre-wrap">{exercise.description}</p>
            <a
              href={youtubeSearchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <YoutubeIcon className="h-5 w-5" />
              Watch Tutorial on YouTube
            </a>
          </div>
        </div>
      </div>
    </li>
  );
};

const DailyWorkoutCard: React.FC<{ workout: DailyWorkout }> = ({ workout }) => {
  const [isCompletedToday, setIsCompletedToday] = useState(false);

  useEffect(() => {
    const checkCompletion = () => setIsCompletedToday(hasCompletedWorkoutToday());
    checkCompletion();

    // Listen for a custom event to update all cards if one is marked complete
    window.addEventListener('workoutCompleted', checkCompletion);
    return () => {
      window.removeEventListener('workoutCompleted', checkCompletion);
    };
  }, []);

  const handleComplete = () => {
    logWorkoutCompletion(workout);
    // Dispatch event to notify other components
    window.dispatchEvent(new CustomEvent('workoutCompleted'));
  };

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700/80 transition-shadow hover:shadow-lg hover:shadow-emerald-900/20">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-white">{workout.title}</h3>
          <span className="bg-emerald-500/10 text-emerald-400 text-xs font-medium px-2.5 py-1 rounded-full">{workout.focus}</span>
        </div>
        {workout.exercises && workout.exercises.length > 0 && (
          <button
            onClick={handleComplete}
            disabled={isCompletedToday}
            className="mt-4 sm:mt-0 flex items-center justify-center gap-2 text-sm font-semibold py-2 px-4 rounded-lg transition-colors duration-200 disabled:cursor-not-allowed w-full sm:w-auto
              enabled:bg-gray-700 enabled:text-gray-200 enabled:hover:bg-gray-600
              disabled:bg-emerald-500/20 disabled:text-emerald-400"
          >
            <CheckCircleIcon className="h-5 w-5" />
            {isCompletedToday ? 'Completed Today' : 'Mark as Complete'}
          </button>
        )}
      </div>
      {workout.exercises && workout.exercises.length > 0 ? (
        <ul className="space-y-3">
          {workout.exercises.map((exercise, index) => (
            <ExerciseCard key={index} exercise={exercise} />
          ))}
        </ul>
      ) : (
        <div className="text-center py-8 text-gray-400">
          <p className="font-semibold">Rest Day</p>
          <p className="text-sm">Time to recover and grow stronger.</p>
        </div>
      )}
    </div>
  );
};

const WorkoutDisplay: React.FC<WorkoutDisplayProps> = ({ plan }) => {
  return (
    <div className="animate-fade-in space-y-8">
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
      <div className="text-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">{plan.planTitle}</h2>
        <p className="mt-3 max-w-2xl mx-auto text-lg text-gray-400">{plan.weeklySummary}</p>
      </div>

      <div className="space-y-6">
        {plan.dailyWorkouts.map((workout) => (
          <DailyWorkoutCard key={workout.day} workout={workout} />
        ))}
      </div>
    </div>
  );
};

export default WorkoutDisplay;
