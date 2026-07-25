import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Dumbbell,
  Target,
  Flame,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Zap,
  Info,
  Clock,
  Layers,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { Exercise } from '../types';
import { soundManager } from '../lib/soundManager';

interface ExerciseDetailModalProps {
  exercise: Exercise | null;
  isOpen: boolean;
  onClose: () => void;
  onStartWorkout?: () => void;
}

export const ExerciseDetailModal: React.FC<ExerciseDetailModalProps> = ({
  exercise,
  isOpen,
  onClose,
  onStartWorkout,
}) => {
  if (!isOpen || !exercise) return null;

  const handleClose = () => {
    soundManager.play('button_secondary');
    onClose();
  };

  // Mock instructions based on exercise name/type
  const getInstructions = (name: string) => {
    if (name.toLowerCase().includes('bench press')) {
      return [
        'Lie flat on the bench, feet firmly planted on the ground, shoulder-width apart.',
        'Grasp the barbell with a grip slightly wider than shoulder-width.',
        'Unrack the barbell, lower it smoothly to mid-chest while keeping elbows at ~45° angle.',
        'Drive through your feet and press the bar explosively back to the starting position.',
      ];
    } else if (name.toLowerCase().includes('shoulder') || name.toLowerCase().includes('press')) {
      return [
        'Sit or stand upright with core tightly braced and chest high.',
        'Hold dumbbells at shoulder level with palms facing forward or neutral.',
        'Press overhead smoothly without arching your lower back excessively.',
        'Lower under strict control back to shoulder height.',
      ];
    } else {
      return [
        'Assume starting position with neutral spine and core engaged.',
        'Execute movement focusing on mind-muscle connection with the target muscle.',
        'Squeeze hard at peak contraction for 1 second.',
        'Lower smoothly under controlled eccentric tension.',
      ];
    }
  };

  const instructions = getInstructions(exercise.name);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="w-full max-w-lg bg-[#080d1a] border border-white/15 rounded-t-[32px] sm:rounded-[32px] overflow-hidden shadow-2xl text-white max-h-[90vh] flex flex-col relative"
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-slate-900/80 text-slate-300 hover:text-white border border-white/20 backdrop-blur-md"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Hero Exercise Image */}
          <div className="relative h-64 shrink-0 overflow-hidden">
            <img
              src={
                exercise.imageUrl ||
                'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=800'
              }
              alt={exercise.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#080d1a] via-[#080d1a]/40 to-transparent" />

            {/* Badges on Hero Image */}
            <div className="absolute bottom-4 left-5 right-5 flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="px-2.5 py-1 rounded-full bg-blue-500/20 text-cyan-300 text-[10px] font-black uppercase tracking-wider border border-cyan-500/30 backdrop-blur-md">
                  {exercise.targetMuscle} Primary
                </span>
                <h2 className="text-2xl font-black text-white mt-1 drop-shadow-md">
                  {exercise.name}
                </h2>
              </div>

              <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-purple-600/30 border border-purple-500/40 backdrop-blur-md">
                <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span className="text-xs font-black text-purple-200">
                  {exercise.muscleActivationPct || 92}% Activation
                </span>
              </div>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="p-5 space-y-5 overflow-y-auto custom-scrollbar flex-1">
            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="p-2.5 rounded-2xl bg-slate-900/80 border border-white/10">
                <span className="text-[9px] text-slate-400 uppercase font-bold block">Sets x Reps</span>
                <span className="text-sm font-black text-white mt-0.5 block">
                  {exercise.sets} × {exercise.reps}
                </span>
              </div>
              <div className="p-2.5 rounded-2xl bg-slate-900/80 border border-white/10">
                <span className="text-[9px] text-slate-400 uppercase font-bold block">Suggested</span>
                <span className="text-sm font-black text-cyan-400 mt-0.5 block">
                  {exercise.weightKg ? `${exercise.weightKg} kg` : 'Bodyweight'}
                </span>
              </div>
              <div className="p-2.5 rounded-2xl bg-slate-900/80 border border-white/10">
                <span className="text-[9px] text-slate-400 uppercase font-bold block">Rest Time</span>
                <span className="text-sm font-black text-purple-400 mt-0.5 block">
                  {exercise.restSeconds}s
                </span>
              </div>
              <div className="p-2.5 rounded-2xl bg-slate-900/80 border border-white/10">
                <span className="text-[9px] text-slate-400 uppercase font-bold block">Equipment</span>
                <span className="text-xs font-bold text-slate-200 mt-0.5 block truncate">
                  {exercise.equipment || 'Gym Gear'}
                </span>
              </div>
            </div>

            {/* Target & Secondary Muscles */}
            <div className="space-y-2">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Target className="w-4 h-4 text-cyan-400" />
                Target Muscles
              </h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-xl bg-cyan-500/20 text-cyan-300 text-xs font-extrabold border border-cyan-500/30">
                  {exercise.targetMuscle} (Primary)
                </span>
                <span className="px-3 py-1 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold">
                  Triceps Brachii (Synergist)
                </span>
                <span className="px-3 py-1 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold">
                  Anterior Deltoid (Stabilizer)
                </span>
              </div>
            </div>

            {/* Step-by-Step Instructions */}
            <div className="space-y-2.5">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Execution Steps
              </h3>
              <div className="space-y-2">
                {instructions.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-slate-900/60 border border-white/5 flex gap-3 items-start"
                  >
                    <div className="w-6 h-6 rounded-full bg-blue-600/30 text-blue-400 font-black text-xs flex items-center justify-center shrink-0 border border-blue-500/30">
                      {idx + 1}
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-medium">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Pro Form Tips & Common Mistakes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-extrabold text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Pro Form Tip</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-snug">
                  Keep scapula retracted and depressed throughout the entire motion to maximize pectoral tension and protect shoulders.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-extrabold text-amber-400">
                  <AlertCircle className="w-4 h-4" />
                  <span>Common Mistake</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-snug">
                  Bouncing the weight off your chest or flaring elbows 90 degrees outward, which causes rotator cuff strain.
                </p>
              </div>
            </div>

            {/* Alternative Exercises */}
            <div className="space-y-2">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-purple-400" />
                Alternative Movements
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-white/10 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white">Dumbbell Bench Press</div>
                    <div className="text-[9px] text-slate-400">Dumbbells • Higher ROM</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-white/10 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white">Chest Press Machine</div>
                    <div className="text-[9px] text-slate-400">Machine • Constant Tension</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Action Footer */}
          <div className="p-4 border-t border-white/10 bg-slate-950/80 backdrop-blur-md flex gap-3">
            <button
              onClick={handleClose}
              className="flex-1 h-12 rounded-2xl bg-slate-900 border border-white/10 text-slate-300 font-bold text-xs hover:bg-slate-800 transition-all"
            >
              Close
            </button>
            {onStartWorkout && (
              <button
                onClick={() => {
                  handleClose();
                  onStartWorkout();
                }}
                className="flex-[2] h-12 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-extrabold text-xs shadow-[0_0_20px_rgba(59,130,246,0.6)] hover:shadow-[0_0_30px_rgba(59,130,246,0.9)] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4 fill-current" />
                Start Today's Workout
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
