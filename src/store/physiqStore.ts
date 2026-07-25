import { useState, useEffect } from 'react';
import {
  UserProfile,
  MuscleDetail,
  WorkoutProgram,
  FoodItem,
  CommunityWorkout,
  BodyView,
  TimelineState,
  Exercise,
} from '../types';
import {
  initialUserProfile,
  initialMuscles,
  defaultTodayWorkout,
  initialFoodLogs,
  initialCommunityWorkouts,
} from '../data/mockData';

const USER_PROFILE_KEY = 'physiq_user_profile_v1';
const MUSCLES_KEY = 'physiq_muscles_v1';
const FOODS_KEY = 'physiq_foods_v1';
const WATER_KEY = 'physiq_water_consumed_v1';
const COMMUNITY_KEY = 'physiq_community_v1';

export function usePhysIQStore() {
  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(USER_PROFILE_KEY);
      return saved ? JSON.parse(saved) : initialUserProfile;
    } catch {
      return initialUserProfile;
    }
  });

  const [muscles, setMuscles] = useState<Record<string, MuscleDetail>>(() => {
    try {
      const saved = localStorage.getItem(MUSCLES_KEY);
      return saved ? JSON.parse(saved) : initialMuscles;
    } catch {
      return initialMuscles;
    }
  });

  const [foodLogs, setFoodLogs] = useState<FoodItem[]>(() => {
    try {
      const saved = localStorage.getItem(FOODS_KEY);
      return saved ? JSON.parse(saved) : initialFoodLogs;
    } catch {
      return initialFoodLogs;
    }
  });

  const [waterConsumedL, setWaterConsumedL] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(WATER_KEY);
      return saved ? parseFloat(saved) : 2.1;
    } catch {
      return 2.1;
    }
  });

  const [communityWorkouts, setCommunityWorkouts] = useState<CommunityWorkout[]>(() => {
    try {
      const saved = localStorage.getItem(COMMUNITY_KEY);
      return saved ? JSON.parse(saved) : initialCommunityWorkouts;
    } catch {
      return initialCommunityWorkouts;
    }
  });

  const [activeTab, setActiveTab] = useState<'Home' | 'Body' | 'Nutrition' | 'Workout' | 'Profile'>('Home');
  const [activeBodyView, setActiveBodyView] = useState<BodyView>('Front');
  const [activeTimelineState, setActiveTimelineState] = useState<TimelineState>('After Workout');
  const [selectedMuscleId, setSelectedMuscleId] = useState<string | null>(null);
  const [todayWorkout, setTodayWorkout] = useState<WorkoutProgram>(defaultTodayWorkout);
  const [isWorkoutActive, setIsWorkoutActive] = useState<boolean>(false);
  const [isScannerOpen, setIsScannerOpen] = useState<boolean>(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
    } catch (e) {
      console.error(e);
    }
  }, [profile]);

  useEffect(() => {
    try {
      localStorage.setItem(MUSCLES_KEY, JSON.stringify(muscles));
    } catch (e) {
      console.error(e);
    }
  }, [muscles]);

  useEffect(() => {
    try {
      localStorage.setItem(FOODS_KEY, JSON.stringify(foodLogs));
    } catch (e) {
      console.error(e);
    }
  }, [foodLogs]);

  useEffect(() => {
    try {
      localStorage.setItem(WATER_KEY, waterConsumedL.toString());
    } catch (e) {
      console.error(e);
    }
  }, [waterConsumedL]);

  useEffect(() => {
    try {
      localStorage.setItem(COMMUNITY_KEY, JSON.stringify(communityWorkouts));
    } catch (e) {
      console.error(e);
    }
  }, [communityWorkouts]);

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...updates }));
  };

  const updateMuscleStatus = (id: string, updates: Partial<MuscleDetail>) => {
    setMuscles((prev) => {
      const current = prev[id];
      if (!current) return prev;
      return {
        ...prev,
        [id]: { ...current, ...updates },
      };
    });
  };

  const addFoodLog = (food: Omit<FoodItem, 'id'>) => {
    const newItem: FoodItem = {
      ...food,
      id: `food-${Date.now()}`,
    };
    setFoodLogs((prev) => [newItem, ...prev]);

    // Consuming food boosts recovery!
    if (food.proteinG >= 20) {
      setMuscles((prev) => {
        const next = { ...prev };
        Object.keys(next).forEach((key) => {
          if (next[key].recoveryPercentage < 95) {
            next[key] = {
              ...next[key],
              recoveryPercentage: Math.min(100, next[key].recoveryPercentage + 3),
            };
          }
        });
        return next;
      });
    }
  };

  const addWater = (amountL: number) => {
    setWaterConsumedL((prev) => Math.min(6.0, parseFloat((prev + amountL).toFixed(1))));
  };

  const completeExercise = (exerciseId: string) => {
    setTodayWorkout((prev) => {
      const updatedExercises = prev.exercises.map((ex) =>
        ex.id === exerciseId ? { ...ex, completed: !ex.completed } : ex
      );
      return { ...prev, exercises: updatedExercises };
    });
  };

  const toggleLikeCommunityWorkout = (id: string) => {
    setCommunityWorkouts((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              isLiked: !item.isLiked,
              likes: item.isLiked ? item.likes - 1 : item.likes + 1,
            }
          : item
      )
    );
  };

  const toggleSaveCommunityWorkout = (id: string) => {
    setCommunityWorkouts((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              isSaved: !item.isSaved,
              saves: item.isSaved ? item.saves - 1 : item.saves + 1,
            }
          : item
      )
    );
  };

  const finishWorkout = () => {
    setIsWorkoutActive(false);
    // Muscle fatigue applies to worked muscles
    setMuscles((prev) => {
      const next = { ...prev };
      next['chest'] = { ...next['chest'], status: 'Fatigued', recoveryPercentage: 42, lastWorkout: 'Just Now' };
      next['shoulders'] = { ...next['shoulders'], status: 'Fatigued', recoveryPercentage: 48, lastWorkout: 'Just Now' };
      next['triceps'] = { ...next['triceps'], status: 'Fatigued', recoveryPercentage: 38, lastWorkout: 'Just Now' };
      return next;
    });
  };

  return {
    profile,
    updateProfile,
    muscles,
    updateMuscleStatus,
    foodLogs,
    addFoodLog,
    waterConsumedL,
    addWater,
    communityWorkouts,
    toggleLikeCommunityWorkout,
    toggleSaveCommunityWorkout,
    activeTab,
    setActiveTab,
    activeBodyView,
    setActiveBodyView,
    activeTimelineState,
    setActiveTimelineState,
    selectedMuscleId,
    setSelectedMuscleId,
    todayWorkout,
    completeExercise,
    isWorkoutActive,
    setIsWorkoutActive,
    finishWorkout,
    isScannerOpen,
    setIsScannerOpen,
  };
}
