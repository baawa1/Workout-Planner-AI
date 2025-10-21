
import type { WorkoutPlan, SavedWorkoutPlan } from '../types';

const SAVED_PLANS_KEY = 'workoutSavedPlans';

// Get all saved plans
export const getSavedPlans = (): SavedWorkoutPlan[] => {
  try {
    const plansJson = localStorage.getItem(SAVED_PLANS_KEY);
    return plansJson ? JSON.parse(plansJson) : [];
  } catch (error) {
    console.error("Failed to parse saved plans:", error);
    return [];
  }
};

// Save a new plan
export const saveWorkoutPlan = (plan: WorkoutPlan): void => {
  const savedPlans = getSavedPlans();
  const newSavedPlan: SavedWorkoutPlan = {
    id: `${plan.planTitle}-${new Date().toISOString()}`,
    savedAt: new Date().toISOString(),
    plan: plan,
  };
  savedPlans.unshift(newSavedPlan); // Add to the beginning
  localStorage.setItem(SAVED_PLANS_KEY, JSON.stringify(savedPlans));
};

// Delete a plan by its ID
export const deleteSavedPlan = (id: string): void => {
  let savedPlans = getSavedPlans();
  savedPlans = savedPlans.filter(p => p.id !== id);
  localStorage.setItem(SAVED_PLANS_KEY, JSON.stringify(savedPlans));
};

// Check if the currently displayed plan is already saved by comparing titles and summaries.
export const isPlanSaved = (currentPlan: WorkoutPlan | null): boolean => {
    if (!currentPlan) return false;
    const savedPlans = getSavedPlans();
    return savedPlans.some(savedPlan => 
      savedPlan.plan.planTitle === currentPlan.planTitle && 
      savedPlan.plan.weeklySummary === currentPlan.weeklySummary
    );
};
