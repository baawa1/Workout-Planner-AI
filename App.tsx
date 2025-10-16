
import React, { useState } from 'react';
import type { WorkoutParams, WorkoutPlan } from './types';
import { generateWorkoutPlan } from './services/geminiService';
import WorkoutForm from './components/WorkoutForm';
import WorkoutDisplay from './components/WorkoutDisplay';
import Loader from './components/Loader';
import { DumbbellIcon } from './components/icons/DumbbellIcon';
import ProgressTracker from './components/ProgressTracker';
import { TrendingUpIcon } from './components/icons/TrendingUpIcon';
import { TargetIcon } from './components/icons/TargetIcon';

type View = 'generator' | 'progress';

const App: React.FC = () => {
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<View>('generator');

  const handleGeneratePlan = async (params: WorkoutParams) => {
    setIsLoading(true);
    setError(null);
    setWorkoutPlan(null);
    setView('generator');
    try {
      const plan = await generateWorkoutPlan(params);
      setWorkoutPlan(plan);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const TabButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; children: React.ReactNode }> = ({ active, onClick, icon, children }) => (
    <button
      onClick={onClick}
      className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-colors duration-200 ${
        active
          ? 'border-emerald-500 text-emerald-400'
          : 'border-transparent text-gray-400 hover:text-white hover:border-gray-600'
      }`}
    >
      {icon}
      {children}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <header className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-700/50 sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-3">
            <DumbbellIcon className="h-8 w-8 text-emerald-400" />
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Workout Planner <span className="text-emerald-400">AI</span>
            </h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 xl:col-span-3">
            <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 sticky top-24">
              <div className="flex border-b border-gray-700/50">
                <TabButton active={view === 'generator'} onClick={() => setView('generator')} icon={<TargetIcon className="h-5 w-5"/>}>
                  Generator
                </TabButton>
                <TabButton active={view === 'progress'} onClick={() => setView('progress')} icon={<TrendingUpIcon className="h-5 w-5"/>}>
                  Progress
                </TabButton>
              </div>
              <div className="p-6">
                {view === 'generator' ? (
                   <WorkoutForm onGeneratePlan={handleGeneratePlan} isLoading={isLoading} />
                ) : (
                  <ProgressTracker />
                )}
              </div>
            </div>
          </div>
          <div className="lg:col-span-8 xl:col-span-9">
            <div className="min-h-[70vh] bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 flex flex-col">
              {isLoading && (
                <div className="m-auto flex flex-col items-center justify-center text-center">
                  <Loader />
                  <p className="mt-4 text-lg font-medium text-gray-300">Generating your personalized plan...</p>
                  <p className="text-sm text-gray-400">This might take a moment.</p>
                </div>
              )}
              {error && (
                <div className="m-auto text-center">
                  <p className="text-red-400 font-semibold">An error occurred:</p>
                  <p className="text-gray-300 mt-2">{error}</p>
                  <p className="text-gray-400 text-sm mt-2">Please try again later.</p>
                </div>
              )}
              {!isLoading && !error && workoutPlan && <WorkoutDisplay plan={workoutPlan} />}
              {!isLoading && !error && !workoutPlan && (
                <div className="m-auto text-center px-4">
                  <DumbbellIcon className="mx-auto h-16 w-16 text-gray-600" />
                  <h3 className="mt-4 text-2xl font-bold text-white">Welcome to your AI Fitness Coach</h3>
                  <p className="mt-2 text-gray-400 max-w-md mx-auto">
                    Fill out the form on the left to generate a workout plan tailored just for you.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="text-center py-6 text-gray-500 text-sm">
        <p>Powered by Gemini API</p>
      </footer>
    </div>
  );
};

export default App;
