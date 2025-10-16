
export interface WorkoutParams {
  goal: 'build-muscle' | 'lose-fat' | 'improve-endurance';
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  daysPerWeek: number;
  equipment: string;
}

export interface Exercise {
  name: string;
  sets: string;
  reps: string;
  rest: string;
  description: string;
}

export interface DailyWorkout {
  day: number;
  title: string;
  focus: string;
  exercises: Exercise[];
}

export interface WorkoutPlan {
  planTitle: string;
  weeklySummary: string;
  dailyWorkouts: DailyWorkout[];
}

export interface CompletedWorkoutLog {
  date: string; // ISO string
  workoutTitle: string;
}
