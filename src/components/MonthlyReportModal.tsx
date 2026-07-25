import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  FileText,
  TrendingUp,
  TrendingDown,
  Dumbbell,
  Flame,
  Award,
  Calendar,
  Sparkles,
  Share2,
  Activity,
  Check,
} from 'lucide-react';
import { UserProfile, MonthlyReportData } from '../types';
import { soundManager } from '../lib/soundManager';

interface MonthlyReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
}

export const MonthlyReportModal: React.FC<MonthlyReportModalProps> = ({ isOpen, onClose, profile }) => {
  if (!isOpen) return null;

  const reportData: MonthlyReportData = {
    monthName: 'July',
    year: 2026,
    startWeightKg: profile.weightKg + 2.4,
    currentWeightKg: profile.weightKg,
    targetWeightKg: profile.targetWeightKg,
    weightChangeKg: -2.4,
    workoutsCompleted: 18,
    workoutConsistencyPct: 92,
    avgMuscleRecoveryPct: 84,
    avgCaloriesPerDay: 2350,
    avgProteinPerDayG: 175,
    bestPerformance: {
      exercise: 'Barbell Bench Press',
      weightKg: 85,
      reps: 10,
      improvement: '+7.5 kg PR',
    },
    aiSummary: `Outstanding dedication during July! You completed 18 targeted workouts with a 92% consistency rate. Your muscle recovery averaged a healthy 84%, allowing optimal strength progression in your push-pull split.`,
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="glass-panel p-6 rounded-3xl border border-blue-500/40 max-w-md w-full space-y-5 bg-gradient-to-b from-slate-900 via-slate-950 to-blue-950/40 shadow-2xl relative max-h-[90vh] overflow-y-auto"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-xl bg-blue-600/20 border border-blue-500/30 text-cyan-400">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-black text-white">Monthly Progress Report</h2>
                <p className="text-[11px] text-slate-400">
                  {reportData.monthName} {reportData.year} • PhysIQ AI Executive
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                soundManager.play('button_secondary');
                onClose();
              }}
              className="p-2 rounded-full glass-pill text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Stat Overview Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-3 rounded-2xl bg-slate-900/80 border border-white/10 space-y-1">
              <div className="text-[10px] text-slate-400 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-blue-400" /> Workouts Logged
              </div>
              <div className="text-lg font-black text-white">{reportData.workoutsCompleted} Sessions</div>
              <div className="text-[10px] text-emerald-400 font-semibold">
                {reportData.workoutConsistencyPct}% Consistency Rate
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-900/80 border border-white/10 space-y-1">
              <div className="text-[10px] text-slate-400 flex items-center gap-1">
                <Activity className="w-3.5 h-3.5 text-cyan-400" /> Avg Muscle Recovery
              </div>
              <div className="text-lg font-black text-white">{reportData.avgMuscleRecoveryPct}%</div>
              <div className="text-[10px] text-cyan-300 font-semibold">Optimal Hypertrophy Zone</div>
            </div>
          </div>

          {/* Weight Journey Progress Box */}
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-white">
              <span>Weight & Body Composition</span>
              <span className="text-emerald-400 flex items-center gap-0.5">
                <TrendingDown className="w-3.5 h-3.5" /> {reportData.weightChangeKg} kg
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
              <div className="p-2 rounded-xl bg-slate-950/60 border border-white/5">
                <div className="text-[9px] text-slate-400">Month Start</div>
                <div className="font-bold text-white mt-0.5">{reportData.startWeightKg} kg</div>
              </div>
              <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
                <div className="text-[9px] text-blue-300">Current</div>
                <div className="font-bold text-cyan-400 mt-0.5">{reportData.currentWeightKg} kg</div>
              </div>
              <div className="p-2 rounded-xl bg-slate-950/60 border border-white/5">
                <div className="text-[9px] text-slate-400">Target</div>
                <div className="font-bold text-emerald-400 mt-0.5">{reportData.targetWeightKg} kg</div>
              </div>
            </div>
          </div>

          {/* Nutrition & Best Performance Box */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-3 rounded-2xl bg-slate-900/80 border border-white/10 space-y-1">
              <div className="text-[10px] text-slate-400">Daily Average Fuel</div>
              <div className="font-extrabold text-white">{reportData.avgCaloriesPerDay} kcal</div>
              <div className="text-[10px] text-emerald-400 font-semibold">{reportData.avgProteinPerDayG}g Protein/day</div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-900/80 border border-purple-500/30 space-y-1">
              <div className="text-[10px] text-purple-300 flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-purple-400" /> Best PR Highlight
              </div>
              <div className="font-extrabold text-white">{reportData.bestPerformance.exercise}</div>
              <div className="text-[10px] text-purple-300 font-semibold">
                {reportData.bestPerformance.weightKg}kg x {reportData.bestPerformance.reps} ({reportData.bestPerformance.improvement})
              </div>
            </div>
          </div>

          {/* AI Executive Coach Summary */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-900/40 via-indigo-900/40 to-purple-900/40 border border-blue-500/30 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-300">
              <Sparkles className="w-4 h-4 text-cyan-400" /> AI Coach Assessment
            </div>
            <p className="text-xs text-slate-200 leading-relaxed italic">{reportData.aiSummary}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => {
                soundManager.play('button_secondary');
                navigator.clipboard.writeText(`My July PhysIQ Fitness Report: ${reportData.workoutsCompleted} workouts completed, ${reportData.weightChangeKg}kg progress! 🔥`);
                alert('Report summary copied!');
              }}
              className="flex-1 py-3 rounded-2xl glass-panel border border-white/10 text-white font-bold text-xs hover:bg-white/10 active:scale-95 transition-all flex items-center justify-center gap-1.5"
            >
              <Share2 className="w-4 h-4" /> Export Report
            </button>
            <button
              onClick={() => {
                soundManager.play('button_primary');
                onClose();
              }}
              className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs shadow-lg hover:brightness-110 active:scale-95 transition-all"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
