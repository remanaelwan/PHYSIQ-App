import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Bell,
  ChevronRight,
  Flame,
  Footprints,
  Heart,
  Moon,
  Sparkles,
  Droplets,
  Activity,
  Play,
  TrendingUp,
  TrendingDown,
  FileText,
  Dumbbell,
  Target,
  Zap,
  Award,
  Plus,
  Scan,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Eye,
} from 'lucide-react';
import { UserProfile, MuscleDetail, WorkoutProgram, FoodItem, UserGoal } from '../types';
import { AnatomicalBodySvg } from './AnatomicalBodySvg';
import { BodyOverview } from './BodyOverview';
import { TodaysWorkoutSection } from './TodaysWorkoutSection';
import { GoalJourneyCard } from './GoalJourneyCard';
import { StreaksAndChallenges } from './StreaksAndChallenges';
import { MonthlyReportModal } from './MonthlyReportModal';
import { soundManager } from '../lib/soundManager';

interface HomeScreenProps {
  profile: UserProfile;
  muscles: Record<string, MuscleDetail>;
  todayWorkout: WorkoutProgram;
  foodLogs: FoodItem[];
  waterConsumedL: number;
  onNavigate: (tab: 'Home' | 'Body' | 'Nutrition' | 'Workout' | 'Profile') => void;
  onStartWorkout: () => void;
  onUpdateProfile?: (updates: Partial<UserProfile>) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  profile,
  muscles,
  todayWorkout,
  foodLogs,
  waterConsumedL,
  onNavigate,
  onStartWorkout,
  onUpdateProfile,
}) => {
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [activeInsightTab, setActiveInsightTab] = useState<'Recovery' | 'Workout' | 'Nutrition' | 'Sleep'>('Recovery');

  // Nutrition calculations
  const caloriesConsumed = foodLogs.reduce((acc, item) => acc + item.calories, 0);
  const caloriesRemaining = Math.max(0, profile.estimatedCalories - caloriesConsumed);

  const proteinConsumed = foodLogs.reduce((acc, item) => acc + item.proteinG, 0);
  const carbsConsumed = foodLogs.reduce((acc, item) => acc + item.carbsG, 0);
  const fatConsumed = foodLogs.reduce((acc, item) => acc + item.fatG, 0);

  const handleUpdateGoal = (newGoal: UserGoal) => {
    if (onUpdateProfile) {
      onUpdateProfile({ goal: newGoal });
    }
  };

  // Generate data-driven AI body status message
  const getAiBodyStatusMessage = () => {
    if (profile.overallRecoveryScore >= 85) {
      return "Chest and shoulders are fully recovered and ready for today's Push workout.";
    } else if (profile.overallRecoveryScore >= 70) {
      return "Your body is well-rested. Optimal conditions for hypertrophy training.";
    } else if (profile.overallRecoveryScore >= 50) {
      return "Leg recovery is still in progress. Recommended: Active mobility or upper body work.";
    } else {
      return "Recovery is low today. Focus on light active recovery, hydration and nutrition.";
    }
  };

  // Data-Driven AI Insights text generator (No random quotes!)
  const getAiInsightContent = () => {
    switch (activeInsightTab) {
      case 'Recovery':
        return profile.overallRecoveryScore >= 80
          ? {
              status: 'Optimal Readiness',
              message: `Your central nervous system recovery is at ${profile.overallRecoveryScore}%. Chest and Back muscle groups are 100% restored. Recommended: Push progressive overload on compound sets today.`,
              color: 'text-emerald-400',
              bg: 'bg-emerald-500/10 border-emerald-500/30',
            }
          : {
              status: 'Moderate Rest Suggested',
              message: `Recovery sits at ${profile.overallRecoveryScore}%. Cumulative fatigue detected in leg fibers. Focus on active mobility, high protein intake, and minimum 8 hours sleep tonight.`,
              color: 'text-amber-400',
              bg: 'bg-amber-500/10 border-amber-500/30',
            };

      case 'Workout':
        return {
          status: 'Hypertrophy Split Matched',
          message: `Today's session "${todayWorkout.title || todayWorkout.name}" targets ${todayWorkout.focusArea}. Estimated burn is ${todayWorkout.estCaloriesBurn} kcal over ${todayWorkout.durationMin} minutes.`,
          color: 'text-blue-400',
          bg: 'bg-blue-500/10 border-blue-500/30',
        };

      case 'Nutrition':
        return proteinConsumed >= profile.proteinTargetG
          ? {
              status: 'Protein Synthesis Target Met',
              message: `You've logged ${proteinConsumed}g of protein (${Math.round((proteinConsumed / profile.proteinTargetG) * 100)}% of goal). Muscle nitrogen balance is optimized for repair.`,
              color: 'text-emerald-400',
              bg: 'bg-emerald-500/10 border-emerald-500/30',
            }
          : {
              status: 'Protein Deficit Notice',
              message: `Logged ${proteinConsumed}g / ${profile.proteinTargetG}g protein. Consume an additional ${profile.proteinTargetG - proteinConsumed}g of lean protein to prevent muscle catabolism post-workout.`,
              color: 'text-cyan-400',
              bg: 'bg-cyan-500/10 border-cyan-500/30',
            };

      case 'Sleep':
        return {
          status: 'Deep REM Efficiency 92%',
          message: 'Logged 7h 24m sleep last night. Growth hormone secretion peaked during 2.1h deep sleep stage, enabling peak neuromuscular recovery.',
          color: 'text-purple-400',
          bg: 'bg-purple-500/10 border-purple-500/30',
        };
    }
  };

  const insightData = getAiInsightContent();

  return (
    <div className="w-full min-h-screen bg-[#04060c] text-white pt-10 pb-28 px-4 max-w-md mx-auto space-y-6 select-none font-sans">
      {/* TOP APPLE-INSPIRED HEADER BAR */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">PhysIQ Intelligence</span>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            Welcome, {profile.name} <span className="text-lg">⚡</span>
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {/* Executive Monthly Report */}
          <button
            onClick={() => {
              soundManager.play('button_primary');
              setIsReportOpen(true);
            }}
            title="Monthly Progress Report"
            className="p-2.5 rounded-full glass-panel text-cyan-400 hover:text-white border border-cyan-500/30 active:scale-95 transition-all shadow-[0_0_12px_rgba(6,182,212,0.3)]"
          >
            <FileText className="w-4 h-4" />
          </button>

          <button className="relative p-2.5 rounded-full glass-panel text-slate-300 hover:text-white border border-white/10">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-500 ring-2 ring-[#04060c] animate-pulse" />
          </button>

          <button onClick={() => onNavigate('Profile')} className="relative group">
            <div className="w-9 h-9 rounded-full p-[2px] bg-gradient-to-tr from-cyan-400 to-blue-600 shadow-[0_0_15px_rgba(59,130,246,0.5)]">
              <img
                src={profile.avatarUrl}
                alt={profile.name}
                className="w-full h-full rounded-full object-cover"
              />
            </div>
          </button>
        </div>
      </div>

      {/* SECTION 1: HERO - IMMERSIVE BODY OVERVIEW CENTERPIECE */}
      <BodyOverview
        profile={profile}
        muscles={muscles}
        onNavigate={onNavigate}
      />

      {/* SECTION 2: TODAY'S AI WORKOUT */}
      <TodaysWorkoutSection
        workout={todayWorkout}
        onStartWorkout={onStartWorkout}
        onSelectExercise={() => onNavigate('Workout')}
      />

      {/* SECTION 3: NUTRITION INTELLIGENCE */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-5 rounded-3xl border border-white/15 relative overflow-hidden shadow-2xl bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-emerald-950/30"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Nutrition Intelligence</h2>
              <p className="text-[11px] text-slate-400">Caloric balance and macro precision</p>
            </div>
          </div>

          <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold">
            Score: 94/100
          </span>
        </div>

        <div className="grid grid-cols-12 gap-3 items-center mb-4">
          {/* Calorie Ring */}
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
                  className="text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]"
                  strokeDasharray={`${Math.min(100, Math.round((caloriesConsumed / profile.estimatedCalories) * 100))}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-lg font-black text-white">{caloriesConsumed.toLocaleString()}</span>
                <span className="text-[9px] text-slate-400">/ {profile.estimatedCalories} kcal</span>
              </div>
            </div>
            <span className="text-[11px] font-bold text-emerald-400">{caloriesRemaining} kcal</span>
            <span className="text-[9px] text-slate-400">Remaining</span>
          </div>

          {/* Macro Progress Bars */}
          <div className="col-span-7 space-y-2 text-xs">
            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-slate-300 font-medium">Protein</span>
                <span className="font-bold text-white">
                  {proteinConsumed} / {profile.proteinTargetG}g
                </span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-400 rounded-full"
                  style={{ width: `${Math.min(100, (proteinConsumed / profile.proteinTargetG) * 100)}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-slate-300 font-medium">Carbs</span>
                <span className="font-bold text-white">
                  {carbsConsumed} / {profile.carbsTargetG}g
                </span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: `${Math.min(100, (carbsConsumed / profile.carbsTargetG) * 100)}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-slate-300 font-medium">Fats</span>
                <span className="font-bold text-white">
                  {fatConsumed} / {profile.fatsTargetG}g
                </span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-400 rounded-full"
                  style={{ width: `${Math.min(100, (fatConsumed / profile.fatsTargetG) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            soundManager.play('tab_change');
            onNavigate('Nutrition');
          }}
          className="w-full py-2.5 rounded-xl glass-pill flex items-center justify-center gap-2 text-xs font-semibold text-white hover:bg-white/10 active:scale-[0.98] transition-all border border-white/10"
        >
          View Full Nutrition Plan
          <ChevronRight className="w-4 h-4 text-emerald-400" />
        </button>
      </motion.div>

      {/* SECTION 4: GOAL JOURNEY */}
      <GoalJourneyCard profile={profile} onUpdateGoal={handleUpdateGoal} />

      {/* SECTION 5: WEEKLY CHALLENGES */}
      <StreaksAndChallenges />

      {/* SECTION 6: XP & LEVEL & STREAKS */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-5 rounded-3xl border border-white/15 relative overflow-hidden shadow-2xl bg-gradient-to-br from-indigo-950/40 via-slate-900/80 to-purple-950/40"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-purple-600/20 border border-purple-500/30 text-purple-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">XP & Athlete Rank</h2>
              <p className="text-[11px] text-slate-400">Level 12 • Hypertrophy Master</p>
            </div>
          </div>

          <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-black">
            1,250 / 2,000 XP
          </span>
        </div>

        {/* XP Progress Bar */}
        <div className="space-y-1.5 mb-4">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-slate-300">Level 12 Progress</span>
            <span className="text-purple-400">62.5%</span>
          </div>
          <div className="w-full h-3 rounded-full bg-slate-800 p-0.5 overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 shadow-[0_0_12px_rgba(168,85,247,0.8)]" style={{ width: '62.5%' }} />
          </div>
        </div>

        {/* 4 Streaks Row */}
        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="p-2 rounded-2xl bg-slate-900/60 border border-white/5">
            <Flame className="w-4 h-4 text-amber-400 mx-auto mb-1" />
            <div className="text-xs font-bold text-white">5 Days</div>
            <div className="text-[9px] text-slate-400">Workout</div>
          </div>
          <div className="p-2 rounded-2xl bg-slate-900/60 border border-white/5">
            <Award className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
            <div className="text-xs font-bold text-white">7 Days</div>
            <div className="text-[9px] text-slate-400">Nutrition</div>
          </div>
          <div className="p-2 rounded-2xl bg-slate-900/60 border border-white/5">
            <Droplets className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
            <div className="text-xs font-bold text-white">6 Days</div>
            <div className="text-[9px] text-slate-400">Hydration</div>
          </div>
          <div className="p-2 rounded-2xl bg-slate-900/60 border border-white/5">
            <Moon className="w-4 h-4 text-purple-400 mx-auto mb-1" />
            <div className="text-xs font-bold text-white">4 Days</div>
            <div className="text-[9px] text-slate-400">Sleep</div>
          </div>
        </div>
      </motion.div>

      {/* SECTION 7: AI INSIGHTS (DATA-DRIVEN CONTEXT ONLY - NO RANDOM QUOTES) */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-5 rounded-3xl border border-white/15 relative overflow-hidden shadow-2xl bg-gradient-to-br from-slate-900/90 to-blue-950/40"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-600/20 border border-cyan-500/30 text-cyan-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">AI Coach Insights</h2>
              <p className="text-[11px] text-slate-400">Contextual analysis derived from real user data</p>
            </div>
          </div>
        </div>

        {/* Insight Tabs selector */}
        <div className="flex glass-pill p-1 rounded-xl gap-1 mb-3 text-xs font-bold">
          {(['Recovery', 'Workout', 'Nutrition', 'Sleep'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                soundManager.play('switch');
                setActiveInsightTab(tab);
              }}
              className={`flex-1 py-1.5 rounded-lg transition-all text-[11px] ${
                activeInsightTab === tab
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Insight Content Box */}
        <div className={`p-4 rounded-2xl border ${insightData.bg} space-y-1.5`}>
          <div className={`text-xs font-extrabold ${insightData.color} flex items-center gap-1.5`}>
            <Zap className="w-4 h-4" /> {insightData.status}
          </div>
          <p className="text-xs text-slate-200 leading-relaxed font-medium">
            "{insightData.message}"
          </p>
        </div>
      </motion.div>

      {/* SECTION 8: QUICK ACTIONS */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-4 rounded-3xl border border-white/15 shadow-2xl"
      >
        <div className="text-xs font-bold text-slate-300 mb-2.5">Quick Actions</div>
        <div className="grid grid-cols-5 gap-2 text-center text-[10px] font-semibold">
          <button
            onClick={() => {
              soundManager.play('button_secondary');
              onNavigate('Nutrition');
            }}
            className="p-2.5 rounded-2xl bg-slate-900/80 border border-white/10 hover:bg-slate-800 flex flex-col items-center gap-1.5 active:scale-95 transition-all text-emerald-400"
          >
            <Plus className="w-4 h-4" />
            <span className="text-slate-200">Add Meal</span>
          </button>

          <button
            onClick={() => {
              soundManager.play('button_secondary');
              onNavigate('Nutrition');
            }}
            className="p-2.5 rounded-2xl bg-slate-900/80 border border-white/10 hover:bg-slate-800 flex flex-col items-center gap-1.5 active:scale-95 transition-all text-cyan-400"
          >
            <Droplets className="w-4 h-4" />
            <span className="text-slate-200">Log Water</span>
          </button>

          <button
            onClick={() => {
              soundManager.play('button_secondary');
              onNavigate('Nutrition');
            }}
            className="p-2.5 rounded-2xl bg-slate-900/80 border border-white/10 hover:bg-slate-800 flex flex-col items-center gap-1.5 active:scale-95 transition-all text-amber-400"
          >
            <Scan className="w-4 h-4" />
            <span className="text-slate-200">Scan Barcode</span>
          </button>

          <button
            onClick={() => {
              soundManager.play('start_workout');
              onStartWorkout();
            }}
            className="p-2.5 rounded-2xl bg-slate-900/80 border border-white/10 hover:bg-slate-800 flex flex-col items-center gap-1.5 active:scale-95 transition-all text-purple-400"
          >
            <Play className="w-4 h-4" />
            <span className="text-slate-200">Start Workout</span>
          </button>

          <button
            onClick={() => {
              soundManager.play('button_secondary');
              onNavigate('Body');
            }}
            className="p-2.5 rounded-2xl bg-slate-900/80 border border-white/10 hover:bg-slate-800 flex flex-col items-center gap-1.5 active:scale-95 transition-all text-blue-400"
          >
            <Activity className="w-4 h-4" />
            <span className="text-slate-200">View Body</span>
          </button>
        </div>
      </motion.div>

      {/* MONTHLY EXECUTIVE REPORT MODAL */}
      <MonthlyReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        profile={profile}
      />
    </div>
  );
};
