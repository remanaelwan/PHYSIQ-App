import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Bell,
  Scan,
  Plus,
  Sparkles,
  ChevronRight,
  Droplet,
  Flame,
  CheckCircle2,
  PieChart,
  Camera,
  Utensils,
  Users,
  Compass,
} from 'lucide-react';
import { UserProfile, FoodItem, CreatorProfile, CommunityRecipe } from '../types';
import { soundManager } from '../lib/soundManager';
import { NutritionCommunity } from './NutritionCommunity';
import { CreatorProfileModal } from './CreatorProfileModal';
import { mockCreators, mockCommunityPrograms } from '../data/mockCommunityData';

interface NutritionScreenProps {
  profile: UserProfile;
  foodLogs: FoodItem[];
  waterConsumedL: number;
  onAddWater: (amountL: number) => void;
  onOpenScanner: () => void;
  onAddMeal: () => void;
  onAddFoodLog?: (food: Omit<FoodItem, 'id'>) => void;
}

export const NutritionScreen: React.FC<NutritionScreenProps> = ({
  profile,
  foodLogs,
  waterConsumedL,
  onAddWater,
  onOpenScanner,
  onAddMeal,
  onAddFoodLog,
}) => {
  const [activeMainSection, setActiveMainSection] = useState<'Tracker' | 'Community'>('Tracker');
  const [selectedCreator, setSelectedCreator] = useState<CreatorProfile | null>(null);

  const handleAddWaterWithSound = (amt: number) => {
    soundManager.play('water_added');
    onAddWater(amt);
  };

  const handleOpenScannerWithSound = () => {
    soundManager.play('barcode_scanned');
    onOpenScanner();
  };

  const handleAddMealWithSound = () => {
    soundManager.play('meal_added');
    onAddMeal();
  };

  const caloriesConsumed = foodLogs.reduce((acc, f) => acc + f.calories, 0);
  const caloriesRemaining = Math.max(0, profile.estimatedCalories - caloriesConsumed);

  const proteinG = foodLogs.reduce((acc, f) => acc + f.proteinG, 0);
  const proteinRemaining = Math.max(0, profile.proteinTargetG - proteinG);
  const carbsG = foodLogs.reduce((acc, f) => acc + f.carbsG, 0);
  const fatG = foodLogs.reduce((acc, f) => acc + f.fatG, 0);

  const handleAddRecipeToMealPlan = (recipe: CommunityRecipe, slot: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack') => {
    if (onAddFoodLog) {
      onAddFoodLog({
        name: recipe.title,
        calories: recipe.calories,
        proteinG: recipe.proteinG,
        carbsG: recipe.carbsG,
        fatG: recipe.fatG,
        time: 'Just now',
        mealType: slot,
        imageUrl: recipe.coverImage,
      });
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#04060c] text-white pt-12 pb-28 px-4 max-w-md mx-auto space-y-5 select-none">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Nutrition</h1>
          <p className="text-xs text-slate-400 font-medium">Track. Discover. Fuel your body.</p>
        </div>

        <button className="relative p-2.5 rounded-full glass-panel text-slate-300 hover:text-white border border-white/10">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
        </button>
      </div>

      {/* Main Mode Segmented Control: Tracker vs Community */}
      <div className="p-1 rounded-2xl bg-slate-900/90 border border-white/10 grid grid-cols-2 gap-1 text-xs font-black">
        <button
          onClick={() => {
            soundManager.play('button_click');
            setActiveMainSection('Tracker');
          }}
          className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 ${
            activeMainSection === 'Tracker'
              ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/20 border border-blue-400/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <PieChart className="w-4 h-4" />
          <span>Daily Tracker</span>
        </button>

        <button
          onClick={() => {
            soundManager.play('button_click');
            setActiveMainSection('Community');
          }}
          className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 ${
            activeMainSection === 'Community'
              ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/20 border border-blue-400/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Utensils className="w-4 h-4" />
          <span>Nutrition Community</span>
        </button>
      </div>

      {/* RENDER TRACKER VIEW */}
      {activeMainSection === 'Tracker' && (
        <div className="space-y-5">
          {/* SECTION 1: Calorie & Macros Glass Card */}
          <div className="glass-panel p-5 rounded-3xl border border-white/15 relative overflow-hidden shadow-2xl space-y-4">
            <div className="grid grid-cols-12 gap-3 items-center">
              {/* Calorie Radial Ring */}
              <div className="col-span-5 flex flex-col items-center text-center">
                <div className="relative w-28 h-28 flex items-center justify-center mb-1">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-slate-800"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-blue-500 drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]"
                      strokeDasharray={`${Math.min(100, Math.round((caloriesConsumed / profile.estimatedCalories) * 100))}, 100`}
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xl font-black text-white">{caloriesConsumed.toLocaleString()}</span>
                    <span className="text-[9px] text-slate-400">/ {profile.estimatedCalories} kcal</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-blue-400">{caloriesRemaining} kcal</span>
                <span className="text-[9px] text-slate-400">Remaining</span>
              </div>

              {/* Macro Progress Bars */}
              <div className="col-span-7 space-y-2.5 text-xs">
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-300 font-medium">Protein</span>
                    <span className="font-bold text-white">
                      {proteinG} / {profile.proteinTargetG}g{' '}
                      <span className="text-blue-400 font-semibold">
                        ({Math.round((proteinG / profile.proteinTargetG) * 100)}%)
                      </span>
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (proteinG / profile.proteinTargetG) * 100)}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-300 font-medium">Carbs</span>
                    <span className="font-bold text-white">
                      {carbsG} / {profile.carbsTargetG}g{' '}
                      <span className="text-emerald-400 font-semibold">
                        ({Math.round((carbsG / profile.carbsTargetG) * 100)}%)
                      </span>
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-400 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (carbsG / profile.carbsTargetG) * 100)}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-300 font-medium">Fat</span>
                    <span className="font-bold text-white">
                      {fatG} / {profile.fatsTargetG}g{' '}
                      <span className="text-amber-400 font-semibold">
                        ({Math.round((fatG / profile.fatsTargetG) * 100)}%)
                      </span>
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-400 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (fatG / profile.fatsTargetG) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Micronutrients Chips & Water Logger */}
            <div className="grid grid-cols-4 gap-2 pt-3 border-t border-white/10 text-[10px]">
              <div className="p-2 rounded-2xl bg-slate-900/60 border border-white/5 flex flex-col justify-between">
                <span className="text-slate-400">Fiber</span>
                <span className="font-bold text-white">18 / 30g</span>
                <span className="text-emerald-400 font-semibold">60%</span>
              </div>

              <div className="p-2 rounded-2xl bg-slate-900/60 border border-white/5 flex flex-col justify-between">
                <span className="text-slate-400">Sugar</span>
                <span className="font-bold text-white">24 / 50g</span>
                <span className="text-blue-400 font-semibold">48%</span>
              </div>

              <div className="p-2 rounded-2xl bg-slate-900/60 border border-white/5 flex flex-col justify-between">
                <span className="text-slate-400">Sodium</span>
                <span className="font-bold text-white">1,210mg</span>
                <span className="text-amber-400 font-semibold">52%</span>
              </div>

              {/* Interactive Water Logger Button */}
              <button
                onClick={() => handleAddWaterWithSound(0.25)}
                className="p-2 rounded-2xl bg-cyan-600/20 border border-cyan-500/30 flex flex-col justify-between hover:bg-cyan-600/30 active:scale-95 transition-all text-left group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-cyan-300 font-semibold">Water</span>
                  <Plus className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-125 transition-transform" />
                </div>
                <span className="font-bold text-white">{waterConsumedL} / {profile.dailyWaterTargetL}L</span>
                <span className="text-cyan-400 font-semibold">
                  {Math.round((waterConsumedL / profile.dailyWaterTargetL) * 100)}%
                </span>
              </button>
            </div>
          </div>

          {/* Banner link to Community */}
          <div
            onClick={() => setActiveMainSection('Community')}
            className="glass-panel p-4 rounded-3xl border border-blue-500/30 bg-gradient-to-r from-blue-900/40 via-slate-900 to-cyan-900/30 flex items-center justify-between cursor-pointer hover:border-blue-400 transition-all active:scale-[0.99]"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-blue-600/20 border border-blue-500/30 text-cyan-400 shrink-0">
                <Utensils className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-black text-white">Discover Nutrition Community</h3>
                <p className="text-[10px] text-slate-300">
                  Explore 1,000+ healthy recipes & add meals directly to your daily plan.
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-cyan-400 shrink-0" />
          </div>

          {/* SECTION 2: AI Nutrition Score Card */}
          <div className="glass-panel p-5 rounded-3xl border border-white/15 relative overflow-hidden shadow-2xl flex items-center justify-between">
            <div className="space-y-1 max-w-[220px]">
              <div className="flex items-center gap-1.5 text-xs text-slate-300">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span className="font-bold">AI Nutrition Score</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-white">85</span>
                <span className="text-xs text-slate-400">/100</span>
                <span className="px-2 py-0.5 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-400 text-[10px] font-bold">
                  Great
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                You're making great choices today! Keep going and try to hit your protein goal.
              </p>
            </div>

            {/* Dynamic Sparkline SVG Graph */}
            <div className="w-24 h-16 relative flex items-center justify-center">
              <svg className="w-full h-full" viewBox="0 0 100 50">
                <path
                  d="M 10 35 Q 30 15, 50 25 T 90 10"
                  fill="none"
                  stroke="#00d2ff"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <circle cx="90" cy="10" r="4" fill="#3b82f6" className="animate-ping" />
              </svg>
            </div>
          </div>

          {/* SECTION 3: Today's Meals */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-300">Today's Meals</h2>
              <button
                onClick={handleAddMealWithSound}
                className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Add Meal
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {foodLogs.map((meal) => (
                <div
                  key={meal.id}
                  className="glass-card p-3 rounded-2xl border border-white/10 relative overflow-hidden flex flex-col justify-between"
                >
                  <div className="relative h-24 rounded-xl overflow-hidden mb-2">
                    <img src={meal.imageUrl} alt={meal.name} className="w-full h-full object-cover" />
                    <div className="absolute top-1.5 right-1.5 p-1 rounded-full bg-emerald-500 text-white">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                      {meal.mealType} • {meal.time}
                    </span>
                    <h4 className="text-xs font-bold text-white line-clamp-1">{meal.name}</h4>
                    <div className="text-[11px] font-extrabold text-blue-400 mt-0.5">{meal.calories} kcal</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 4: Scan Food Barcode / AI Meal Photo Scanner */}
          <button
            onClick={onOpenScanner}
            className="w-full p-4 rounded-3xl glass-panel border border-blue-500/30 flex items-center justify-between hover:border-blue-500 active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(59,130,246,0.2)] text-left"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-blue-600/20 border border-blue-500/30 text-cyan-400">
                <Scan className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Scan Food Barcode</h3>
                <p className="text-[11px] text-slate-400">Scan any product or photo to auto-log macros.</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </button>

          {/* SECTION 5: Daily Insights */}
          <div className="glass-panel p-5 rounded-3xl border border-white/15 space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">Daily AI Insights</h3>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-900/60 border border-white/5">
                <Sparkles className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>You're {proteinRemaining}g short of your protein goal. An anabolic chicken bowl or casein shake is recommended.</span>
              </div>
              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-900/60 border border-white/5">
                <Droplet className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>Try to drink 0.7L more water today to support optimal muscle glycogen hydration.</span>
              </div>
              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-900/60 border border-white/5">
                <Flame className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                <span>Great job staying within your target calorie budget! 🔥</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RENDER COMMUNITY VIEW */}
      {activeMainSection === 'Community' && (
        <NutritionCommunity
          profile={profile}
          caloriesRemaining={caloriesRemaining}
          proteinRemaining={proteinRemaining}
          onAddRecipeToMealPlan={handleAddRecipeToMealPlan}
          onOpenCreatorProfile={(creator) => setSelectedCreator(creator)}
        />
      )}

      {/* CREATOR PROFILE MODAL */}
      <CreatorProfileModal
        creator={selectedCreator}
        isOpen={!!selectedCreator}
        onClose={() => setSelectedCreator(null)}
        creatorPrograms={mockCommunityPrograms.filter((p) => p.creatorId === selectedCreator?.id)}
        onSelectProgram={() => {}}
        allCreators={mockCreators}
        onSelectCreator={(c) => setSelectedCreator(c)}
      />
    </div>
  );
};
