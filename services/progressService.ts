
import type { CompletedWorkoutLog, DailyWorkout } from '../types';

const PROGRESS_KEY = 'workoutProgressHistory';

export const getWorkoutHistory = (): CompletedWorkoutLog[] => {
  try {
    const historyJson = localStorage.getItem(PROGRESS_KEY);
    return historyJson ? JSON.parse(historyJson) : [];
  } catch (error) {
    console.error("Failed to parse workout history:", error);
    return [];
  }
};

export const logWorkoutCompletion = (workout: DailyWorkout): void => {
  if (hasCompletedWorkoutToday()) {
    console.warn("Workout already logged for today.");
    return;
  }
  const history = getWorkoutHistory();
  const newLog: CompletedWorkoutLog = {
    date: new Date().toISOString(),
    workoutTitle: workout.title,
  };
  history.push(newLog);
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(history));
};

export const clearWorkoutHistory = (): void => {
  localStorage.removeItem(PROGRESS_KEY);
};

export const hasCompletedWorkoutToday = (): boolean => {
  const history = getWorkoutHistory();
  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString();

  return history.some(log => new Date(log.date).toISOString() >= todayStart);
};
