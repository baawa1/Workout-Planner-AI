
import { GoogleGenAI, Type } from '@google/genai';
import type { WorkoutParams, WorkoutPlan } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const workoutSchema = {
  type: Type.OBJECT,
  properties: {
    planTitle: { 
      type: Type.STRING,
      description: "A catchy and motivational title for the entire workout week."
    },
    weeklySummary: {
      type: Type.STRING,
      description: "A brief, encouraging summary of the week's workout plan and its goals."
    },
    dailyWorkouts: {
      type: Type.ARRAY,
      description: "An array of daily workout objects for the number of days specified by the user.",
      items: {
        type: Type.OBJECT,
        properties: {
          day: { 
            type: Type.NUMBER,
            description: "The day number of the workout (e.g., 1, 2, 3)."
          },
          title: { 
            type: Type.STRING,
            description: "A specific title for the day's workout (e.g., 'Day 1: Upper Body Strength')."
          },
          focus: { 
            type: Type.STRING,
            description: "The main focus of the day's workout (e.g., 'Upper Body', 'Lower Body', 'Full Body', 'Cardio', 'Rest')."
          },
          exercises: {
            type: Type.ARRAY,
            description: "A list of exercises for the day. Should be empty if it's a rest day.",
            items: {
              type: Type.OBJECT,
              properties: {
                name: { 
                  type: Type.STRING,
                  description: "The name of the exercise."
                },
                sets: { 
                  type: Type.STRING,
                  description: "The number of sets to perform (e.g., '3', '3-4')."
                },
                reps: { 
                  type: Type.STRING,
                  description: "The number of repetitions or duration for the exercise (e.g., '8-12 reps', '30 seconds')."
                },
                rest: { 
                  type: Type.STRING,
                  description: "The recommended rest time between sets (e.g., '60 seconds', '90s')."
                },
                description: {
                  type: Type.STRING,
                  description: "A brief, step-by-step guide on how to perform the exercise correctly, focusing on proper form and technique. Use markdown for lists if needed."
                }
              },
              required: ["name", "sets", "reps", "rest", "description"],
            },
          },
        },
        required: ["day", "title", "focus", "exercises"],
      },
    },
  },
  required: ["planTitle", "weeklySummary", "dailyWorkouts"],
};


export const generateWorkoutPlan = async (params: WorkoutParams): Promise<WorkoutPlan> => {
  const goalMap = {
    'build-muscle': 'Build Muscle / Hypertrophy',
    'lose-fat': 'Fat Loss / Weight Management',
    'improve-endurance': 'Improve Cardiovascular Endurance',
  };

  const prompt = `
    You are a world-class certified personal trainer and fitness AI. Create a personalized, one-week workout plan based on the following user details.
    
    User Profile:
    - Main Fitness Goal: ${goalMap[params.goal]}
    - Experience Level: ${params.level}
    - Workout Frequency: ${params.daysPerWeek} days per week
    - Time per Session: Approximately ${params.duration} minutes
    - Available Equipment: ${params.equipment || 'Bodyweight only'}

    Instructions:
    1.  Design a structured plan for one week.
    2.  The number of workout days in the 'dailyWorkouts' array must exactly match the user's specified frequency (${params.daysPerWeek}).
    3.  Distribute workout and rest days intelligently throughout the week. For example, for 3 days, suggest a Mon-Wed-Fri schedule.
    4.  For each workout day, provide a clear title, a focus (e.g., 'Upper Body', 'Full Body'), and a list of appropriate exercises.
    5.  The exercises must be suitable for the user's experience level and ONLY use the equipment they have available. If equipment is 'Bodyweight only', provide effective bodyweight exercises.
    6.  For each exercise, specify the number of sets, a repetition range (e.g., '8-12 reps') or duration (e.g., '45 seconds'), the rest period between sets, AND a clear, step-by-step description of how to perform the movement with proper form.
    7.  The total duration of each workout session should align with the user's specified time per session.
    8.  Return the response in the specified JSON format.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: workoutSchema,
      },
    });

    const jsonText = response.text.trim();
    const parsedPlan: WorkoutPlan = JSON.parse(jsonText);
    
    // Simple validation
    if (!parsedPlan.planTitle || !parsedPlan.dailyWorkouts || parsedPlan.dailyWorkouts.length === 0) {
      throw new Error("AI response is missing key data. Please try again.");
    }

    return parsedPlan;

  } catch (error) {
    console.error("Error generating workout plan:", error);
    throw new Error("Failed to generate workout plan from AI. The model may have returned an invalid format.");
  }
};