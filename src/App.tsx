import React, { useState } from 'react';
import { usePhysIQStore } from './store/physiqStore';
import { SplashAuth } from './components/SplashAuth';
import { OnboardingFlow } from './components/OnboardingFlow';
import { BottomNav } from './components/BottomNav';
import { HomeScreen } from './components/HomeScreen';
import { BodyScreen } from './components/BodyScreen';
import { NutritionScreen } from './components/NutritionScreen';
import { WorkoutScreen } from './components/WorkoutScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { FoodScannerModal } from './components/FoodScannerModal';
import { ActiveWorkoutModal } from './components/ActiveWorkoutModal';
import { BodyScannerModal } from './components/BodyScannerModal';
import { FoodItem } from './types';

export default function App() {
  const {
    profile,
    updateProfile,
    muscles,
    selectedMuscleId,
    setSelectedMuscleId,
    activeBodyView,
    setActiveBodyView,
    activeTimelineState,
    setActiveTimelineState,
    todayWorkout,
    communityWorkouts,
    toggleLikeCommunityWorkout,
    toggleSaveCommunityWorkout,
    foodLogs,
    addFoodLog,
    waterConsumedL,
    addWater,
    finishWorkout,
  } = usePhysIQStore();

  // Navigation & Flow State
  const [appStage, setAppStage] = useState<'splash' | 'onboarding' | 'app'>('splash');
  const [activeTab, setActiveTab] = useState<'Home' | 'Body' | 'Nutrition' | 'Workout' | 'Profile'>('Home');

  // Modals state
  const [isFoodScannerOpen, setIsFoodScannerOpen] = useState(false);
  const [isActiveWorkoutOpen, setIsActiveWorkoutOpen] = useState(false);
  const [isBodyScannerOpen, setIsBodyScannerOpen] = useState(false);

  // Auth / Splash Handler
  const handleAuthComplete = (email?: string, isNewUser?: boolean) => {
    if (email) {
      updateProfile({ email });
    }
    setAppStage('onboarding');
  };

  // Onboarding Complete Handler
  const handleOnboardingComplete = (data: Partial<typeof profile>) => {
    updateProfile(data);
    setAppStage('app');
  };

  // Add Food Handler
  const handleAddFood = (food: Omit<FoodItem, 'id'>) => {
    addFoodLog(food);
  };

  // Quick Add Meal Manual
  const handleAddMealManual = () => {
    addFoodLog({
      name: 'Custom High-Protein Meal',
      calories: 380,
      proteinG: 32,
      carbsG: 35,
      fatG: 10,
      time: 'Just now',
      mealType: 'Snack',
      imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=300',
    });
  };

  // Render standard stages
  if (appStage === 'splash') {
    return (
      <SplashAuth
        onAuthenticate={(email, isNewUser) => handleAuthComplete(email, isNewUser)}
        onComplete={handleAuthComplete}
      />
    );
  }

  if (appStage === 'onboarding') {
    return (
      <OnboardingFlow
        initialProfile={profile}
        onComplete={handleOnboardingComplete}
        onCompleteOnboarding={handleOnboardingComplete}
      />
    );
  }

  return (
    <div className="relative min-h-screen bg-[#04060c] text-white selection:bg-blue-500 selection:text-white">
      {/* Background Liquid Ambient Blur Effects */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-80 h-80 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Tab View Renderer */}
      <main className="relative z-10">
        {activeTab === 'Home' && (
          <HomeScreen
            profile={profile}
            muscles={muscles}
            todayWorkout={todayWorkout}
            foodLogs={foodLogs}
            waterConsumedL={waterConsumedL}
            onNavigate={(tab) => setActiveTab(tab)}
            onStartWorkout={() => setIsActiveWorkoutOpen(true)}
            onUpdateProfile={(updates) => updateProfile(updates)}
          />
        )}

        {activeTab === 'Body' && (
          <BodyScreen
            gender={profile.gender}
            onGenderChange={(g) => updateProfile({ gender: g })}
            muscles={muscles}
            selectedMuscleId={selectedMuscleId}
            onSelectMuscle={(id) => setSelectedMuscleId(id)}
            activeView={activeBodyView}
            onViewChange={(view) => setActiveBodyView(view)}
            activeTimeline={activeTimelineState}
            onTimelineChange={(t) => setActiveTimelineState(t)}
            onScanBody={() => setIsBodyScannerOpen(true)}
          />
        )}

        {activeTab === 'Nutrition' && (
          <NutritionScreen
            profile={profile}
            foodLogs={foodLogs}
            waterConsumedL={waterConsumedL}
            onAddWater={(amt) => addWater(amt)}
            onOpenScanner={() => setIsFoodScannerOpen(true)}
            onAddMeal={handleAddMealManual}
            onAddFoodLog={handleAddFood}
          />
        )}

        {activeTab === 'Workout' && (
          <WorkoutScreen
            todayWorkout={todayWorkout}
            communityWorkouts={communityWorkouts}
            onStartWorkout={() => setIsActiveWorkoutOpen(true)}
            onToggleLikeCommunity={(id) => toggleLikeCommunityWorkout(id)}
            onToggleSaveCommunity={(id) => toggleSaveCommunityWorkout(id)}
          />
        )}

        {activeTab === 'Profile' && (
          <ProfileScreen
            profile={profile}
            onUpdateProfile={(updates) => updateProfile(updates)}
            onReopenOnboarding={() => setAppStage('onboarding')}
            onSignOut={() => setAppStage('splash')}
          />
        )}
      </main>

      {/* Floating 5-Tab Bottom Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={(tab) => setActiveTab(tab)} />

      {/* Interactive Feature Modals */}
      <FoodScannerModal
        isOpen={isFoodScannerOpen}
        onClose={() => setIsFoodScannerOpen(false)}
        onAddFood={handleAddFood}
      />

      <ActiveWorkoutModal
        isOpen={isActiveWorkoutOpen}
        workout={todayWorkout}
        onClose={() => setIsActiveWorkoutOpen(false)}
        onFinishWorkout={finishWorkout}
      />

      <BodyScannerModal
        isOpen={isBodyScannerOpen}
        onClose={() => setIsBodyScannerOpen(false)}
        onCompleteScan={(res) => {
          if (res?.overallRecoveryScore) {
            updateProfile({ overallRecoveryScore: res.overallRecoveryScore });
          }
        }}
      />
    </div>
  );
}
