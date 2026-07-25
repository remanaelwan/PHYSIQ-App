import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Flame,
  FlameKindling,
  Droplets,
  Footprints,
  Moon,
  Sparkles,
  Award,
  CheckCircle2,
  ShieldCheck,
  HeartHandshake,
  Gift,
  Trophy,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { StreakData, WeeklyChallenge } from '../types';
import { soundManager } from '../lib/soundManager';

interface StreaksAndChallengesProps {
  initialStreaks?: StreakData;
  initialChallenges?: WeeklyChallenge[];
}

const DEFAULT_STREAKS: StreakData = {
  workoutStreak: 5,
  nutritionStreak: 7,
  hydrationStreak: 6,
  sleepStreak: 4,
  isStreakProtected: true,
  encouragementMessage: "You're building unstoppable momentum! Keep taking small steps every day.",
};

const DEFAULT_CHALLENGES: WeeklyChallenge[] = [
  {
    id: 'c-1',
    title: 'Drink 2L Water Daily',
    category: 'Hydration',
    current: 6,
    target: 7,
    unit: 'days',
    rewardXp: 150,
    completed: false,
    claimed: false,
    iconName: 'Droplets',
  },
  {
    id: 'c-2',
    title: 'Walk 10,000 Steps Daily',
    category: 'Steps',
    current: 5,
    target: 5,
    unit: 'days',
    rewardXp: 200,
    completed: true,
    claimed: false,
    iconName: 'Footprints',
  },
  {
    id: 'c-3',
    title: 'Complete 4 Weekly Workouts',
    category: 'Workout',
    current: 3,
    target: 4,
    unit: 'workouts',
    rewardXp: 250,
    completed: false,
    claimed: false,
    iconName: 'Flame',
  },
  {
    id: 'c-4',
    title: 'Sleep 8 Hours Nightly',
    category: 'Sleep',
    current: 5,
    target: 7,
    unit: 'nights',
    rewardXp: 150,
    completed: false,
    claimed: false,
    iconName: 'Moon',
  },
  {
    id: 'c-5',
    title: 'Hit Daily Protein Target',
    category: 'Nutrition',
    current: 7,
    target: 7,
    unit: 'days',
    rewardXp: 300,
    completed: true,
    claimed: false,
    iconName: 'Award',
  },
];

export const StreaksAndChallenges: React.FC<StreaksAndChallengesProps> = () => {
  const [streaks, setStreaks] = useState<StreakData>(DEFAULT_STREAKS);
  const [challenges, setChallenges] = useState<WeeklyChallenge[]>(DEFAULT_CHALLENGES);
  const [showEncouragementModal, setShowEncouragementModal] = useState<boolean>(false);
  const [userXp, setUserXp] = useState<number>(1250);

  // Claim Weekly Challenge Reward
  const handleClaimReward = (challengeId: string) => {
    soundManager.play('achievement');
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.7 },
    });

    setChallenges((prev) =>
      prev.map((c) => {
        if (c.id === challengeId) {
          setUserXp((xp) => xp + c.rewardXp);
          return { ...c, claimed: true };
        }
        return c;
      })
    );
  };

  // Simulate non-punishing streak restart / recovery
  const handleSimulateStreakProtection = () => {
    soundManager.play('button_secondary');
    setShowEncouragementModal(true);
  };

  return (
    <div className="space-y-4">
      {/* 1. STREAK TRACKER CARD */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-5 rounded-3xl border border-white/15 relative overflow-hidden shadow-2xl bg-gradient-to-br from-amber-950/30 via-slate-900/80 to-purple-950/30"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400">
              <Flame className="w-5 h-5 fill-amber-400/20 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Consistency Streaks
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-extrabold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Protected
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">Every day is progress toward your best self.</p>
            </div>
          </div>

          <button
            onClick={handleSimulateStreakProtection}
            title="Non-punishing Streak Encouragement"
            className="p-2 rounded-xl glass-pill text-amber-300 hover:bg-amber-500/20 active:scale-95 transition-all border border-amber-500/30 flex items-center gap-1 text-xs font-semibold"
          >
            <HeartHandshake className="w-3.5 h-3.5" /> Support
          </button>
        </div>

        {/* 4 Key Streaks Grid */}
        <div className="grid grid-cols-4 gap-2 text-center mb-3">
          <div className="p-2.5 rounded-2xl bg-slate-900/70 border border-amber-500/20 flex flex-col items-center">
            <Flame className="w-4 h-4 text-amber-400 mb-1" />
            <div className="text-sm font-black text-white">{streaks.workoutStreak} Days</div>
            <div className="text-[9px] text-slate-400 mt-0.5">Workout</div>
          </div>

          <div className="p-2.5 rounded-2xl bg-slate-900/70 border border-emerald-500/20 flex flex-col items-center">
            <Award className="w-4 h-4 text-emerald-400 mb-1" />
            <div className="text-sm font-black text-white">{streaks.nutritionStreak} Days</div>
            <div className="text-[9px] text-slate-400 mt-0.5">Nutrition</div>
          </div>

          <div className="p-2.5 rounded-2xl bg-slate-900/70 border border-cyan-500/20 flex flex-col items-center">
            <Droplets className="w-4 h-4 text-cyan-400 mb-1" />
            <div className="text-sm font-black text-white">{streaks.hydrationStreak} Days</div>
            <div className="text-[9px] text-slate-400 mt-0.5">Hydration</div>
          </div>

          <div className="p-2.5 rounded-2xl bg-slate-900/70 border border-purple-500/20 flex flex-col items-center">
            <Moon className="w-4 h-4 text-purple-400 mb-1" />
            <div className="text-sm font-black text-white">{streaks.sleepStreak} Days</div>
            <div className="text-[9px] text-slate-400 mt-0.5">Sleep</div>
          </div>
        </div>

        {/* Supportive Non-Shaming Message Footer */}
        <div className="p-2.5 rounded-2xl bg-slate-900/60 border border-white/10 text-xs text-slate-300 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="text-[11px] font-medium leading-tight">
            "Remember: Missing a single day never resets your muscle or health gains. Focus on today!"
          </span>
        </div>
      </motion.div>

      {/* 2. WEEKLY CHALLENGES CARD */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-5 rounded-3xl border border-white/15 relative overflow-hidden shadow-2xl bg-gradient-to-br from-slate-900/90 to-blue-950/40"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-400">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Weekly Challenges</h2>
              <p className="text-[11px] text-slate-400">Complete challenges to earn XP rewards</p>
            </div>
          </div>

          <div className="px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-black flex items-center gap-1">
            <Gift className="w-3.5 h-3.5" /> {userXp} XP
          </div>
        </div>

        {/* Challenges List */}
        <div className="space-y-2.5">
          {challenges.map((item) => {
            const pct = Math.min(100, Math.round((item.current / item.target) * 100));

            return (
              <div
                key={item.id}
                className="p-3 rounded-2xl bg-slate-900/70 border border-white/10 flex items-center justify-between gap-3"
              >
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      {item.title}
                    </span>
                    <span className="text-[10px] font-bold text-cyan-400">
                      {item.current} / {item.target} {item.unit}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        item.completed
                          ? 'bg-gradient-to-r from-emerald-400 to-cyan-400'
                          : 'bg-gradient-to-r from-blue-500 to-indigo-500'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                {/* Action / Claim Button */}
                <div>
                  {item.claimed ? (
                    <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Claimed
                    </span>
                  ) : item.completed ? (
                    <button
                      onClick={() => handleClaimReward(item.id)}
                      className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-[11px] shadow-[0_0_12px_rgba(245,158,11,0.6)] hover:scale-105 active:scale-95 transition-all flex items-center gap-1 animate-bounce"
                    >
                      <Gift className="w-3.5 h-3.5" /> +{item.rewardXp} XP
                    </button>
                  ) : (
                    <span className="px-2.5 py-1 rounded-xl bg-slate-800 text-slate-400 text-[10px] font-semibold">
                      +{item.rewardXp} XP
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* SUPPORT / NON-SHAMING ENCOURAGEMENT MODAL */}
      <AnimatePresence>
        {showEncouragementModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-panel p-6 rounded-3xl border border-amber-500/40 max-w-sm w-full space-y-4 text-center bg-gradient-to-b from-slate-900 via-slate-950 to-amber-950/40 shadow-2xl"
            >
              <div className="w-16 h-16 mx-auto rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.4)]">
                <HeartHandshake className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-lg font-black text-white mb-1">We've Got Your Back! 💙</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Fitness is a lifelong journey, not a single day test. Never feel guilty for taking rest or missing a session. Every sunrise brings a brand new opportunity to build momentum.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-900/80 border border-white/10 text-xs font-semibold text-emerald-400">
                ✨ Streak Protection is Active. Keep your head up and focus on today!
              </div>

              <button
                onClick={() => {
                  soundManager.play('button_primary');
                  setShowEncouragementModal(false);
                }}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs shadow-lg hover:brightness-110 active:scale-95 transition-all"
              >
                Let's Crush Today! 🚀
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
