import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Award,
  Trophy,
  Flame,
  Dumbbell,
  Sparkles,
  CheckCircle2,
  Lock,
  X,
  Share2,
  Crown,
  Heart,
  Droplets,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { MilestoneBadge, UserGoal } from '../types';
import { soundManager } from '../lib/soundManager';

interface MilestonesAndBadgesProps {
  goal?: UserGoal;
}

const DEFAULT_MILESTONES: MilestoneBadge[] = [
  {
    id: 'm-1',
    title: 'First Workout Crushed',
    description: 'Completed your very first PhysIQ session with 100% effort.',
    category: 'Consistency',
    currentValue: 1,
    targetValue: 1,
    unit: 'workout',
    badgeIcon: 'Dumbbell',
    badgeColor: 'from-blue-500 to-indigo-600',
    unlocked: true,
    unlockedAt: 'July 10, 2026',
  },
  {
    id: 'm-2',
    title: '7-Day Unstoppable Streak',
    description: 'Logged workouts and nutrition for 7 consecutive days.',
    category: 'Consistency',
    currentValue: 7,
    targetValue: 7,
    unit: 'days',
    badgeIcon: 'Flame',
    badgeColor: 'from-amber-500 to-orange-600',
    unlocked: true,
    unlockedAt: 'July 17, 2026',
  },
  {
    id: 'm-3',
    title: 'First 5kg Goal Milestone',
    description: 'Made incredible progress towards your primary target weight.',
    category: 'Fat Loss',
    currentValue: 4.2,
    targetValue: 5.0,
    unit: 'kg',
    badgeIcon: 'Trophy',
    badgeColor: 'from-cyan-500 to-blue-600',
    unlocked: false,
  },
  {
    id: 'm-4',
    title: 'Bench Press PR Champion',
    description: 'Pushed past your previous personal record on heavy compound lifts.',
    category: 'Strength',
    currentValue: 85,
    targetValue: 85,
    unit: 'kg',
    badgeIcon: 'Crown',
    badgeColor: 'from-purple-500 to-pink-600',
    unlocked: true,
    unlockedAt: 'July 22, 2026',
  },
  {
    id: 'm-5',
    title: 'Recovery Master',
    description: 'Achieved an average muscle recovery score over 85% for 2 weeks.',
    category: 'Recovery',
    currentValue: 88,
    targetValue: 85,
    unit: '%',
    badgeIcon: 'Zap',
    badgeColor: 'from-emerald-500 to-teal-600',
    unlocked: true,
    unlockedAt: 'Yesterday',
  },
  {
    id: 'm-6',
    title: '30-Day Fitness Beast',
    description: 'Maintained relentless dedication for a full month of transformation.',
    category: 'Consistency',
    currentValue: 21,
    targetValue: 30,
    unit: 'days',
    badgeIcon: 'Award',
    badgeColor: 'from-amber-400 to-yellow-600',
    unlocked: false,
  },
];

export const MilestonesAndBadges: React.FC<MilestonesAndBadgesProps> = ({ goal = 'Build Muscle' }) => {
  const [milestones, setMilestones] = useState<MilestoneBadge[]>(DEFAULT_MILESTONES);
  const [activeCelebration, setActiveCelebration] = useState<MilestoneBadge | null>(null);

  const handleOpenMilestone = (m: MilestoneBadge) => {
    soundManager.play('achievement');
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
    setActiveCelebration(m);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel p-5 rounded-3xl border border-white/15 relative overflow-hidden shadow-2xl bg-gradient-to-br from-slate-900/90 via-slate-900/80 to-purple-950/40"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Milestones & Badges</h2>
            <p className="text-[11px] text-slate-400">Unlocked badges and fitness achievements</p>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-black">
          {milestones.filter((m) => m.unlocked).length} / {milestones.length} Unlocked
        </span>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-3 gap-3">
        {milestones.map((m) => {
          return (
            <button
              key={m.id}
              onClick={() => handleOpenMilestone(m)}
              className={`p-3 rounded-2xl flex flex-col items-center text-center transition-all border relative group ${
                m.unlocked
                  ? 'bg-slate-900/80 border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.2)] hover:scale-105 hover:border-amber-400'
                  : 'bg-slate-950/60 border-white/5 opacity-60 hover:opacity-80'
              }`}
            >
              {/* Badge Icon Container */}
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white mb-2 shadow-lg bg-gradient-to-tr ${
                  m.unlocked ? m.badgeColor : 'from-slate-800 to-slate-900 text-slate-500'
                }`}
              >
                {m.unlocked ? (
                  <Trophy className="w-6 h-6 animate-pulse" />
                ) : (
                  <Lock className="w-5 h-5" />
                )}
              </div>

              {/* Title & Progress */}
              <div className="text-[11px] font-bold text-white line-clamp-1 leading-tight">{m.title}</div>
              <div className="text-[9px] font-semibold text-slate-400 mt-1">
                {m.unlocked ? (
                  <span className="text-emerald-400 flex items-center gap-0.5 justify-center">
                    <CheckCircle2 className="w-3 h-3" /> Unlocked
                  </span>
                ) : (
                  <span>
                    {m.currentValue} / {m.targetValue} {m.unit}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* ACHIEVEMENT CELEBRATION MODAL */}
      <AnimatePresence>
        {activeCelebration && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="glass-panel p-6 rounded-3xl border border-amber-500/50 max-w-sm w-full space-y-5 text-center bg-gradient-to-b from-slate-900 via-slate-950 to-amber-950/50 shadow-2xl relative"
            >
              <button
                onClick={() => setActiveCelebration(null)}
                className="absolute top-4 right-4 p-2 rounded-full glass-pill text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Glowing Badge Header */}
              <div className="pt-2">
                <div
                  className={`w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr ${
                    activeCelebration.unlocked ? activeCelebration.badgeColor : 'from-slate-700 to-slate-800'
                  } p-[2px] shadow-[0_0_30px_rgba(245,158,11,0.6)] animate-bounce`}
                >
                  <div className="w-full h-full bg-slate-950 rounded-3xl flex items-center justify-center">
                    <Trophy className="w-10 h-10 text-amber-400" />
                  </div>
                </div>

                <h3 className="text-xl font-black text-white mt-4">{activeCelebration.title}</h3>
                <p className="text-xs text-amber-300 font-semibold mt-0.5">
                  Category: {activeCelebration.category}
                </p>
              </div>

              {/* Description Box */}
              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/10 text-xs text-slate-300 leading-relaxed">
                {activeCelebration.description}
              </div>

              {/* AI Congratulations Speech */}
              <div className="p-3 rounded-2xl bg-gradient-to-r from-purple-900/40 to-blue-900/40 border border-purple-500/30 text-left flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <p className="text-[11px] text-slate-200 leading-relaxed italic">
                  "AI Coach: Phenomenal achievement! Every milestone proves your discipline is turning goals into permanent reality."
                </p>
              </div>

              {/* Share & Close Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    soundManager.play('button_secondary');
                    navigator.clipboard.writeText(`I unlocked "${activeCelebration.title}" on PhysIQ! 🔥`);
                    alert('Achievement copied to clipboard!');
                  }}
                  className="flex-1 py-3 rounded-2xl glass-pill border border-white/10 text-white font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-white/10 active:scale-95 transition-all"
                >
                  <Share2 className="w-4 h-4" /> Share
                </button>
                <button
                  onClick={() => setActiveCelebration(null)}
                  className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-xs shadow-lg hover:brightness-110 active:scale-95 transition-all"
                >
                  Awesome!
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
