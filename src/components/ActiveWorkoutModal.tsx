import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, Timer, Play, Pause, ChevronRight, ChevronLeft, Flame, Sparkles, Trophy } from 'lucide-react';
import { WorkoutProgram } from '../types';
import { soundManager } from '../lib/soundManager';

interface ActiveWorkoutModalProps {
  isOpen: boolean;
  workout: WorkoutProgram;
  onClose: () => void;
  onFinishWorkout: () => void;
}

export const ActiveWorkoutModal: React.FC<ActiveWorkoutModalProps> = ({
  isOpen,
  workout,
  onClose,
  onFinishWorkout,
}) => {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [completedSets, setCompletedSets] = useState<Record<string, boolean[]>>({});
  const [workoutElapsedSeconds, setWorkoutElapsedSeconds] = useState(0);
  const [restTimerSeconds, setRestTimerSeconds] = useState<number | null>(null);
  const [isResting, setIsResting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const currentExercise = workout.exercises[currentExerciseIndex] || workout.exercises[0];

  // Main workout duration timer
  useEffect(() => {
    if (!isOpen || isCompleted) return;
    const interval = setInterval(() => {
      setWorkoutElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, isCompleted]);

  // Rest countdown timer
  useEffect(() => {
    if (restTimerSeconds === 0) {
      soundManager.play('rest_complete');
      setIsResting(false);
      setRestTimerSeconds(null);
      return;
    }
    if (restTimerSeconds === null || restTimerSeconds < 0) {
      setIsResting(false);
      return;
    }
    const timer = setInterval(() => {
      setRestTimerSeconds((prev) => (prev !== null && prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [restTimerSeconds]);

  if (!isOpen) return null;

  const toggleSet = (exId: string, setIdx: number) => {
    const sets = completedSets[exId] || new Array(currentExercise.sets).fill(false);
    const updated = [...sets];
    updated[setIdx] = !updated[setIdx];

    setCompletedSets({ ...completedSets, [exId]: updated });

    // Trigger rest timer if checked set
    if (updated[setIdx]) {
      soundManager.play('exercise_completed');
      soundManager.play('rest_timer_start');
      setRestTimerSeconds(currentExercise.restSeconds);
      setIsResting(true);
    } else {
      soundManager.play('button_secondary');
    }
  };

  const handleFinish = () => {
    soundManager.play('finish_workout');
    setIsCompleted(true);
    setTimeout(() => {
      onFinishWorkout();
      setIsCompleted(false);
      onClose();
    }, 2500);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="fixed inset-0 z-50 bg-[#04060c] text-white flex flex-col justify-between p-5 select-none max-w-md mx-auto"
      >
        {isCompleted ? (
          /* Celebratory Finish Screen */
          <div className="my-auto text-center space-y-4 animate-fade-in overflow-y-auto max-h-[85vh] py-4 custom-scrollbar">
            {/* Animated Trophy & XP Badge */}
            <div className="relative w-24 h-24 mx-auto">
              <div className="absolute inset-0 bg-amber-500/30 rounded-full blur-2xl animate-pulse" />
              <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-tr from-amber-400 via-yellow-500 to-amber-600 flex items-center justify-center shadow-[0_0_50px_rgba(245,158,11,0.8)] border border-amber-300">
                <Trophy className="w-12 h-12 text-white drop-shadow-md" />
              </div>
            </div>

            <div>
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-black uppercase tracking-widest border border-amber-500/30">
                +350 XP Earned
              </span>
              <h2 className="text-3xl font-black text-white mt-1">Workout Complete! 🎉</h2>
              <p className="text-xs text-slate-300 font-medium">Outstanding effort! You crushed Push Day.</p>
            </div>

            {/* Personal Record Trophy Banner */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-900/60 to-indigo-900/60 border border-purple-500/30 flex items-center justify-between text-left">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-purple-500/20 text-amber-400">
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-black text-white">New Personal Record! 🏆</div>
                  <div className="text-[10px] text-purple-200">Bench Press: 85.0 kg × 8 Reps (+2.5 kg)</div>
                </div>
              </div>
              <span className="text-xs font-black text-amber-400 bg-amber-500/20 px-2.5 py-1 rounded-lg">
                PR
              </span>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 text-xs">
              <div className="glass-panel p-2.5 rounded-2xl border border-white/10">
                <span className="text-slate-400 text-[9px] uppercase font-bold block">Duration</span>
                <div className="font-black text-white text-sm mt-0.5">{formatTime(workoutElapsedSeconds)}</div>
              </div>
              <div className="glass-panel p-2.5 rounded-2xl border border-white/10">
                <span className="text-slate-400 text-[9px] uppercase font-bold block">Cal Burned</span>
                <div className="font-black text-amber-400 text-sm mt-0.5">{workout.estCaloriesBurn} kcal</div>
              </div>
              <div className="glass-panel p-2.5 rounded-2xl border border-white/10">
                <span className="text-slate-400 text-[9px] uppercase font-bold block">Volume</span>
                <div className="font-black text-cyan-400 text-sm mt-0.5">8,450 kg</div>
              </div>
              <div className="glass-panel p-2.5 rounded-2xl border border-white/10">
                <span className="text-slate-400 text-[9px] uppercase font-bold block">Avg Rest</span>
                <div className="font-black text-purple-400 text-sm mt-0.5">72s</div>
              </div>
              <div className="glass-panel p-2.5 rounded-2xl border border-white/10">
                <span className="text-slate-400 text-[9px] uppercase font-bold block">Exercises</span>
                <span className="font-black text-emerald-400 text-sm mt-0.5 block">{workout.exercises.length}/{workout.exercises.length}</span>
              </div>
            </div>

            {/* AI Workout Analysis */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-cyan-500/30 text-left space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-black text-cyan-400">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>AI Session Diagnostics</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-medium">
                "Excellent Push Session. Chest activation reached <strong className="text-cyan-300">92% peak efficiency</strong>. Recovery is estimated to take <strong>36 hours</strong>. Progressive overload target: Increase Bench Press by <strong>2.5 kg</strong> next session."
              </p>
            </div>

            {/* Smart Recovery Recommendations */}
            <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-500/30 text-left space-y-2.5">
              <div className="text-xs font-black text-purple-300 uppercase tracking-wider">
                Smart Post-Workout Recommendations
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5 space-y-0.5">
                  <div className="text-slate-400 text-[9px] font-bold">Suggested Next Workout</div>
                  <div className="font-bold text-white">Pull Day (Lats & Biceps)</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5 space-y-0.5">
                  <div className="text-slate-400 text-[9px] font-bold">Recovery Window</div>
                  <div className="font-bold text-cyan-400">36 Hours Rest</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5 space-y-0.5">
                  <div className="text-slate-400 text-[9px] font-bold">Protein Intake</div>
                  <div className="font-bold text-emerald-400">40g within 2 Hours</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5 space-y-0.5">
                  <div className="text-slate-400 text-[9px] font-bold">Hydration Target</div>
                  <div className="font-bold text-blue-400">1.2L Water + Electrolytes</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Top Bar */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <button onClick={onClose} className="p-2 rounded-full glass-pill text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>

              <div className="text-center">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-cyan-400">Active Session</span>
                <h3 className="text-sm font-bold text-white">{workout.title}</h3>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600/20 text-cyan-400 font-extrabold text-xs border border-cyan-500/30">
                <Timer className="w-3.5 h-3.5" />
                {formatTime(workoutElapsedSeconds)}
              </div>
            </div>

            {/* Exercise Details */}
            <div className="space-y-4 my-auto">
              {/* Exercise Image Banner */}
              <div className="relative h-44 rounded-3xl overflow-hidden glass-panel border border-white/15 p-4 flex flex-col justify-between">
                <img
                  src="https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&q=80&w=600"
                  alt={currentExercise.name}
                  className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay"
                />
                <div className="relative z-10 flex justify-between items-start">
                  <span className="px-3 py-1 rounded-full bg-blue-600 text-white font-extrabold text-[10px] uppercase tracking-wider">
                    Exercise {currentExerciseIndex + 1} of {workout.exercises.length}
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-slate-900/80 text-cyan-400 font-bold text-[10px]">
                    {currentExercise.targetMuscle}
                  </span>
                </div>

                <div className="relative z-10">
                  <h2 className="text-xl font-black text-white">{currentExercise.name}</h2>
                  <p className="text-xs text-slate-300">
                    Target: {currentExercise.sets} Sets × {currentExercise.reps} Reps
                  </p>
                </div>
              </div>

              {/* Rest Countdown Timer Bar */}
              {isResting && restTimerSeconds !== null && (
                <div className="p-3 rounded-2xl bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-between text-xs text-emerald-300 animate-pulse">
                  <div className="flex items-center gap-2">
                    <Timer className="w-4 h-4" />
                    <span className="font-bold">Rest Timer Active</span>
                  </div>
                  <span className="text-base font-black text-white">{restTimerSeconds}s</span>
                </div>
              )}

              {/* Sets Interactive List */}
              <div className="space-y-2">
                {Array.from({ length: currentExercise.sets }).map((_, setIdx) => {
                  const sets = completedSets[currentExercise.id] || [];
                  const isDone = !!sets[setIdx];

                  return (
                    <div
                      key={setIdx}
                      onClick={() => toggleSet(currentExercise.id, setIdx)}
                      className={`p-3 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                        isDone
                          ? 'bg-blue-600/30 border-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.4)]'
                          : 'glass-card border-white/10 text-slate-300 hover:border-white/30'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                            isDone ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {setIdx + 1}
                        </div>
                        <span className="text-xs font-bold">Set {setIdx + 1}</span>
                      </div>

                      <div className="flex items-center gap-4 text-xs font-semibold">
                        <span>{currentExercise.reps} Reps</span>
                        <div
                          className={`w-6 h-6 rounded-lg flex items-center justify-center border ${
                            isDone ? 'bg-blue-500 border-blue-400 text-white' : 'border-slate-700'
                          }`}
                        >
                          {isDone && <Check className="w-4 h-4" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Controls */}
            <div className="space-y-3 pt-3 border-t border-white/10">
              <div className="flex items-center justify-between gap-3">
                <button
                  disabled={currentExerciseIndex === 0}
                  onClick={() => setCurrentExerciseIndex((p) => p - 1)}
                  className="p-3 rounded-2xl glass-card text-slate-300 hover:text-white disabled:opacity-30"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {currentExerciseIndex < workout.exercises.length - 1 ? (
                  <button
                    onClick={() => setCurrentExerciseIndex((p) => p + 1)}
                    className="flex-1 h-12 rounded-2xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-500 transition-all flex items-center justify-center gap-2"
                  >
                    Next Exercise <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleFinish}
                    className="flex-1 h-12 rounded-2xl bg-gradient-to-r from-emerald-500 to-blue-600 text-white font-bold text-xs shadow-lg flex items-center justify-center gap-2"
                  >
                    Finish Workout <Check className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
};
