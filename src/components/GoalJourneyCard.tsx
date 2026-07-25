import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Flame,
  Dumbbell,
  TrendingUp,
  TrendingDown,
  Target,
  Calendar,
  Sparkles,
  Award,
  Zap,
  Activity,
  Heart,
  Scale,
  Ruler,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import { UserProfile, UserGoal } from '../types';
import { soundManager } from '../lib/soundManager';

interface GoalJourneyCardProps {
  profile: UserProfile;
  onUpdateGoal?: (goal: UserGoal) => void;
}

export const GoalJourneyCard: React.FC<GoalJourneyCardProps> = ({ profile, onUpdateGoal }) => {
  const [showGoalSelector, setShowGoalSelector] = useState(false);

  const goal = profile.goal || 'Build Muscle';

  // Helper calculations for Fat Loss
  const currentWeight = profile.weightKg || 76.5;
  const targetWeight = profile.targetWeightKg || 80.0;

  const handleSelectGoal = (newGoal: UserGoal) => {
    soundManager.play('switch');
    if (onUpdateGoal) {
      onUpdateGoal(newGoal);
    }
    setShowGoalSelector(false);
  };

  // Render Goal-Specific Content
  const renderGoalDetails = () => {
    switch (goal) {
      case 'Lose Fat': {
        const startWeight = currentWeight + 4.2;
        const weightLost = parseFloat((startWeight - currentWeight).toFixed(1));
        const totalToLose = Math.max(0.1, startWeight - targetWeight);
        const remainingWeight = Math.max(0, parseFloat((currentWeight - targetWeight).toFixed(1)));
        const progressPct = Math.min(100, Math.round((weightLost / totalToLose) * 100));

        return (
          <div className="space-y-4">
            {/* Header / Subtitle */}
            <div className="flex items-center justify-between">
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-[10px] font-bold uppercase tracking-wider">
                  🔥 Fat Loss Journey
                </span>
                <p className="text-[11px] text-slate-400 mt-1">
                  Targeting sustainable fat reduction while preserving lean muscle mass.
                </p>
              </div>
            </div>

            {/* Weight Timeline Stat Grid */}
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="p-2 rounded-2xl bg-slate-900/60 border border-white/5">
                <div className="text-[10px] text-slate-400">Current</div>
                <div className="text-sm font-black text-white mt-0.5">{currentWeight} kg</div>
              </div>
              <div className="p-2 rounded-2xl bg-cyan-500/10 border border-cyan-500/20">
                <div className="text-[10px] text-cyan-300">Lost</div>
                <div className="text-sm font-black text-cyan-400 mt-0.5 flex items-center justify-center gap-0.5">
                  <TrendingDown className="w-3.5 h-3.5" /> -{weightLost} kg
                </div>
              </div>
              <div className="p-2 rounded-2xl bg-slate-900/60 border border-white/5">
                <div className="text-[10px] text-slate-400">Remaining</div>
                <div className="text-sm font-black text-amber-400 mt-0.5">{remainingWeight} kg</div>
              </div>
              <div className="p-2 rounded-2xl bg-slate-900/60 border border-white/5">
                <div className="text-[10px] text-slate-400">Target</div>
                <div className="text-sm font-black text-emerald-400 mt-0.5">{targetWeight} kg</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div>
              <div className="flex justify-between items-center text-xs font-semibold mb-1.5">
                <span className="text-slate-300">Fat Loss Goal Progress</span>
                <span className="text-cyan-400 font-bold">{progressPct}%</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-800 p-0.5 overflow-hidden relative">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPct}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-400 shadow-[0_0_12px_rgba(6,182,212,0.8)]"
                />
              </div>
            </div>

            {/* Estimated Completion & AI Tip */}
            <div className="p-3 rounded-2xl bg-slate-900/80 border border-white/10 flex items-center gap-3">
              <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
                <Calendar className="w-4 h-4" />
              </div>
              <div className="flex-1 text-xs">
                <div className="font-bold text-white">Estimated Target Date: Oct 18, 2026</div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Rate: ~0.6 kg/week • High calorie deficit compliance
                </div>
              </div>
            </div>

            {/* Positive AI Coach Encouragement */}
            <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/20 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <p className="text-xs text-slate-200 leading-relaxed italic">
                "You're already {weightLost} kg closer to your healthiest self! Consistency on your deficit and hydration will keep your metabolism humming."
              </p>
            </div>
          </div>
        );
      }

      case 'Gain Weight': {
        const startWeight = currentWeight - 2.1;
        const weightGained = parseFloat((currentWeight - startWeight).toFixed(1));
        const totalToGain = Math.max(0.1, targetWeight - startWeight);
        const remainingWeight = Math.max(0, parseFloat((targetWeight - currentWeight).toFixed(1)));
        const progressPct = Math.min(100, Math.round((weightGained / totalToGain) * 100));

        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[10px] font-bold uppercase tracking-wider">
                  📈 Healthy Weight Gain Journey
                </span>
                <p className="text-[11px] text-slate-400 mt-1">
                  Building lean muscle mass with a clean caloric surplus and high protein.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="p-2 rounded-2xl bg-slate-900/60 border border-white/5">
                <div className="text-[10px] text-slate-400">Current</div>
                <div className="text-sm font-black text-white mt-0.5">{currentWeight} kg</div>
              </div>
              <div className="p-2 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                <div className="text-[10px] text-amber-300">Gained</div>
                <div className="text-sm font-black text-amber-400 mt-0.5 flex items-center justify-center gap-0.5">
                  <TrendingUp className="w-3.5 h-3.5" /> +{weightGained} kg
                </div>
              </div>
              <div className="p-2 rounded-2xl bg-slate-900/60 border border-white/5">
                <div className="text-[10px] text-slate-400">Remaining</div>
                <div className="text-sm font-black text-cyan-400 mt-0.5">{remainingWeight} kg</div>
              </div>
              <div className="p-2 rounded-2xl bg-slate-900/60 border border-white/5">
                <div className="text-[10px] text-slate-400">Target</div>
                <div className="text-sm font-black text-emerald-400 mt-0.5">{targetWeight} kg</div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center text-xs font-semibold mb-1.5">
                <span className="text-slate-300">Clean Mass Progress</span>
                <span className="text-amber-400 font-bold">{progressPct}%</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-800 p-0.5 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPct}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="h-full rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-emerald-400 shadow-[0_0_12px_rgba(245,158,11,0.8)]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-2xl bg-slate-900/60 border border-white/5 flex items-center justify-between">
                <span className="text-slate-400">Daily Surplus</span>
                <span className="font-bold text-amber-400">+350 kcal</span>
              </div>
              <div className="p-2.5 rounded-2xl bg-slate-900/60 border border-white/5 flex items-center justify-between">
                <span className="text-slate-400">Protein Target</span>
                <span className="font-bold text-emerald-400">{profile.proteinTargetG} g/day</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-900/30 to-purple-900/30 border border-amber-500/20 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <p className="text-xs text-slate-200 leading-relaxed italic">
                "Excellent progress! Your daily calorie surplus is helping you build quality mass. Stay consistent with your heavy lifts."
              </p>
            </div>
          </div>
        );
      }

      case 'Build Muscle':
      case 'Increase Strength': {
        const measurements = [
          { name: 'Chest', size: '104 cm', change: '+2 cm' },
          { name: 'Back', size: '112 cm', change: '+3 cm' },
          { name: 'Arms', size: '39 cm', change: '+1.5 cm' },
          { name: 'Shoulders', size: '122 cm', change: '+2 cm' },
          { name: 'Legs', size: '61 cm', change: '+2.5 cm' },
          { name: 'Core', size: '82 cm', change: '-1 cm' },
        ];

        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-[10px] font-bold uppercase tracking-wider">
                  💪 Hypertrophy & Strength Journey
                </span>
                <p className="text-[11px] text-slate-400 mt-1">
                  Progressive overload, muscle fiber hypertrophy, and structural power.
                </p>
              </div>
            </div>

            {/* Muscle Readiness & Growth Progress */}
            <div className="p-3 rounded-2xl bg-slate-900/80 border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
                  <Dumbbell className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Hypertrophy Index: 88%</div>
                  <div className="text-[10px] text-slate-400">Chest & Back fully recovered for overload</div>
                </div>
              </div>
              <span className="text-xs font-black text-emerald-400">+4.2% Growth</span>
            </div>

            {/* Body Measurements Grid */}
            <div>
              <div className="text-xs font-bold text-slate-300 mb-2 flex items-center justify-between">
                <span>Body Measurements</span>
                <span className="text-[10px] text-slate-400">Last 30 Days</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {measurements.map((m) => (
                  <div key={m.name} className="p-2 rounded-2xl bg-slate-900/60 border border-white/5 text-center">
                    <div className="text-[10px] text-slate-400">{m.name}</div>
                    <div className="text-xs font-bold text-white mt-0.5">{m.size}</div>
                    <div className="text-[9px] font-semibold text-emerald-400">{m.change}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-500/20 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <p className="text-xs text-slate-200 leading-relaxed italic">
                "Your chest & back recovery is complete! Today is a perfect day to push progressive overload on your compound lifts."
              </p>
            </div>
          </div>
        );
      }

      default: {
        // Fitness / Endurance / Health
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold uppercase tracking-wider">
                  🌿 Health & Fitness Journey
                </span>
                <p className="text-[11px] text-slate-400 mt-1">
                  Optimizing cardiovascular endurance, daily vitality, and long-term stamina.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2.5 rounded-2xl bg-slate-900/60 border border-white/5">
                <Heart className="w-4 h-4 text-rose-400 mx-auto mb-1" />
                <div className="text-xs font-black text-white">62 bpm</div>
                <div className="text-[9px] text-slate-400">Resting HR</div>
              </div>
              <div className="p-2.5 rounded-2xl bg-slate-900/60 border border-white/5">
                <Zap className="w-4 h-4 text-amber-400 mx-auto mb-1" />
                <div className="text-xs font-black text-white">94/100</div>
                <div className="text-[9px] text-slate-400">Vitality Index</div>
              </div>
              <div className="p-2.5 rounded-2xl bg-slate-900/60 border border-white/5">
                <Activity className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
                <div className="text-xs font-black text-white">92%</div>
                <div className="text-[9px] text-slate-400">Consistency</div>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-900/30 to-teal-900/30 border border-emerald-500/20 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <p className="text-xs text-slate-200 leading-relaxed italic">
                "Small daily habits compound into massive long-term vitality! You're building a healthier, stronger body every single day."
              </p>
            </div>
          </div>
        );
      }
    }
  };

  const allGoals: UserGoal[] = [
    'Lose Fat',
    'Build Muscle',
    'Gain Weight',
    'Increase Strength',
    'Improve Fitness',
    'Improve Endurance',
    'Stay Healthy',
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel p-5 rounded-3xl border border-white/15 relative overflow-hidden shadow-2xl bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-indigo-950/40"
    >
      {/* Top Header Row with Change Goal Trigger */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              Goal Journey: <span className="text-cyan-400">{goal}</span>
            </h2>
            <p className="text-[11px] text-slate-400">Tailored AI analytics & tracking</p>
          </div>
        </div>

        <button
          onClick={() => setShowGoalSelector(!showGoalSelector)}
          className="px-3 py-1.5 rounded-xl glass-pill text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-all border border-white/10 flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5 text-blue-400" />
          Switch Goal
        </button>
      </div>

      {/* Goal Selector Dropdown Modal if active */}
      {showGoalSelector && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-4 p-3 rounded-2xl bg-slate-950 border border-blue-500/30 space-y-2"
        >
          <div className="text-xs font-bold text-slate-300 mb-1">Select Your Primary Goal:</div>
          <div className="grid grid-cols-2 gap-1.5">
            {allGoals.map((g) => (
              <button
                key={g}
                onClick={() => handleSelectGoal(g)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold text-left transition-all border ${
                  goal === g
                    ? 'bg-blue-600 text-white border-blue-400 shadow-md'
                    : 'bg-slate-900 text-slate-300 border-white/5 hover:bg-slate-800'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Goal Specific Rendered Journey */}
      {renderGoalDetails()}
    </motion.div>
  );
};
