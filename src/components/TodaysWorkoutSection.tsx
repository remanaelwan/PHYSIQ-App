import React from 'react';
import { motion } from 'motion/react';
import {
  Dumbbell,
  Play,
  Flame,
  Clock,
  Zap,
  Sparkles,
  Star,
  ChevronRight,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import { WorkoutProgram, Exercise } from '../types';
import { soundManager } from '../lib/soundManager';

interface TodaysWorkoutSectionProps {
  workout: WorkoutProgram;
  onStartWorkout: () => void;
  onSelectExercise?: (exercise: Exercise) => void;
}

export const TodaysWorkoutSection: React.FC<TodaysWorkoutSectionProps> = ({
  workout,
  onStartWorkout,
  onSelectExercise,
}) => {
  const exercises = workout.exercises || [];

  return (
    <div className="space-y-5">
      {/* 1. HERO WORKOUT CARD */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-[32px] overflow-hidden border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)] group"
      >
        {/* Background Exercise Image with Dark Gradient Overlays */}
        <div className="absolute inset-0 bg-slate-950">
          <img
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=1000"
            alt="Push Day Workout"
            className="w-full h-full object-cover object-center scale-105 group-hover:scale-100 transition-transform duration-700 opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-transparent" />
        </div>

        {/* Hero Content Layer */}
        <div className="relative p-6 z-10 space-y-4">
          {/* Top Row Badges */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 backdrop-blur-md">
                <Dumbbell className="w-3.5 h-3.5 text-cyan-400" />
                Today's Workout
              </span>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold flex items-center gap-1 backdrop-blur-md">
              <ShieldCheck className="w-3.5 h-3.5" /> High Readiness
            </span>
          </div>

          {/* Title & Muscle Focus */}
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight drop-shadow-md">
              {workout.title || 'Push Day'}
            </h2>
            <p className="text-xs font-semibold text-cyan-300/90 mt-0.5 tracking-wide">
              {workout.musclesTargeted?.join(' • ') || 'Chest • Shoulders • Triceps'}
            </p>
          </div>

          {/* 4 Metrics Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
            <div className="p-2.5 rounded-2xl bg-slate-900/80 border border-white/10 backdrop-blur-md">
              <div className="text-[10px] font-medium text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3 text-cyan-400" />
                Est. Duration
              </div>
              <div className="text-sm font-black text-white mt-0.5">
                {workout.durationMin || 65} min
              </div>
            </div>

            <div className="p-2.5 rounded-2xl bg-slate-900/80 border border-white/10 backdrop-blur-md">
              <div className="text-[10px] font-medium text-slate-400 flex items-center gap-1">
                <Zap className="w-3 h-3 text-purple-400" />
                Difficulty
              </div>
              <div className="text-sm font-black text-white mt-0.5">
                {workout.difficulty || 'Intermediate'}
              </div>
            </div>

            <div className="p-2.5 rounded-2xl bg-slate-900/80 border border-white/10 backdrop-blur-md">
              <div className="text-[10px] font-medium text-slate-400 flex items-center gap-1">
                <Flame className="w-3 h-3 text-amber-400" />
                Est. Calories
              </div>
              <div className="text-sm font-black text-amber-300 mt-0.5">
                {workout.estCaloriesBurn || 520} kcal
              </div>
            </div>

            <div className="p-2.5 rounded-2xl bg-slate-900/80 border border-white/10 backdrop-blur-md">
              <div className="text-[10px] font-medium text-slate-400 flex items-center gap-1">
                <RotateCcw className="w-3 h-3 text-emerald-400" />
                Recovery Impact
              </div>
              <div className="text-sm font-black text-emerald-400 mt-0.5">
                {workout.recoveryImpact || 'Low'}
              </div>
            </div>
          </div>

          {/* AI Recommendation Quote inside Hero */}
          <div className="p-3 rounded-2xl bg-slate-900/90 border border-cyan-500/30 backdrop-blur-md flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-200 font-medium leading-relaxed">
              <span className="font-bold text-cyan-300">AI Insight: </span>
              "{workout.aiRecommendation || "Your chest and shoulders are fully recovered and ready for today's session."}"
            </div>
          </div>
        </div>
      </motion.div>

      {/* 2. EXERCISE PREVIEW (Horizontal Swipeable List) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div>
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
              Exercise Preview
              <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-cyan-300 text-[10px] font-bold border border-blue-500/30">
                {exercises.length} Exercises
              </span>
            </h3>
          </div>
          <span className="text-[10px] font-medium text-slate-400">Swipe to view →</span>
        </div>

        {/* Scrollable Container */}
        <div className="flex gap-3.5 overflow-x-auto snap-x scrollbar-none pb-2 pt-1 -mx-4 px-4">
          {exercises.map((ex, idx) => (
            <motion.div
              key={ex.id || idx}
              whileHover={{ y: -4 }}
              onClick={() => onSelectExercise && onSelectExercise(ex)}
              className="w-72 shrink-0 snap-start rounded-2xl glass-panel bg-slate-900/80 border border-white/10 hover:border-cyan-500/40 transition-all overflow-hidden cursor-pointer group shadow-lg flex flex-col justify-between"
            >
              {/* Exercise Image Container */}
              <div className="relative h-44 w-full overflow-hidden bg-slate-950">
                <img
                  src={ex.imageUrl || 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=600'}
                  alt={ex.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                {/* Target Muscle & Equipment Pill */}
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-md bg-slate-950/80 border border-white/20 text-white text-[10px] font-bold backdrop-blur-md">
                    {ex.targetMuscle}
                  </span>
                  {ex.equipment && (
                    <span className="px-2 py-0.5 rounded-md bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-[10px] font-semibold backdrop-blur-md">
                      {ex.equipment}
                    </span>
                  )}
                </div>

                {/* Muscle Activation % Badge */}
                <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-emerald-500/90 text-slate-950 text-[10px] font-black shadow-md flex items-center gap-1">
                  <Zap className="w-2.5 h-2.5 fill-slate-950" />
                  {ex.muscleActivationPct || 92}% Activation
                </div>

                {/* Bottom Overlay Info */}
                <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-xs">
                  <span className="font-extrabold text-white text-sm tracking-tight drop-shadow">
                    {ex.name}
                  </span>
                </div>
              </div>

              {/* Card Body Details */}
              <div className="p-3.5 space-y-2.5 text-xs">
                {/* Sets x Reps & Rest Time */}
                <div className="flex items-center justify-between bg-slate-950/60 p-2 rounded-xl border border-white/5">
                  <div className="flex items-center gap-1.5 font-bold text-cyan-300">
                    <Dumbbell className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{ex.sets} × {ex.reps}</span>
                  </div>
                  <div className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {ex.restSeconds}s Rest
                  </div>
                </div>

                {/* Difficulty Rating & Calories */}
                <div className="flex items-center justify-between text-[11px] text-slate-300">
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-slate-400 mr-1">Difficulty:</span>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < (ex.difficultyRating || 4)
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-700'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-bold text-amber-300">
                    ~{ex.estimatedCalories || 100} kcal
                  </span>
                </div>

                {/* Recovery Impact Pill */}
                <div className="flex items-center justify-between text-[10px] pt-1 border-t border-white/5 text-slate-400">
                  <span>Recovery Impact: <strong className="text-emerald-400">{ex.recoveryImpact || 'Low'}</strong></span>
                  <ChevronRight className="w-3.5 h-3.5 text-cyan-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 3. WORKOUT PROGRESS CARD */}
      <div className="glass-panel p-4 rounded-2xl border border-white/10 bg-slate-900/80 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            Workout Overview & Targets
          </h4>
          <span className="text-[10px] font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
            0% Completed
          </span>
        </div>

        <div className="flex items-center gap-4">
          {/* Progress Ring */}
          <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-800"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-cyan-400"
                strokeDasharray="0, 100"
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xs font-black text-white">0%</span>
            </div>
          </div>

          {/* Stats Breakdown Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 flex-1 text-center">
            <div className="p-2 rounded-xl bg-slate-950/60 border border-white/5">
              <div className="text-[9px] text-slate-400">Exercises</div>
              <div className="text-xs font-extrabold text-white mt-0.5">{exercises.length}</div>
            </div>
            <div className="p-2 rounded-xl bg-slate-950/60 border border-white/5">
              <div className="text-[9px] text-slate-400">Est. Time</div>
              <div className="text-xs font-extrabold text-white mt-0.5">{workout.durationMin || 65} min</div>
            </div>
            <div className="p-2 rounded-xl bg-slate-950/60 border border-white/5">
              <div className="text-[9px] text-slate-400">Est. Calories</div>
              <div className="text-xs font-extrabold text-amber-400 mt-0.5">{workout.estCaloriesBurn || 520} kcal</div>
            </div>
            <div className="p-2 rounded-xl bg-slate-950/60 border border-white/5 col-span-2 sm:col-span-1">
              <div className="text-[9px] text-slate-400">Target Muscles</div>
              <div className="text-[10px] font-bold text-cyan-300 mt-0.5 truncate">Chest, Shoulders, Triceps</div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. AI SUMMARY RECOMMENDATION */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-950/60 via-purple-950/40 to-slate-900/80 border border-cyan-500/20 backdrop-blur-md flex items-center gap-3">
        <div className="p-2 rounded-xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 shrink-0">
          <Sparkles className="w-4 h-4 text-cyan-400" />
        </div>
        <p className="text-xs text-slate-300 font-medium leading-normal">
          "Based on your recovery and nutrition, today's <strong className="text-cyan-300">Push workout</strong> is optimal for strength progression."
        </p>
      </div>

      {/* 5. LARGE ANIMATED START BUTTON */}
      <motion.button
        whileHover={{ scale: 1.015 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => {
          soundManager.play('start_workout');
          onStartWorkout();
        }}
        className="w-full h-14 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white font-black text-base shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:shadow-[0_0_40px_rgba(6,182,212,0.6)] border border-cyan-300/40 flex items-center justify-center gap-3 transition-all relative overflow-hidden group"
      >
        {/* Glowing pulse inside button */}
        <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
        <div className="p-2 rounded-full bg-white/20 border border-white/30 backdrop-blur-md">
          <Play className="w-4 h-4 fill-white text-white ml-0.5" />
        </div>
        <span className="tracking-wide">Start Workout</span>
      </motion.button>
    </div>
  );
};
