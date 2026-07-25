export type UserGoal =
  | 'Build Muscle'
  | 'Lose Fat'
  | 'Gain Weight'
  | 'Increase Strength'
  | 'Improve Fitness'
  | 'Improve Endurance'
  | 'Stay Healthy'
  | 'Maintain Weight'
  | 'Improve Athletic Performance'
  | 'Improve Overall Health'
  | 'Stay Active';

export interface StreakData {
  workoutStreak: number;
  nutritionStreak: number;
  hydrationStreak: number;
  sleepStreak: number;
  isStreakProtected: boolean;
  encouragementMessage: string;
}

export interface WeeklyChallenge {
  id: string;
  title: string;
  category: 'Hydration' | 'Steps' | 'Workout' | 'Sleep' | 'Nutrition';
  current: number;
  target: number;
  unit: string;
  rewardXp: number;
  completed: boolean;
  claimed: boolean;
  iconName: string;
}

export interface MilestoneBadge {
  id: string;
  title: string;
  description: string;
  category: 'Fat Loss' | 'Weight Gain' | 'Muscle Growth' | 'Strength' | 'Consistency' | 'Hydration' | 'Nutrition' | 'Recovery';
  goalType?: string;
  currentValue: number;
  targetValue: number;
  unit: string;
  badgeIcon: string;
  badgeColor: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface MonthlyReportData {
  monthName: string;
  year: number;
  startWeightKg: number;
  currentWeightKg: number;
  targetWeightKg: number;
  weightChangeKg: number;
  workoutsCompleted: number;
  workoutConsistencyPct: number;
  avgMuscleRecoveryPct: number;
  avgCaloriesPerDay: number;
  avgProteinPerDayG: number;
  bestPerformance: {
    exercise: string;
    weightKg: number;
    reps: number;
    improvement: string;
  };
  aiSummary: string;
}

export type Gender = 'Male' | 'Female' | 'Prefer not to say';

export type ActivityLevel =
  | 'Sedentary'
  | 'Lightly Active'
  | 'Moderately Active'
  | 'Very Active'
  | 'Athlete';

export type ExperienceLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export type WorkoutLocation = 'Gym' | 'Home' | 'Both';

export type EquipmentType =
  | 'Dumbbells'
  | 'Barbell'
  | 'Bench'
  | 'Cable Machine'
  | 'Pull-up Bar'
  | 'Resistance Bands'
  | 'Smith Machine'
  | 'Machines'
  | 'None';

export type MuscleGroup =
  | 'Chest'
  | 'Upper Chest'
  | 'Back'
  | 'Lats'
  | 'Traps'
  | 'Lower Back'
  | 'Shoulders'
  | 'Front Delts'
  | 'Side Delts'
  | 'Rear Delts'
  | 'Arms'
  | 'Biceps'
  | 'Triceps'
  | 'Forearms'
  | 'Core'
  | 'Abs'
  | 'Obliques'
  | 'Legs'
  | 'Quadriceps'
  | 'Hamstrings'
  | 'Calves'
  | 'Glutes'
  | 'Neck';

export type InjuryArea =
  | 'Shoulder'
  | 'Knee'
  | 'Lower Back'
  | 'Neck'
  | 'Wrist'
  | 'None';

export type DietType =
  | 'No Preference'
  | 'High Protein'
  | 'Vegetarian'
  | 'Vegan'
  | 'Keto'
  | 'Mediterranean';

export type AllergyType =
  | 'Nuts'
  | 'Dairy'
  | 'Eggs'
  | 'Seafood'
  | 'Gluten'
  | 'None';

export interface UserProfile {
  name: string;
  email: string;
  avatarUrl: string;
  goal: UserGoal;
  gender: Gender;
  age: number;
  heightCm: number;
  weightKg: number;
  targetWeightKg: number;
  activityLevel: ActivityLevel;
  experienceLevel: ExperienceLevel;
  workoutLocation: WorkoutLocation;
  equipment: EquipmentType[];
  workoutDaysPerWeek: number;
  workoutDurationMin: number;
  priorityMuscles: MuscleGroup[];
  injuries: InjuryArea[];
  diet: DietType;
  allergies: AllergyType[];
  dailyWaterTargetL: number;
  avgSleepHours: number;
  
  // Calculated AI Targets
  estimatedCalories: number;
  proteinTargetG: number;
  carbsTargetG: number;
  fatsTargetG: number;
  overallRecoveryScore: number;
  recommendedSplit: string;
  isOnboarded: boolean;
}

export type MuscleStatus =
  | 'Excellent'
  | 'Good'
  | 'Recovering'
  | 'Fatigued'
  | 'Overtrained'
  | 'Inactive';

export interface MuscleDetail {
  id: string;
  name: string;
  category: 'Chest' | 'Back' | 'Arms' | 'Shoulders' | 'Core' | 'Legs' | 'Glutes';
  status: MuscleStatus;
  recoveryPercentage: number;
  readiness: 'High' | 'Medium' | 'Low';
  fatigueLevel: 'None' | 'Mild' | 'Moderate' | 'High' | 'Severe';
  recoveryTimeHours: string;
  trainingEffect: 'Low' | 'Medium' | 'High' | 'Extreme';
  volumeKg: number;
  growthPotential: 'Low' | 'Medium' | 'High';
  proteinSynthesis: 'Baseline' | 'Active' | 'Peak';
  bloodFlow: 'Normal' | 'Elevated' | 'Maximum';
  lastWorkout: string;
  nextSuggestedWorkout: string;
  aiTip: string;
  recommendedExercises: Exercise[];
}

export interface Exercise {
  id: string;
  name: string;
  targetMuscle: MuscleGroup;
  secondaryMuscles?: MuscleGroup[];
  sets: number;
  reps: string;
  weightKg?: number;
  restSeconds: number;
  estimatedFatigue: 'Low' | 'Moderate' | 'High';
  imageUrl?: string;
  equipment?: string;
  estimatedCalories?: number;
  recoveryImpact?: 'Low' | 'Moderate' | 'High';
  muscleActivationPct?: number;
  difficultyRating?: number;
  completed?: boolean;
}

export interface WorkoutProgram {
  id: string;
  title: string;
  subtitle: string;
  focusArea: string;
  durationMin: number;
  exerciseCount: number;
  totalSets: number;
  estCaloriesBurn: number;
  readinessPercentage: number;
  exercises: Exercise[];
  musclesTargeted: MuscleGroup[];
  difficulty?: string;
  recoveryImpact?: string;
  aiRecommendation?: string;
}

export interface RecipeIngredient {
  name: string;
  amount: string;
}

export interface CommunityRecipe {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  creatorId: string;
  creatorName: string;
  creatorUsername: string;
  creatorAvatar: string;
  creatorRole: string;
  verified: boolean;
  category: string; // e.g. '🥗 High Protein', '🔥 Fat Loss Meals', '💪 Muscle Gain Meals', etc.
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG: number;
  prepTimeMin: number;
  difficulty: 'Easy' | 'Medium' | 'Advanced';
  likes: number;
  downloads: number;
  saves: number;
  rating: number;
  tags: string[];
  ingredients: RecipeIngredient[];
  cookingSteps: string[];
  micronutrients?: { name: string; amount: string }[];
  servingSize?: string;
  estCost?: string;
  isLiked?: boolean;
  isSaved?: boolean;
  isPublishedByMe?: boolean;
  isDraft?: boolean;
  reviews?: ProgramReview[];
  mealTypeRecommendation?: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
}

export interface FoodItem {
  id: string;
  name: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  time: string;
  mealType: 'Breakfast' | 'Lunch' | 'Snack' | 'Dinner';
  imageUrl?: string;
}

export interface ProgramReview {
  id: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: string;
}

export interface CommunityProgram {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  creatorId: string;
  creatorName: string;
  creatorUsername: string;
  creatorAvatar: string;
  creatorRole: string;
  verified: boolean;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  durationWeeks: number;
  workoutsPerWeek: number;
  estimatedSessionMin: number;
  estCaloriesBurn: number;
  goal: 'Muscle Building' | 'Fat Loss' | 'Strength' | 'Endurance' | 'Rehab' | 'General Fitness';
  location: 'Gym' | 'Home' | 'Both';
  category: string;
  targetMuscles: MuscleGroup[];
  equipment: EquipmentType[];
  rating: number;
  downloads: number;
  saves: number;
  likes: number;
  tags: string[];
  isLiked?: boolean;
  isSaved?: boolean;
  isPublishedByMe?: boolean;
  weeklySchedule?: { day: string; title: string; exercisesCount: number; focus: string }[];
  reviews?: ProgramReview[];
  exercises?: Exercise[];
}

export interface CreatorProfile {
  id: string;
  displayName: string;
  username: string;
  avatarUrl: string;
  coverUrl: string;
  bio: string;
  country: string;
  flagEmoji: string;
  joinDate: string;
  verified: boolean;
  roleTitle: string;
  followers: number;
  following: number;
  isFollowing?: boolean;
  programsPublished: number;
  totalDownloads: number;
  totalLikes: number;
  averageRating: number;
  workoutCompletions: number;
  communityXp: number;
  creatorLevel: string;
  primaryGoal: string;
  experienceLevel: string;
  trainingStyle: string;
  favoriteSplit: string;
  specializations: string[];
  achievements: { id: string; title: string; iconName: string; badgeColor: string; description: string }[];
  recentActivity: { id: string; text: string; timeAgo: string }[];
  socialLinks?: { instagram?: string; youtube?: string; website?: string };
}

export interface CommunityWorkout {
  id: string;
  title: string;
  creatorName: string;
  creatorAvatar: string;
  creatorRole: string;
  verified: boolean;
  likes: number;
  saves: number;
  level: string;
  durationMin: number;
  muscleFocus: string[];
  exercisesCount: number;
  tags: string[];
  isLiked?: boolean;
  isSaved?: boolean;
}

export type BodyView = 'Front' | 'Back' | 'Left' | 'Right' | '3/4' | 'Top' | '360°';
export type TimelineState = 'Before Workout' | 'After Workout' | '24h' | '48h' | '72h' | '1 Week';
